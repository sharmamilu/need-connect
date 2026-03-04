import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OTPTextView from "react-native-otp-textinput";
import AuthHeader from "../components/auth/AuthHeader";
import AppButton from "../components/common/AppButton";
import AppInput from "../components/common/AppInput";
import { colors } from "../constants/colors";
import { useAlert } from "../utils/AlertManager";
import { resetPasswordApi, verifyResetCodeApi } from "../utils/api/auth.api";

export default function ResetPassword() {
  const { showAlert } = useAlert();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [token, setToken] = useState("");
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // We no longer need tokenShakeAnimation or passwordShakeAnimation since we only shake the whole form now
  const passwordShakeAnimation = useRef(new Animated.Value(0)).current;
  const confirmPasswordShakeAnimation = useRef(new Animated.Value(0)).current;

  // Provide fallback email string
  const userEmail = email || "";

  const shakeField = (field: "password" | "confirmPassword") => {
    let animation;
    if (field === "password") animation = passwordShakeAnimation;
    else animation = confirmPasswordShakeAnimation;
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validatePasswords = (): boolean => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword) {
      newErrors.password = "New password is required";
      shakeField("password");
    } else if (newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      shakeField("password");
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      shakeField("confirmPassword");
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      shakeField("confirmPassword");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyCode = async () => {
    if (token.length !== 6 || isVerifying) return;

    setIsVerifying(true);
    try {
      if (!userEmail) {
        throw new Error("Missing email context. Please request a new code.");
      }

      await verifyResetCodeApi({ email: userEmail, code: token });
      setStep("reset");
    } catch (err: any) {
      showAlert(err.message || "Invalid or expired reset code", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePasswords() || isLoading) return;

    setIsLoading(true);
    try {
      await resetPasswordApi({
        email: userEmail,
        code: token,
        newPassword,
      });
      showAlert("Password successfully reset! You can now login.", "success");
      router.replace("/login");
    } catch (err: any) {
      showAlert(err.message || "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isPasswordsValid =
    newPassword.trim() !== "" && confirmPassword.trim() !== "";

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* LOGO AREA */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.logo}
              />
              <Text style={styles.logoText}>Need Connect</Text>
            </View>

            {step === "verify" ? (
              <AuthHeader
                title="Verify Reset Code"
                subtitle={`Enter the 6-digit code sent to\n${userEmail}`}
              />
            ) : (
              <AuthHeader
                title="Create New Password"
                subtitle="Your new password must be different from previous used passwords."
              />
            )}

            <View style={styles.form}>
              {step === "verify" && (
                <View style={styles.otpContainer}>
                  <OTPTextView
                    handleTextChange={setToken}
                    inputCount={6}
                    keyboardType="numeric"
                    tintColor={colors.primary}
                    offTintColor="#E0E0E0"
                    textInputStyle={styles.otpInput}
                    containerStyle={styles.otpInputContainer}
                  />

                  <AppButton
                    title="Verify Code"
                    onPress={handleVerifyCode}
                    disabled={token.length !== 6 || isVerifying}
                    isLoading={isVerifying}
                  />
                </View>
              )}

              {step === "reset" && (
                <>
                  {/* NEW PASSWORD */}
                  <View>
                    <Animated.View
                      style={[
                        styles.inputWrapper,
                        { transform: [{ translateX: passwordShakeAnimation }] },
                      ]}
                    >
                      <AppInput
                        placeholder="New Password"
                        secureTextEntry={!showPassword}
                        value={newPassword}
                        onChangeText={(v: string) => {
                          setNewPassword(v);
                          setErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }}
                        style={styles.inputWithIcon}
                      />
                      <TouchableOpacity
                        onPress={toggleShowPassword}
                        style={styles.passwordIcon}
                      >
                        <Feather
                          name={showPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* CONFIRM NEW PASSWORD */}
                  <View>
                    <Animated.View
                      style={[
                        styles.inputWrapper,
                        {
                          transform: [
                            { translateX: confirmPasswordShakeAnimation },
                          ],
                        },
                      ]}
                    >
                      <AppInput
                        placeholder="Confirm New Password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={(v: string) => {
                          setConfirmPassword(v);
                          setErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }}
                        style={styles.inputWithIcon}
                      />
                      <TouchableOpacity
                        onPress={toggleShowConfirmPassword}
                        style={styles.passwordIcon}
                      >
                        <Feather
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  <AppButton
                    title="Reset Password"
                    onPress={handleResetPassword}
                    disabled={!isPasswordsValid || isLoading}
                    isLoading={isLoading}
                  />
                </>
              )}
            </View>

            <View style={styles.loginContainer}>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Back to Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#4A6CF7",
    letterSpacing: 0.5,
    marginTop: 6,
  },

  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },

  form: {
    marginTop: 12,
    gap: 14,
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  otpContainer: {
    marginTop: 10,
  },

  otpInputContainer: {
    marginBottom: 20,
    justifyContent: "space-between",
  },

  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderRadius: 12,
    borderBottomWidth: 1.5,
    backgroundColor: "#FAFAFA",
    fontSize: 22,
    color: "#333",
  },

  inputWithIcon: {
    paddingRight: 40,
  },

  inputIcon: {
    position: "absolute",
    right: 12,
    top: "39%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },

  passwordIcon: {
    position: "absolute",
    right: 12,
    top: "34%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
    padding: 5,
  },

  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6CF7",
  },
});
