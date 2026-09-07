import { Feather } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OTPTextView from "react-native-otp-textinput";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthScreen from "@/components/auth/AuthScreen";
import AppButton from "@/components/common/AppButton";
import FormField, {
  FormFieldHandle,
} from "@/components/common/FormField";
import { colors } from "@/constants/colors";
import { useAlert } from "@/utils/AlertManager";
import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyResetCodeApi,
} from "@/utils/api/auth.api";

export default function ResetPassword() {
  const { showAlert } = useAlert();
  const { email } = useLocalSearchParams<{ email: string }>();
  const userEmail = email || "";

  const [token, setToken] = useState("");
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordRef = useRef<FormFieldHandle>(null);
  const confirmPasswordRef = useRef<FormFieldHandle>(null);

  const validatePasswords = (): boolean => {
    const next: typeof errors = {};

    if (!newPassword) {
      next.password = "New password is required";
    } else if (newPassword.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    if (next.password) passwordRef.current?.shake();
    if (next.confirmPassword) confirmPasswordRef.current?.shake();
    return Object.keys(next).length === 0;
  };

  const handleVerifyCode = async () => {
    if (token.length !== 6 || isVerifying) return;

    setGeneralError("");
    setIsVerifying(true);
    try {
      if (!userEmail) {
        throw new Error("Missing email context. Please request a new code.");
      }
      await verifyResetCodeApi({ email: userEmail, code: token });
      setStep("reset");
    } catch (err: any) {
      setGeneralError(err?.message || "Invalid or expired reset code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (isResending || !userEmail) return;
    setGeneralError("");
    setIsResending(true);
    try {
      await forgotPasswordApi({ email: userEmail });
      showAlert("A new reset code has been sent.", "success");
    } catch (err: any) {
      setGeneralError(err?.message || "Couldn't resend the code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async () => {
    if (isLoading || !validatePasswords()) return;

    setGeneralError("");
    setIsLoading(true);
    try {
      await resetPasswordApi({ email: userEmail, code: token, newPassword });
      showAlert("Password reset! You can now log in.", "success");
      router.replace(`/login?email=${encodeURIComponent(userEmail)}` as any);
    } catch (err: any) {
      setGeneralError(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordsValid =
    newPassword.trim() !== "" && confirmPassword.trim() !== "";

  return (
    <AuthScreen>
      {step === "verify" ? (
        <AuthHeader
          title="Verify Code"
          subtitle={`Enter the 6-digit code sent to\n${userEmail}`}
        />
      ) : (
        <AuthHeader
          title="Create New Password"
          subtitle="Choose a new password you haven't used before"
        />
      )}

      {generalError ? (
        <View style={styles.banner}>
          <Feather name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.bannerText}>{generalError}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        {step === "verify" && (
          <View>
            <OTPTextView
              handleTextChange={setToken}
              inputCount={6}
              keyboardType="numeric"
              tintColor={colors.primary}
              offTintColor={colors.border}
              textInputStyle={styles.otpInput}
              containerStyle={styles.otpInputContainer}
            />

            <AppButton
              title="Verify Code"
              loadingTitle="Verifying..."
              onPress={handleVerifyCode}
              disabled={token.length !== 6}
              isLoading={isVerifying}
            />

            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending}
              style={styles.resendRow}
              hitSlop={8}
            >
              <Text style={styles.resendText}>
                Didn&apos;t get a code?{" "}
                <Text style={styles.resendLink}>
                  {isResending ? "Sending..." : "Resend"}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === "reset" && (
          <>
            <FormField
              ref={passwordRef}
              icon="lock"
              placeholder="New Password"
              isPassword
              secureVisible={showPassword}
              onToggleSecure={() => setShowPassword((s) => !s)}
              value={newPassword}
              onChangeText={(v) => {
                setNewPassword(v);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
            />

            <FormField
              ref={confirmPasswordRef}
              icon="lock"
              placeholder="Confirm New Password"
              isPassword
              secureVisible={showConfirmPassword}
              onToggleSecure={() => setShowConfirmPassword((s) => !s)}
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
            />

            <AppButton
              title="Reset Password"
              loadingTitle="Resetting..."
              onPress={handleResetPassword}
              disabled={!isPasswordsValid}
              isLoading={isLoading}
            />
          </>
        )}
      </View>

      <View style={styles.backContainer}>
        <Link href="/login" asChild>
          <TouchableOpacity hitSlop={8} style={styles.backRow}>
            <Feather name="arrow-left" size={16} color={colors.primary} />
            <Text style={styles.backLink}>Back to Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 4,
    gap: 16,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.errorSoft,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  bannerText: {
    flex: 1,
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
  },
  otpInputContainer: {
    marginBottom: 22,
    justifyContent: "space-between",
  },
  otpInput: {
    width: 46,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    borderBottomWidth: 1.5,
    backgroundColor: colors.inputBg,
    fontSize: 22,
    color: colors.text,
  },
  resendRow: {
    alignItems: "center",
    marginTop: 18,
  },
  resendText: {
    fontSize: 13.5,
    color: colors.textMuted,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: "700",
  },
  backContainer: {
    alignItems: "center",
    marginTop: 26,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
