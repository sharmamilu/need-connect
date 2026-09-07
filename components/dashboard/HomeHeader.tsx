import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";

type HomeHeaderProps = {
  user?: any;
  profile?: any;
};

/** Sticky top app bar for the home feed with soothing, refined aesthetics. */
export default function HomeHeader({ user, profile }: HomeHeaderProps) {
  const router = useRouter();
  const avatarUri = profile?.profilePhoto || user?.avatar;
  const nameInitial =
    user?.name?.charAt(0).toUpperCase() ||
    profile?.name?.charAt(0).toUpperCase() ||
    "";

  // Dynamic warm greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.name || profile?.name || "Professional";

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => router.push("/profile")}
        activeOpacity={0.75}
      >
        <View style={styles.avatarContainer}>
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
                <Feather name="user" size={16} color={colors.primary} />
              )}
            </View>
          )}
          <View style={styles.onlineBadge} />
        </View>

        <View style={styles.welcomeInfo}>
          <Text style={styles.welcomeSub}>{getGreeting()},</Text>
          <Text style={styles.welcomeName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/explore")}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Feather name="search" size={17} color="#334155" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/utilities")}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Utilities"
        >
          <Feather name="grid" size={17} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    ...shadow.header,
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: spacing.md,
  },
  avatarContainer: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "rgba(74, 108, 247, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  onlineBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  welcomeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  welcomeSub: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  welcomeName: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 1,
    letterSpacing: -0.2,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
