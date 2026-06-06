import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import {
  deleteMyAccount,
  fetchReviewStats,
  uploadProfileImage,
  updatePortfolio,
} from "../utils/apiFunctions";
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
  const { logout, user, updateUser } = useAuth();
  const router = useRouter();
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    profilePhoto: "",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const handlePickAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "We need access to your camera roll to change your avatar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setLoadingAvatar(true);
        const uploadedUrl = await uploadProfileImage(selectedImage);
        
        // Update user profile/portfolio
        await updatePortfolio({ profilePhoto: uploadedUrl });
        
        // Refresh local stats state
        setStats(prev => ({ ...prev, profilePhoto: uploadedUrl }));
        
        // Refresh Auth Context globally
        if (user) {
          await updateUser({ ...user, avatar: uploadedUrl });
        }
        
        Alert.alert("Success", "Profile photo updated successfully!");
      }
    } catch (err) {
      console.error("Failed to upload profile photo:", err);
      Alert.alert("Error", "Failed to update profile photo.");
    } finally {
      setLoadingAvatar(false);
    }
  };

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
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.coverBanner}
          />
          <View style={styles.headerInfoContainer}>
            <TouchableOpacity
              onPress={handlePickAvatar}
              activeOpacity={0.9}
              style={styles.avatarWrapper}
              disabled={loadingAvatar}
            >
              {loadingAvatar ? (
                <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: colors.skeleton }]}>
                  <ActivityIndicator color={colors.primary} size="small" />
                </View>
              ) : stats.profilePhoto || user?.avatar ? (
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
                    size={22}
                    color={colors.primary}
                  />
                </View>
              )}
              <View style={styles.cameraIconBadge}>
                <Feather name="camera" size={12} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.name}>{user?.name || "Member"}</Text>
            {user?.profession ? (
              <Text style={styles.profession}>{user.profession}</Text>
            ) : (
              <Text style={[styles.profession, { color: colors.textMuted }]}>
                No Profession Set
              </Text>
            )}

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
    paddingTop: 8,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: 24,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  coverBanner: {
    height: 110,
    width: "100%",
  },
  headerInfoContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    marginTop: -50,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: colors.skeleton,
  },
  placeholderAvatar: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    top: 2,
    left: -2,
    backgroundColor: "#fff",
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cameraIconBadge: {
    position: "absolute",
    bottom: 2,
    right: -2,
    backgroundColor: colors.primaryDark,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginTop: 4,
    marginBottom: 2,
  },
  profession: {
    fontSize: 13.5,
    color: colors.primary,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    width: "100%",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "850",
    color: colors.primary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11.5,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: "600",
  },
  statDivider: {
    width: 1.5,
    height: 28,
    backgroundColor: "rgba(74, 108, 247, 0.15)",
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
    fontSize: 12.5,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 1,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14.5,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: "750",
    color: colors.text,
    marginBottom: 1,
  },
  optionSubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
  dangerZone: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.errorSoft,
    paddingVertical: 14,
    borderRadius: radius.md,
    gap: 8,
  },
  logoutText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: "700",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  deleteText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: spacing.xl,
  },
});
