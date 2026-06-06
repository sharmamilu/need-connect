import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";

type HomeHeaderProps = {
  user?: any;
  profile?: any;
};

/** Sticky top app bar for the home feed. */
export default function HomeHeader({ user, profile }: HomeHeaderProps) {
  const router = useRouter();
  const avatarUri = profile?.profilePhoto || user?.avatar;
  const nameInitial =
    user?.name?.charAt(0).toUpperCase() ||
    profile?.name?.charAt(0).toUpperCase() ||
    "";

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => router.push("/profile")}
        activeOpacity={0.8}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            {nameInitial ? (
              <Text style={styles.initialText}>{nameInitial}</Text>
            ) : (
              <Feather name="user" size={14} color="#fff" />
            )}
          </View>
        )}
        <View style={styles.welcomeInfo}>
          <Text style={styles.welcomeSub}>Welcome back,</Text>
          <Text style={styles.welcomeName} numberOfLines={1}>
            {user?.name || "Professional"}
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
          <Feather name="search" size={18} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/utilities")}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Utilities"
        >
          <Feather name="grid" size={18} color={colors.text} />
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
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.header,
  },
  profileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    marginRight: spacing.md,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.skeleton,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  welcomeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  welcomeSub: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
  },
  welcomeName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
