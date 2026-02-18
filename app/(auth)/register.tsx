import { Link, router } from "expo-router";
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

import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import AuthHeader from "../components/auth/AuthHeader";
import AppButton from "../components/common/AppButton";
import AppInput from "../components/common/AppInput";
import { colors } from "../constants/colors";
import { useAlert } from "../utils/AlertManager";
import { registerApi } from "../utils/api/auth.api";

type RegisterForm = {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

export default function RegisterScreen() {
  const { showAlert } = useAlert();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation refs for each field
  const nameShakeAnimation = useRef(new Animated.Value(0)).current;
  const phoneShakeAnimation = useRef(new Animated.Value(0)).current;
  const emailShakeAnimation = useRef(new Animated.Value(0)).current;
  const passwordShakeAnimation = useRef(new Animated.Value(0)).current;
  const confirmPasswordShakeAnimation = useRef(new Animated.Value(0)).current;

  const updateField = (key: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const shakeField = (field: keyof RegisterForm) => {
    let animation;
    switch (field) {
      case "name":
        animation = nameShakeAnimation;
        break;
      case "phone":
        animation = phoneShakeAnimation;
        break;
      case "email":
        animation = emailShakeAnimation;
        break;
      case "password":
        animation = passwordShakeAnimation;
        break;
      case "confirmPassword":
        animation = confirmPasswordShakeAnimation;
        break;
      default:
        return;
    }

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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{8,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!accepted) {
      showAlert(
        "Terms Required: You must accept the Terms & Conditions and Privacy Policy.",
        "error",
      );
    }

    setErrors(newErrors);

    // Trigger shake animation for fields with errors
    if (newErrors.name) shakeField("name");
    if (newErrors.phone) shakeField("phone");
    if (newErrors.email) shakeField("email");
    if (newErrors.password) shakeField("password");
    if (newErrors.confirmPassword) shakeField("confirmPassword");

    return Object.keys(newErrors).length === 0 && accepted;
  };

  const isFormValid =
    form.name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    accepted;

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await registerApi(form as any);
      showAlert("Registration successful!", "success");
      // clear form
      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      router.replace("/login");
    } catch (err: any) {
      // Check if error is related to specific fields
      const errorMessage = err.message?.toLowerCase() || "";

      if (errorMessage.includes("name")) {
        setErrors((prev) => ({ ...prev, name: err.message }));
        shakeField("name");
      } else if (
        errorMessage.includes("phone") ||
        errorMessage.includes("number")
      ) {
        setErrors((prev) => ({ ...prev, phone: err.message }));
        shakeField("phone");
      } else if (errorMessage.includes("email")) {
        setErrors((prev) => ({ ...prev, email: err.message }));
        shakeField("email");
      } else if (errorMessage.includes("password")) {
        setErrors((prev) => ({ ...prev, password: err.message }));
        shakeField("password");
      } else {
        // For general errors, show alert
        showAlert(err.message, "error");
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* LOGO AREA */}
            <View style={styles.logoContainer}>
              {/* Replace with your real logo */}
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.logo}
              />
              <Text style={styles.logoText}>Need Connect</Text>
            </View>

            <AuthHeader
              title="Create Account"
              subtitle="Get started in seconds"
            />

            <View style={styles.form}>
              {/* FULL NAME */}
              <View>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      transform: [
                        {
                          translateX: nameShakeAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  <AppInput
                    placeholder="Full Name"
                    value={form.name}
                    onChangeText={(v: string) => updateField("name", v)}
                    style={styles.inputWithIcon}
                  />
                  <Feather
                    name="user"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                </Animated.View>
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* PHONE */}
              <View>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      transform: [
                        {
                          translateX: phoneShakeAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  <AppInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={form.phone}
                    onChangeText={(v: string) => updateField("phone", v)}
                    style={styles.inputWithIcon}
                  />
                  <Feather
                    name="phone"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                </Animated.View>
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              {/* EMAIL */}
              <View>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      transform: [
                        {
                          translateX: emailShakeAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  <AppInput
                    placeholder="Email (optional)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(v: string) => updateField("email", v)}
                    style={styles.inputWithIcon}
                  />
                  <Feather
                    name="mail"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                </Animated.View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* PASSWORD */}
              <View>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      transform: [
                        {
                          translateX: passwordShakeAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  <AppInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(v: string) => updateField("password", v)}
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

              {/* CONFIRM PASSWORD */}
              <View>
                <Animated.View
                  style={[
                    styles.inputWrapper,
                    {
                      transform: [
                        {
                          translateX: confirmPasswordShakeAnimation,
                        },
                      ],
                    },
                  ]}
                >
                  <AppInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={form.confirmPassword}
                    onChangeText={(v: string) =>
                      updateField("confirmPassword", v)
                    }
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
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              {/* CHECKBOX */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[styles.checkbox, accepted && styles.checkboxChecked]}
                  onPress={() => setAccepted(!accepted)}
                >
                  {accepted && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <Text style={styles.checkboxText}>
                  I agree to the{" "}
                  <Link href="/login">
                    <Text style={styles.link}>Terms & Conditions</Text>
                  </Link>{" "}
                  and{" "}
                  <Link href="/login">
                    <Text style={styles.link}>Privacy Policy</Text>
                  </Link>
                </Text>
              </View>

              <AppButton
                title="Register"
                onPress={handleRegister}
                disabled={!isFormValid}
              />
            </View>

            {/* LOGIN */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Link href="/login">
                <Text style={styles.loginLink}>Login</Text>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#7e7878",
  },

  logo: {
    width: 80,
    height: 80,
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

  inputWithIcon: {
    paddingRight: 40, // Make room for the icon
  },

  inputIcon: {
    position: "absolute",
    right: 12,
    top: "38%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },

  passwordIcon: {
    position: "absolute",
    right: 8,
    top: "35%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
    padding: 5, // Makes touch area larger
  },

  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1.5,
    borderColor: "#4A6CF7",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 3,
  },

  checkboxChecked: {
    backgroundColor: "#4A6CF7",
  },

  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },

  link: {
    color: "#4A6CF7",
    fontWeight: "600",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 14,
    color: "#666",
  },

  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6CF7",
  },
});
