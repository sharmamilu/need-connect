import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { radius, shadow, spacing } from "../constants/theme";
import { deleteMyAccount, fetchReviewStats } from "../utils/apiFunctions";
import { useAuth } from "../utils/AuthContext";

type OptionRow = {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    profilePhoto: "",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const uId = user?._id || user?.id;
      if (!uId) {
        setLoadingStats(false);
        return;
      }
      try {
        const res = await fetchReviewStats(uId);
        if (res.data?.success) setStats(res.data.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMyAccount();
              await logout();
            } catch (err) {
              console.error("Failed to delete account:", err);
              Alert.alert(
                "Error",
                "Could not delete your account. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const openReviews = () => {
    const uId = user?._id || user?.id;
    if (uId) {
      router.push({
        pathname: "/user-reviews",
        params: { userId: uId, userName: user?.name },
      });
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  const options: OptionRow[] = [
    {
      icon: "briefcase",
      color: "#9333EA",
      bg: "#F3E8FF",
      title: "My Portfolio",
      subtitle: "View your professional profile",
      onPress: () => router.push("/portfolio/view"),
    },
    {
      icon: "grid",
      color: "#DB2777",
      bg: "#FCE7F3",
      title: "Utilities & Templates",
      subtitle: "Invoices, proposals & more",
      onPress: () => router.push("/utilities"),
    },
    {
      icon: "shopping-bag",
      color: "#EA580C",
      bg: "#FFEDD5",
      title: "My Listings",
      subtitle: "Manage your marketplace items",
      onPress: () => {
        const uId = user?._id || user?.id;
        if (uId)
          router.push({
            pathname: "/(screens)/user-listings",
            params: { userId: uId, userName: user?.name },
          });
      },
    },
    {
      icon: "sliders",
      color: "#0284C7",
      bg: "#E0F2FE",
      title: "Preferences",
      subtitle: "Feed, matches & discovery",
      onPress: () => router.push("/(screens)/preferences"),
    },
    {
      icon: "bookmark",
      color: "#16A34A",
      bg: "#DCFCE7",
      title: "Saved Posts",
      subtitle: "Content you've saved",
      onPress: () => router.push("/(screens)/saved-posts"),
    },
    {
      icon: "users",
      color: "#D97706",
      bg: "#FEF3C7",
      title: "Saved Profiles",
      subtitle: "Professionals you've bookmarked",
      onPress: () => router.push("/(screens)/saved-profiles"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            {stats.profilePhoto || user?.avatar ? (
              <Image
                source={{ uri: stats.profilePhoto || user?.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.placeholderText}>{initial}</Text>
              </View>
            )}
            {user?.isVerified !== false && (
              <View style={styles.verifiedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={26}
                  color={colors.primary}
                />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name || "Member"}</Text>
          {user?.profession ? (
            <Text style={styles.profession}>{user.profession}</Text>
          ) : null}

          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statBox}
              activeOpacity={0.7}
              onPress={openReviews}
            >
              <Text style={styles.statNumber}>
                {loadingStats ? "–" : stats.totalReviews}
              </Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.statBox}
              activeOpacity={0.7}
              onPress={openReviews}
            >
              <View style={styles.ratingRow}>
                <Text style={styles.statNumber}>
                  {loadingStats
                    ? "–"
                    : stats.averageRating > 0
                      ? stats.averageRating.toFixed(1)
                      : "New"}
                </Text>
                <Ionicons
                  name="star"
                  size={15}
                  color={colors.star}
                  style={{ marginLeft: 4 }}
                />
              </View>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTACT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "Not set"}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <View style={styles.iconCircle}>
              <Feather name="phone" size={16} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || "Not set"}</Text>
            </View>
          </View>
        </View>

        {/* SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt.title}
              style={[
                styles.optionRow,
                i === options.length - 1 && styles.optionRowLast,
              ]}
              onPress={opt.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconCircle, { backgroundColor: opt.bg }]}>
                <Feather name={opt.icon} size={18} color={opt.color} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>{opt.title}</Text>
                <Text style={styles.optionSubtext}>{opt.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* DANGER ZONE */}
        <View style={styles.dangerZone}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Feather name="log-out" size={19} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={17} color={colors.gray} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Need Connect v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.card,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: spacing.xl,
    ...shadow.header,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 4,
    borderColor: colors.card,
    backgroundColor: colors.skeleton,
  },
  placeholderAvatar: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 2,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 13,
  },
  name: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 3,
  },
  profession: {
    fontSize: 14.5,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
    width: "82%",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionRowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 15.5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 1,
  },
  optionSubtext: {
    fontSize: 12.5,
    color: colors.textMuted,
  },
  dangerZone: {
    marginHorizontal: spacing.lg,
    gap: spacing.md,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.errorSoft,
    paddingVertical: 15,
    borderRadius: radius.md,
    gap: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 15.5,
    fontWeight: "700",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    gap: 8,
  },
  deleteText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 12,
    fontWeight: "500",
    marginTop: spacing.xl,
  },
});
