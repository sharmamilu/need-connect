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
import { deleteMyAccount, fetchReviewStats } from "../utils/apiFunctions";
import { useAuth } from "../utils/AuthContext";

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
      // Use both possible ID fields
      const uId = user?._id || user?.id;
      if (!uId) {
        setLoadingStats(false);
        return;
      }

      try {
        const res = await fetchReviewStats(uId);
        if (res.data?.success) {
          setStats(res.data.data);
        }
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

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            {stats.profilePhoto || user?.avatar ? (
              <Image
                source={{ uri: stats.profilePhoto || user?.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderText}>
                  {getInitials(user?.name)}
                </Text>
              </View>
            )}
            {/* Show verified badge if available */}
            {user?.isVerified !== false && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#4A6CF7" />
                <View style={styles.verifiedBadgeBg} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name || "Member"}</Text>
          {user?.profession && (
            <Text style={styles.profession}>{user.profession}</Text>
          )}

          {/* Stats Analytics */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statBox}
              activeOpacity={0.7}
              onPress={() => {
                const uId = user?._id || user?.id;
                if (uId) {
                  router.push({
                    pathname: "/user-reviews",
                    params: { userId: uId, userName: user?.name },
                  });
                }
              }}
            >
              <Text style={styles.statNumber}>
                {loadingStats ? "-" : stats.totalReviews}
              </Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.statBox}
              activeOpacity={0.7}
              onPress={() => {
                const uId = user?._id || user?.id;
                if (uId) {
                  router.push({
                    pathname: "/user-reviews",
                    params: { userId: uId, userName: user?.name },
                  });
                }
              }}
            >
              <View style={styles.ratingRow}>
                <Text style={styles.statNumber}>
                  {loadingStats
                    ? "-"
                    : stats.averageRating > 0
                      ? stats.averageRating.toFixed(1)
                      : "New"}
                </Text>
                <Ionicons
                  name="star"
                  size={16}
                  color="#FFB800"
                  style={{ marginLeft: 4, marginTop: -2 }}
                />
              </View>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={16} color="#4A6CF7" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "Not set"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Feather name="phone" size={16} color="#4A6CF7" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone || "Not set"}</Text>
            </View>
          </View>
        </View>

        {/* Options / Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/portfolio/view")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.optionIconCircle, { backgroundColor: "#F3E8FF" }]}
            >
              <Feather name="briefcase" size={18} color="#9333EA" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>My Portfolio</Text>
              <Text style={styles.optionSubtext}>
                View your professional profile
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/utilities")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.optionIconCircle, { backgroundColor: "#FCE7F3" }]}
            >
              <Feather name="layout" size={18} color="#DB2777" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Utilities & Templates</Text>
              <Text style={styles.optionSubtext}>
                Invoices, proposals & more
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => {
              const uId = user?._id || user?.id;
              if (uId) {
                router.push({
                  pathname: "/(screens)/user-listings",
                  params: { userId: uId, userName: user?.name },
                });
              }
            }}
            activeOpacity={0.7}
          >
            <View
              style={[styles.optionIconCircle, { backgroundColor: "#FFEDD5" }]}
            >
              <Feather name="shopping-bag" size={18} color="#EA580C" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>My Listings</Text>
              <Text style={styles.optionSubtext}>
                Manage your marketplace items
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/(screens)/preferences")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.optionIconCircle, { backgroundColor: "#E0F2FE" }]}
            >
              <Feather name="sliders" size={18} color="#0284C7" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Preferences</Text>
              <Text style={styles.optionSubtext}>
                Feed, Matches & Discovery
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/(screens)/saved-posts")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.optionIconCircle, { backgroundColor: "#DCFCE7" }]}
            >
              <Feather name="bookmark" size={18} color="#16A34A" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Saved Posts</Text>
              <Text style={styles.optionSubtext}>
                Content you&apos;ve saved
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => router.push("/(screens)/saved-profiles")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.optionIconCircle, { backgroundColor: "#FEF3C7" }]}
            >
              <Feather name="users" size={18} color="#D97706" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Saved Profiles</Text>
              <Text style={styles.optionSubtext}>
                Professionals you&apos;ve bookmarked
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Feather name="log-out" size={20} color="#E53935" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={20} color="#E53935" />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Need Connect v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#F8F9FA",
  },
  placeholderAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#F8F9FA",
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  placeholderText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 4,
    zIndex: 2,
  },
  verifiedBadgeBg: {
    position: "absolute",
    width: 14,
    height: 14,
    backgroundColor: "#fff",
    borderRadius: 7,
    top: 5,
    left: 5,
    zIndex: -1,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1c1e21",
    marginBottom: 4,
  },
  profession: {
    fontSize: 15,
    color: "#4A6CF7",
    fontWeight: "600",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "85%",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1c1e21",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#65676b",
    marginTop: 4,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E0E0E0",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#999",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDF1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F6",
    paddingBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: "#65676b",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F6",
    paddingBottom: 16,
  },
  optionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },
  optionSubtext: {
    fontSize: 13,
    color: "#888",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 16,
  },
  logoutText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginBottom: 24,
  },
  deleteText: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    color: "#BBB",
    fontSize: 12,
    fontWeight: "500",
  },
});
