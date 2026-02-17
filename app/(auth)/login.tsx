import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
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

import AuthHeader from "../components/auth/AuthHeader";
import AppButton from "../components/common/AppButton";
import AppInput from "../components/common/AppInput";
import { colors } from "../constants/colors";
import { useAlert } from "../utils/AlertManager";
import { loginApi } from "../utils/api/auth.api";

type LoginForm = {
  phone: string;
  password: string;
};

type FormErrors = Partial<Record<keyof LoginForm, string>>;

export default function Login() {
  const { showAlert } = useAlert();
  const [form, setForm] = useState<LoginForm>({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Animation refs for each field
  const phoneShakeAnimation = useRef(new Animated.Value(0)).current;
  const passwordShakeAnimation = useRef(new Animated.Value(0)).current;

  const updateField = (key: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const shakeField = (field: keyof LoginForm) => {
    const animation =
      field === "phone" ? phoneShakeAnimation : passwordShakeAnimation;

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

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{8,15}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // Trigger shake animation for fields with errors
    if (newErrors.phone) {
      shakeField("phone");
    }
    if (newErrors.password) {
      shakeField("password");
    }

    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = form.phone.trim() !== "" && form.password.trim() !== "";

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await loginApi(form as any);
      showAlert("Login successful!", "success");
      router.replace("/(tabs)/dashboard" as any);
    } catch (err: any) {
      // Check if error is related to specific fields
      const errorMessage = err.message?.toLowerCase() || "";

      if (errorMessage.includes("phone") || errorMessage.includes("number")) {
        setErrors((prev) => ({ ...prev, phone: err.message }));
        shakeField("phone");
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

  return (
    <KeyboardAvoidingView
      style={styles.screen}
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
            title="Welcome Back"
            subtitle="Login using your phone number"
          />

          <View style={styles.form}>
            {/* PHONE NUMBER */}
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

            {/* FORGOT PASSWORD LINK */}
            <View style={styles.forgotContainer}>
              <Link href="/login">
                <Text style={styles.forgotLink}>Forgot Password?</Text>
              </Link>
            </View>

            <AppButton
              title="Login"
              onPress={handleLogin}
              disabled={!isFormValid}
            />
          </View>

          {/* REGISTER LINK */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/register">
              <Text style={styles.registerLink}>Register</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: 5, // Makes touch area larger
  },

  errorText: {
    color: "#E53935",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -5,
    marginBottom: 5,
  },

  forgotLink: {
    fontSize: 14,
    color: "#4A6CF7",
    fontWeight: "500",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  registerText: {
    fontSize: 14,
    color: "#666",
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A6CF7",
  },
});
