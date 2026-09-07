import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";
import { fetchSuggestedOpportunities } from "@/utils/apiFunctions";

type Opportunity = {
  _id: string;
  title: string;
  price?: string | number;
  listingType?: string;
  category?: string;
  address?: string;
  location?: string | any;
  images?: string[];
  userName?: string;
  userProfession?: string;
  userImage?: string;
};

export default function SuggestedOpportunities() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await fetchSuggestedOpportunities();
        if (res.data && res.data.success) {
          setOpportunities(res.data.data || []);
        }
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.warn("Could not load suggested opportunities:", err?.message || err);
        }
      } finally {
        setLoading(false);
      }
    };
    loadSuggestions();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Listings for You</Text>
        <TouchableOpacity
          onPress={() => router.push("/listings")}
          style={styles.seeAllBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Feather name="arrow-right" size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {opportunities.map((item) => {
          const isFreeType = item.listingType === "Free" || item.listingType === "Donate";
          const displayPrice = isFreeType ? item.listingType : item.price;
          const imageUri = item.images && item.images.length > 0 ? item.images[0] : null;

          return (
            <TouchableOpacity
              key={item._id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push(`/listings/${item._id}` as any)}
            >
              {/* IMAGE HEADER */}
              <View style={styles.imageWrap}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Feather name="briefcase" size={20} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.category || "Gig"}</Text>
                </View>
              </View>

              {/* CARD DETAILS */}
              <View style={styles.details}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.cardPrice, isFreeType && styles.freePrice]} numberOfLines={1}>
                  {displayPrice}
                </Text>

                {/* USER PROFILE INFO */}
                <View style={styles.userRow}>
                  {item.userImage ? (
                    <Image source={{ uri: item.userImage }} style={styles.avatar} />
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
                    <Text style={styles.userProfession} numberOfLines={1}>
                      {item.userProfession || "Professional"}
                    </Text>
                  </View>
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
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    height: 100,
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
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
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
  userProfession: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 0.5,
  },
});
