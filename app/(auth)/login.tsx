import { Feather } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AuthHeader from "../components/auth/AuthHeader";
import AuthScreen from "../components/auth/AuthScreen";
import AppButton from "../components/common/AppButton";
import FormField, {
  FormFieldHandle,
} from "../components/common/FormField";
import { colors } from "../constants/colors";
import { loginApi } from "../utils/api/auth.api";
import { useAuth } from "../utils/AuthContext";
import { getToken } from "../utils/storage";

type LoginForm = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginForm, string>>;

export default function Login() {
  const { login } = useAuth();
  const { email: prefillEmail } = useLocalSearchParams<{ email?: string }>();
  const [form, setForm] = useState<LoginForm>({
    email: prefillEmail || "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailRef = useRef<FormFieldHandle>(null);
  const passwordRef = useRef<FormFieldHandle>(null);

  // Already logged in? Skip straight to the app.
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) router.replace("/" as any);
    })();
  }, []);

  const updateField = (key: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setGeneralError("");
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.email.trim()) {
      next.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!form.password) {
      next.password = "Password is required";
    }

    setErrors(next);
    if (next.email) emailRef.current?.shake();
    if (next.password) passwordRef.current?.shake();

    return Object.keys(next).length === 0;
  };

  const isFormValid = form.email.trim() !== "" && form.password.trim() !== "";

  const handleLogin = async () => {
    if (isSubmitting || !validate()) return;

    setGeneralError("");
    setIsSubmitting(true);
    try {
      const response = await loginApi({
        email: form.email.trim(),
        password: form.password,
      });

      if (response?.data?.token && response?.data?.user) {
        await login(response.data.token, response.data.user);
        router.replace("/" as any);
      } else {
        setGeneralError("Unexpected response from server. Please try again.");
      }
    } catch (err: any) {
      const message = err?.message || "Login failed. Please try again.";
      const lower = message.toLowerCase();

      // Only attach to a specific field when the server clearly targets one.
      if (lower.includes("valid email") || lower.includes("email is required")) {
        setErrors((prev) => ({ ...prev, email: message }));
        emailRef.current?.shake();
      } else {
        // Credential failures + network/server errors → general banner.
        setGeneralError(message);
        emailRef.current?.shake();
        passwordRef.current?.shake();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Welcome Back"
        subtitle="Log in to continue to your account"
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
          returnKeyType="next"
          value={form.email}
          onChangeText={(v) => updateField("email", v)}
          error={errors.email}
        />

        <FormField
          ref={passwordRef}
          icon="lock"
          placeholder="Password"
          isPassword
          secureVisible={showPassword}
          onToggleSecure={() => setShowPassword((s) => !s)}
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          value={form.password}
          onChangeText={(v) => updateField("password", v)}
          error={errors.password}
        />

        <View style={styles.forgotContainer}>
          <Link href="/forgot-password" asChild>
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <AppButton
          title="Log In"
          loadingTitle="Logging in..."
          onPress={handleLogin}
          disabled={!isFormValid}
          isLoading={isSubmitting}
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don&apos;t have an account? </Text>
        <Link href="/register" asChild>
          <TouchableOpacity hitSlop={8}>
            <Text style={styles.registerLink}>Sign Up</Text>
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
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -4,
  },
  forgotLink: {
    fontSize: 13.5,
    color: colors.primary,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },
  registerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
