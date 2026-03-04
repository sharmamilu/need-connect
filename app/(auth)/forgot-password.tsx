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
import { SafeAreaView } from "react-native-safe-area-context";

import AuthHeader from "../components/auth/AuthHeader";
import AppButton from "../components/common/AppButton";
import AppInput from "../components/common/AppInput";
import { colors } from "../constants/colors";
import { useAlert } from "../utils/AlertManager";
import { forgotPasswordApi } from "../utils/api/auth.api";

export default function ForgotPassword() {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailShakeAnimation = useRef(new Animated.Value(0)).current;

  const shakeEmail = () => {
    Animated.sequence([
      Animated.timing(emailShakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(emailShakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(emailShakeAnimation, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(emailShakeAnimation, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(emailShakeAnimation, {
        toValue: 2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(emailShakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validate = (): boolean => {
    if (!email.trim()) {
      setError("Email address is required");
      shakeEmail();
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address");
      shakeEmail();
      return false;
    }
    setError("");
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validate() || isLoading) return;

    setIsLoading(true);
    try {
      await forgotPasswordApi({ email });
      showAlert("Password reset code sent to your email", "success");
      // Redirect the user to verification screen with the typed email passed as a query param
      router.push(`/reset-password?email=${encodeURIComponent(email)}` as any);
    } catch (err: any) {
      const errorMessage = err.message?.toLowerCase() || "";
      if (errorMessage.includes("email")) {
        setError(err.message);
        shakeEmail();
      } else {
        showAlert(err.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== "";

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

            <AuthHeader
              title="Forgot Password"
              subtitle="Enter your email to receive a 6-digit reset code"
            />

            <View style={styles.form}>
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
                    placeholder="Email Address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(val: string) => {
                      setEmail(val);
                      setError("");
                    }}
                    style={styles.inputWithIcon}
                  />
                  <Feather
                    name="mail"
                    size={20}
                    color="#999"
                    style={styles.inputIcon}
                  />
                </Animated.View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <AppButton
                title="Send Reset Code"
                onPress={handleForgotPassword}
                disabled={!isFormValid || isLoading}
                isLoading={isLoading}
              />
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
