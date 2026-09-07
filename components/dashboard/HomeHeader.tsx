import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/theme";

type HomeHeaderProps = {
  user?: any;
  profile?: any;
};

/** Sticky top app bar for the home feed with rich depth, soothing gradients, and elevated tactile controls. */
export default function HomeHeader({ user, profile }: HomeHeaderProps) {
  const router = useRouter();
  const avatarUri = profile?.profilePhoto || user?.avatar;
  const nameInitial =
    user?.name?.charAt(0).toUpperCase() ||
    profile?.name?.charAt(0).toUpperCase() ||
    "";

  // Dynamic warm greeting & icon based on time of day
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: "Good morning", icon: "sun" as const, color: "#EA580C" };
    }
    if (hour < 17) {
      return { text: "Good afternoon", icon: "sun" as const, color: "#D97706" };
    }
    return { text: "Good evening", icon: "moon" as const, color: "#6366F1" };
  };

  const greeting = getGreetingData();
  const displayName = user?.name || profile?.name || "Professional";
  const userHeadline =
    profile?.headline || profile?.occupation || "Verified Member";

  return (
    <LinearGradient
      colors={["#FFFFFF", "#F8FAFC", "#EEF2F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push("/profile")}
          activeOpacity={0.8}
        >
          {/* Multi-layered Glowing Gradient Avatar Ring */}
          <LinearGradient
            colors={["#4A6CF7", "#7C3AED", "#38BDF8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGlowRing}
          >
            <View style={styles.avatarInnerContainer}>
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  {nameInitial ? (
                    <Text style={styles.initialText}>{nameInitial}</Text>
                  ) : (
                    <Feather name="user" size={18} color="#4A6CF7" />
                  )}
                </View>
              )}
            </View>
            <View style={styles.onlineBadge} />
          </LinearGradient>

          <View style={styles.welcomeInfo}>
            <View style={styles.greetingRow}>
              <View style={styles.greetingPill}>
                <Feather name={greeting.icon} size={11} color={greeting.color} />
                <Text style={[styles.welcomeSub, { color: greeting.color }]}>
                  {greeting.text}
                </Text>
              </View>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.welcomeName} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={styles.verifiedChip}>
                <Feather name="check" size={9} color="#fff" />
              </View>
            </View>

            <Text style={styles.userHeadline} numberOfLines={1}>
              {userHeadline}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Elevated Tactile Action Buttons */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.elevatedButton}
            onPress={() => router.push("/explore")}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <Feather name="search" size={18} color="#1E293B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.elevatedButton}
            onPress={() => router.push("/utilities")}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Utilities"
          >
            <Feather name="grid" size={18} color="#1E293B" />
            <View style={styles.dotIndicator} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.8)",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: spacing.md,
  },
  avatarGlowRing: {
    position: "relative",
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInnerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    backgroundColor: "#E2E8F0",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  welcomeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  greetingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.7)",
  },
  welcomeSub: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  welcomeName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  verifiedChip: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  userHeadline: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  elevatedButton: {
    position: "relative",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  dotIndicator: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4A6CF7",
  },
});
