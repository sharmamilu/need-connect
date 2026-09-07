import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

type AuthScreenProps = {
  children: React.ReactNode;
};

/**
 * Shared chrome for every auth screen: soft gradient backdrop, keyboard
 * handling, centred card, branded logo and a gentle fade/slide-in entrance.
 */
export default function AuthScreen({ children }: AuthScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <LinearGradient
      colors={[colors.primarySoft, colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[styles.card, { opacity, transform: [{ translateY }] }]}
            >
              <View style={styles.logoContainer}>
                <View style={styles.logoBadge}>
                  <Image
                    source={require("../../assets/images/icon.png")}
                    style={styles.logo}
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.logoText}>Need Connect</Text>
              </View>

              {children}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  screen: { flex: 1 },
  flex: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 26,
    shadowColor: "#0B1B3A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 46,
    height: 46,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: 0.5,
    marginTop: 10,
  },
});
