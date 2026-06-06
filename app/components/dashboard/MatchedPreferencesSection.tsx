import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";
import {
  fetchListings,
  fetchPortfolios,
  fetchPreferences,
} from "../../utils/apiFunctions";

type TabType = "listings" | "professionals";

export default function MatchedPreferencesSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [hideSetup, setHideSetup] = useState(false);
  const [preferences, setPreferences] = useState<{ skills: string[]; locations: string[] }>({
    skills: [],
    locations: [],
  });

  const [matchedListings, setMatchedListings] = useState<any[]>([]);
  const [matchedProfessionals, setMatchedProfessionals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("listings");

  const loadPreferencesAndMatches = async () => {
    try {
      setLoading(true);
      
      const hideVal = await AsyncStorage.getItem("hide_preference_setup");
      if (hideVal === "true") {
        setHideSetup(true);
      }

      const prefRes = await fetchPreferences();
      const prefs = prefRes.data?.data || prefRes.data;

      if (
        prefs &&
        ((prefs.skills && prefs.skills.length > 0) ||
          (prefs.locations && prefs.locations.length > 0))
      ) {
        setHasPreferences(true);
        const skills: string[] = prefs.skills || [];
        const locations: string[] = prefs.locations || [];
        setPreferences({ skills, locations });

        // Fetch Listings and Portfolios/Professionals in parallel
        const [listingsRes, portfoliosRes] = await Promise.all([
          fetchListings({ limit: 100 }),
          fetchPortfolios({ limit: 100 }),
        ]);

        const allListings = listingsRes.data?.posts || listingsRes.data?.data || listingsRes.data || [];
        const allPortfolios = portfoliosRes.data?.data || portfoliosRes.data || [];

        // Apply matching logic
        const filteredListings = allListings.filter((item: any) => {
          const matchSkill = skills.some(
            (skill) =>
              item.title?.toLowerCase().includes(skill.toLowerCase()) ||
              item.category?.toLowerCase().includes(skill.toLowerCase()) ||
              item.description?.toLowerCase().includes(skill.toLowerCase())
          );
          const matchLocation = locations.some(
            (loc) =>
              item.location?.toLowerCase().includes(loc.toLowerCase()) ||
              item.address?.toLowerCase().includes(loc.toLowerCase())
          );
          return matchSkill || matchLocation;
        });

        const filteredProfessionals = allPortfolios.filter((item: any) => {
          const matchSkill = skills.some(
            (skill) =>
              item.profession?.toLowerCase().includes(skill.toLowerCase()) ||
              item.bio?.toLowerCase().includes(skill.toLowerCase()) ||
              (item.skills &&
                item.skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase())))
          );
          const matchLocation = locations.some(
            (loc) => item.location?.toLowerCase().includes(loc.toLowerCase())
          );
          return matchSkill || matchLocation;
        });

        setMatchedListings(filteredListings);
        setMatchedProfessionals(filteredProfessionals);

        // Auto-select tab that has items
        if (filteredListings.length === 0 && filteredProfessionals.length > 0) {
          setActiveTab("professionals");
        } else {
          setActiveTab("listings");
        }
      } else {
        setHasPreferences(false);
      }
    } catch (err) {
      console.error("Failed to load matching preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismissSetup = async () => {
    setHideSetup(true);
    try {
      await AsyncStorage.setItem("hide_preference_setup", "true");
    } catch (err) {
      console.error("Failed to save hide setup preference:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPreferencesAndMatches();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  // Case 1: Preferences are not set yet
  if (!hasPreferences) {
    if (hideSetup) return null;
    return (
      <View style={styles.setupCard}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={handleDismissSetup}
          activeOpacity={0.7}
        >
          <Feather name="x" size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.setupInfo}>
          <View style={styles.setupIconBg}>
            <Feather name="sliders" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={styles.setupTitle}>Customized Matches</Text>
            <Text style={styles.setupDesc}>
              Set your skill preferences to find matching gigs and trusted professionals near you.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.setupBtn}
          onPress={() => router.push("/preferences")}
          activeOpacity={0.8}
        >
          <Text style={styles.setupBtnText}>Configure Preferences</Text>
          <Feather name="arrow-right" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  const hasListings = matchedListings.length > 0;
  const hasProfessionals = matchedProfessionals.length > 0;

  // Case 2: Preferences set, but absolutely no matching content found
  if (!hasListings && !hasProfessionals) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyHeaderRow}>
          <Text style={styles.sectionTitle}>Matches for You</Text>
          <TouchableOpacity
            style={styles.adjustLink}
            onPress={() => router.push("/preferences")}
          >
            <Text style={styles.adjustLinkText}>Edit</Text>
            <Feather name="edit-2" size={11} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContent}>
          <Feather name="eye-off" size={24} color={colors.textMuted} />
          <Text style={styles.emptyText}>No matching results found</Text>
          <Text style={styles.emptySubText}>
            No listings or professionals currently match your preference categories:{" "}
            {[...preferences.skills, ...preferences.locations].join(", ")}.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title & Preferences Adjust Trigger */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Matches for You</Text>
        <TouchableOpacity
          style={styles.adjustLink}
          onPress={() => router.push("/preferences")}
          activeOpacity={0.7}
        >
          <Text style={styles.adjustLinkText}>Configure</Text>
          <Feather name="sliders" size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs Switcher */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "listings" && styles.tabButtonActive,
            !hasListings && styles.tabButtonDisabled,
          ]}
          disabled={!hasListings}
          onPress={() => setActiveTab("listings")}
        >
          <Feather
            name="briefcase"
            size={14}
            color={activeTab === "listings" ? colors.primary : colors.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "listings" && styles.tabTextActive,
            ]}
          >
            Listings ({matchedListings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "professionals" && styles.tabButtonActive,
            !hasProfessionals && styles.tabButtonDisabled,
          ]}
          disabled={!hasProfessionals}
          onPress={() => setActiveTab("professionals")}
        >
          <Feather
            name="users"
            size={14}
            color={
              activeTab === "professionals" ? colors.primary : colors.textMuted
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "professionals" && styles.tabTextActive,
            ]}
          >
            Experts ({matchedProfessionals.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Matches List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "listings"
          ? matchedListings.map((item) => {
              const isFreeType =
                item.listingType === "Free" || item.listingType === "Donate";
              const displayPrice = isFreeType ? item.listingType : item.price;
              const imageUri =
                item.images && item.images.length > 0 ? item.images[0] : null;

              return (
                <TouchableOpacity
                  key={item._id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/listings/${item._id}` as any)}
                >
                  <View style={styles.imageWrap}>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Feather name="package" size={20} color={colors.textMuted} />
                      </View>
                    )}
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{item.category || "Gig"}</Text>
                    </View>
                  </View>

                  <View style={styles.details}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.cardPrice,
                        isFreeType && styles.freePrice,
                      ]}
                      numberOfLines={1}
                    >
                      {displayPrice}
                    </Text>

                    <View style={styles.userRow}>
                      {item.userImage ? (
                        <Image
                          source={{ uri: item.userImage }}
                          style={styles.avatar}
                        />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarText}>
                            {(item.userName || "U").charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName} numberOfLines={1}>
                          {item.userName || "Seller"}
                        </Text>
                        <Text style={styles.userLocation} numberOfLines={1}>
                          <Feather name="map-pin" size={9} /> {item.location || "Anywhere"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          : matchedProfessionals.map((item) => {
              const rating = item.rating || item.user?.rating || 0;
              const isLowRating = rating > 0 && rating < 2.5;

              return (
                <TouchableOpacity
                  key={item._id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/professional/${item._id}` as any)}
                >
                  <View style={styles.expertHeaderBg} />
                  <View style={styles.expertAvatarRow}>
                    {item.profilePhoto ? (
                      <Image
                        source={{ uri: item.profilePhoto }}
                        style={styles.expertAvatar}
                      />
                    ) : (
                      <View style={[styles.expertAvatar, styles.avatarPlaceholder]}>
                        <Text style={[styles.avatarText, { fontSize: 16 }]}>
                          {item.name?.charAt(0).toUpperCase() || "?"}
                        </Text>
                      </View>
                    )}
                    <View style={styles.expertRatingBox}>
                      <Ionicons name="star" size={11} color="#FFB800" />
                      <Text
                        style={[
                          styles.expertRatingText,
                          isLowRating && { color: "#FF4757" },
                        ]}
                      >
                        {rating > 0 ? rating.toFixed(1) : "New"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.expertDetails}>
                    <Text style={styles.expertName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.expertProfession} numberOfLines={1}>
                      {item.profession}
                    </Text>

                    <View style={styles.expertSkillsRow}>
                      {item.skills?.slice(0, 2).map((skill: string) => (
                        <View key={skill} style={styles.skillBadge}>
                          <Text style={styles.skillText} numberOfLines={1}>
                            {skill}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  adjustLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  adjustLinkText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  tabButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  tabButtonDisabled: {
    opacity: 0.4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: 4,
  },
  card: {
    width: 210,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: "hidden",
    position: "relative",
    ...shadow.card,
  },
  imageWrap: {
    position: "relative",
    height: 110,
    backgroundColor: colors.inputBg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  typeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
  details: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 2,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  freePrice: {
    color: colors.success,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.skeleton,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.text,
  },
  userLocation: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 0.5,
  },

  // Expert design
  expertHeaderBg: {
    height: 50,
    backgroundColor: colors.primarySoft,
  },
  expertAvatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    marginTop: -25,
    marginBottom: spacing.sm,
  },
  expertAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  expertRatingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  expertRatingText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#444",
  },
  expertDetails: {
    padding: spacing.md,
    paddingTop: 2,
  },
  expertName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.text,
  },
  expertProfession: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 1,
  },
  expertSkillsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: spacing.sm,
  },
  skillBadge: {
    backgroundColor: "#EDF1FF",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  skillText: {
    fontSize: 9.5,
    color: colors.primary,
    fontWeight: "700",
  },

  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
    zIndex: 10,
  },

  // Setup preference card
  setupCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  setupInfo: {
    flexDirection: "row",
    gap: spacing.md,
  },
  setupIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  setupTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: colors.text,
  },
  setupDesc: {
    fontSize: 12.5,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 2,
  },
  setupBtn: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  setupBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  // Empty preference match
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  emptyHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  emptySubText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});
