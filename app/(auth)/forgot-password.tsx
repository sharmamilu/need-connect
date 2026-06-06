import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AuthHeader from "../components/auth/AuthHeader";
import AuthScreen from "../components/auth/AuthScreen";
import AppButton from "../components/common/AppButton";
import FormField, {
  FormFieldHandle,
} from "../components/common/FormField";
import { colors } from "../constants/colors";
import { forgotPasswordApi } from "../utils/api/auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<FormFieldHandle>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError("Email address is required");
      emailRef.current?.shake();
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address");
      emailRef.current?.shake();
      return false;
    }
    setError("");
    return true;
  };

  const handleForgotPassword = async () => {
    if (isLoading || !validate()) return;

    setGeneralError("");
    setIsLoading(true);
    try {
      await forgotPasswordApi({ email: email.trim() });
      router.push(
        `/reset-password?email=${encodeURIComponent(email.trim())}` as any,
      );
    } catch (err: any) {
      const message = err?.message || "Something went wrong. Please try again.";
      if (message.toLowerCase().includes("no user")) {
        setError(message);
        emailRef.current?.shake();
      } else {
        setGeneralError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== "";

  return (
    <AuthScreen>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a 6-digit reset code"
      />

      {generalError ? (
        <View style={styles.banner}>
          <Feather name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.bannerText}>{generalError}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <FormField
          ref={emailRef}
          icon="mail"
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={handleForgotPassword}
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError("");
            setGeneralError("");
          }}
          error={error}
        />

        <AppButton
          title="Send Reset Code"
          loadingTitle="Sending..."
          onPress={handleForgotPassword}
          disabled={!isFormValid}
          isLoading={isLoading}
        />
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
