import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AuthHeader from "../components/auth/AuthHeader";
import AuthScreen from "../components/auth/AuthScreen";
import AppButton from "../components/common/AppButton";
import FormField, {
  FormFieldHandle,
} from "../components/common/FormField";
import { colors } from "../constants/colors";
import { useAlert } from "../utils/AlertManager";
import { registerApi } from "../utils/api/auth.api";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

export default function RegisterScreen() {
  const { showAlert } = useAlert();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirthObject, setDateOfBirthObject] = useState<Date | null>(null);

  const nameRef = useRef<FormFieldHandle>(null);
  const emailRef = useRef<FormFieldHandle>(null);
  const passwordRef = useRef<FormFieldHandle>(null);
  const confirmPasswordRef = useRef<FormFieldHandle>(null);
  const dobShake = useRef(new Animated.Value(0)).current;

  const shakeDob = () => {
    Animated.sequence([
      Animated.timing(dobShake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(dobShake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(dobShake, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(dobShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const updateField = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setGeneralError("");
  };

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "Full name is required";

    if (!form.email.trim()) {
      next.email = "Email address is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!form.dateOfBirth.trim()) next.dateOfBirth = "Date of birth is required";

    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    if (next.name) nameRef.current?.shake();
    if (next.email) emailRef.current?.shake();
    if (next.password) passwordRef.current?.shake();
    if (next.confirmPassword) confirmPasswordRef.current?.shake();
    if (next.dateOfBirth) shakeDob();

    if (!accepted) {
      setGeneralError(
        "Please accept the Terms & Conditions and Privacy Policy to continue.",
      );
    }

    return Object.keys(next).length === 0 && accepted;
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "transparent", width: "0%" };
    if (
      pwd.length >= 8 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    ) {
      return { label: "Strong", color: colors.success, width: "100%" };
    }
    if (pwd.length >= 6) {
      return { label: "Medium", color: colors.warning, width: "66%" };
    }
    return { label: "Weak", color: colors.error, width: "33%" };
  };

  const strength = getPasswordStrength(form.password);

  const isFormValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.dateOfBirth.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    accepted;

  const handleRegister = async () => {
    if (isSubmitting || !validate()) return;

    setGeneralError("");
    setIsSubmitting(true);
    try {
      await registerApi({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        dateOfBirth: form.dateOfBirth,
      });
      showAlert("Account created! Please log in.", "success");
      router.replace(
        `/login?email=${encodeURIComponent(form.email.trim())}` as any,
      );
    } catch (err: any) {
      const message = err?.message || "Registration failed. Please try again.";
      const lower = message.toLowerCase();

      if (lower.includes("already registered")) {
        setErrors((prev) => ({ ...prev, email: message }));
        emailRef.current?.shake();
      } else if (lower.includes("valid email")) {
        setErrors((prev) => ({ ...prev, email: message }));
        emailRef.current?.shake();
      } else if (lower.includes("password")) {
        setErrors((prev) => ({ ...prev, password: message }));
        passwordRef.current?.shake();
      } else if (lower.includes("name")) {
        setErrors((prev) => ({ ...prev, name: message }));
        nameRef.current?.shake();
      } else {
        setGeneralError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirthObject(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      updateField("dateOfBirth", `${day}/${month}/${year}`);
    }
  };

  return (
    <AuthScreen>
      <AuthHeader title="Create Account" subtitle="Get started in seconds" />

      {generalError ? (
        <View style={styles.banner}>
          <Feather name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.bannerText}>{generalError}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <FormField
          ref={nameRef}
          icon="user"
          placeholder="Full Name"
          autoCapitalize="words"
          value={form.name}
          onChangeText={(v) => updateField("name", v)}
          error={errors.name}
        />

        {/* DATE OF BIRTH */}
        <View>
          <Animated.View style={{ transform: [{ translateX: dobShake }] }}>
            <TouchableOpacity
              style={[styles.dob, errors.dateOfBirth && styles.dobError]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Feather
                name="calendar"
                size={19}
                color={errors.dateOfBirth ? colors.error : colors.placeholder}
              />
              <Text
                style={[
                  styles.dobText,
                  !form.dateOfBirth && styles.dobPlaceholder,
                ]}
              >
                {form.dateOfBirth || "Date of Birth (DD/MM/YYYY)"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirthObject || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          {errors.dateOfBirth ? (
            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
          ) : null}
        </View>

        <FormField
          ref={emailRef}
          icon="mail"
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          value={form.email}
          onChangeText={(v) => updateField("email", v)}
          error={errors.email}
        />

        {/* PASSWORD + STRENGTH */}
        <View>
          <FormField
            ref={passwordRef}
            icon="lock"
            placeholder="Password"
            isPassword
            secureVisible={showPassword}
            onToggleSecure={() => setShowPassword((s) => !s)}
            value={form.password}
            onChangeText={(v) => updateField("password", v)}
            error={errors.password}
          />
          {form.password.length > 0 && !errors.password && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarBg}>
                <View
                  style={[
                    styles.strengthBarFill,
                    {
                      width: strength.width as any,
                      backgroundColor: strength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}
        </View>

        <FormField
          ref={confirmPasswordRef}
          icon="lock"
          placeholder="Confirm Password"
          isPassword
          secureVisible={showConfirmPassword}
          onToggleSecure={() => setShowConfirmPassword((s) => !s)}
          value={form.confirmPassword}
          onChangeText={(v) => updateField("confirmPassword", v)}
          error={errors.confirmPassword}
        />

        {/* TERMS */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => {
            setAccepted((a) => !a);
            setGeneralError("");
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <Feather name="check" size={13} color="#fff" />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to the{" "}
            <Link href={"/terms" as any} style={styles.link}>
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href={"/policy" as any} style={styles.link}>
              Privacy Policy
            </Link>
          </Text>
        </TouchableOpacity>

        <AppButton
          title="Create Account"
          loadingTitle="Creating account..."
          onPress={handleRegister}
          disabled={!isFormValid}
          isLoading={isSubmitting}
        />
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Link href="/login" asChild>
          <TouchableOpacity hitSlop={8}>
            <Text style={styles.loginLink}>Log In</Text>
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
  dob: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  dobError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  dobText: {
    fontSize: 15.5,
    color: colors.text,
    flex: 1,
  },
  dobPlaceholder: {
    color: colors.placeholder,
  },
  errorText: {
    color: colors.error,
    fontSize: 12.5,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 4,
    gap: 10,
  },
  strengthBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 11,
    fontWeight: "700",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },
  loginText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});
