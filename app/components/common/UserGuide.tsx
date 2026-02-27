import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const GUIDE_KEY = "has_seen_first_time_guide";

const STEPS = [
  {
    id: "create_post",
    title: "Share Your Voice",
    text: "Tap here to express yourself. Create a new post, share thoughts, or drop an image into the community feed!",
    position: "top",
    top: Platform.OS === "ios" ? 110 : 90,
    left: width * 0.5 - 20,
  },
  {
    id: "explore",
    title: "Discover Connections",
    text: "Dive into the Explore tab to find highly-rated active professionals and detailed portfolios.",
    position: "bottom",
    bottom: Platform.OS === "ios" ? 90 : 80,
    left: width * 0.3 - 20,
  },
  {
    id: "listings",
    title: "The Marketplace",
    text: "Browse verified local goods, request items, or securely list your own items for sale.",
    position: "bottom",
    bottom: Platform.OS === "ios" ? 90 : 80,
    left: width * 0.5 - 20,
  },
  {
    id: "portfolio",
    title: "Your Professional Identity",
    text: "Build out, edit, and publish your own professional profile so peers can easily hire you.",
    position: "bottom",
    bottom: Platform.OS === "ios" ? 90 : 80,
    left: width * 0.7 - 20,
  },
  {
    id: "profile",
    title: "Account Settings",
    text: "Adjust your private account settings, review your feed history, and view your personal rating right here.",
    position: "bottom",
    bottom: Platform.OS === "ios" ? 90 : 80,
    left: width * 0.9 - 20,
  },
];

export default function UserGuide() {
  const [visible, setVisible] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Focus Circle Animation
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkGuideStatus();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [visible]);

  const checkGuideStatus = async () => {
    try {
      // Force it to show every time for testing purposes (ignores cache)
      setTimeout(() => setVisible(true), 500);
    } catch (e) {
      console.log("Error checking guide status:", e);
    }
  };

  const handleNext = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finished guide
      setVisible(false);
      try {
        await AsyncStorage.setItem(GUIDE_KEY, "true");
      } catch (e) {
        console.log("Error dismissing guide:", e);
      }
    }
  };

  const skipGuide = async () => {
    setVisible(false);
    try {
      await AsyncStorage.setItem(GUIDE_KEY, "true");
    } catch (e) {
      console.log("Error dismissing guide:", e);
    }
  };

  if (!visible) return null;

  const currentStep = STEPS[stepIndex];

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleNext}
      >
        {/* Active Highlight Ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.highlightRing,
            {
              top:
                currentStep.position === "top"
                  ? (currentStep.top as number) - 30
                  : undefined,
              bottom:
                currentStep.position === "bottom"
                  ? (currentStep.bottom as number) - 30
                  : undefined,
              left: (currentStep.left as number) - 30,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Pointer Position */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pointerContainer,
            {
              top: currentStep.position === "top" ? currentStep.top : undefined,
              bottom:
                currentStep.position === "bottom"
                  ? currentStep.bottom
                  : undefined,
              left: currentStep.left,
            },
          ]}
        >
          {currentStep.position === "top" ? (
            <Feather
              name="arrow-up"
              size={40}
              color="#fff"
              style={styles.arrow}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Feather
                name="arrow-down"
                size={40}
                color="#fff"
                style={styles.arrowBottom}
              />
            </View>
          )}
        </Animated.View>

        {/* Text Box Modal */}
        <View
          style={[
            styles.messageBox,
            currentStep.position === "top"
              ? { top: (currentStep.top as number) + 60 }
              : { bottom: (currentStep.bottom as number) + 60 },
          ]}
        >
          <Text style={styles.messageTitle}>{currentStep.title}</Text>
          <Text style={styles.messageText}>{currentStep.text}</Text>

          <View style={styles.progressBar}>
            {STEPS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.progressDot,
                  idx === stepIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={skipGuide} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip Tour</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.8}
              style={styles.nextButtonShadow}
            >
              <LinearGradient
                colors={["#4A6CF7", "#3B5BDB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextButton}
              >
                <Text style={styles.nextText}>
                  {stepIndex === STEPS.length - 1 ? "Finish" : "Next"}
                </Text>
                {stepIndex !== STEPS.length - 1 && (
                  <Feather name="arrow-right" size={16} color="#fff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.88)",
  },
  pointerContainer: {
    position: "absolute",
    alignItems: "center",
  },
  arrow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  arrowBottom: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  messageBox: {
    position: "absolute",
    left: "10%",
    width: "80%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    alignItems: "center",
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 8,
    textAlign: "center",
  },
  messageText: {
    fontSize: 15,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F0F0F0",
  },
  progressDotActive: {
    backgroundColor: "#4A6CF7",
    width: 20,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  skipText: {
    color: "#64748b",
    fontSize: 15,
    fontWeight: "600",
  },
  nextButtonShadow: {
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  nextText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  highlightRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
});
