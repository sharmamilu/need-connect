import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";
import { fetchListingById } from "../../utils/apiFunctions";

const { width } = Dimensions.get("window");

const TYPE_COLOR: Record<string, string> = {
  Free: colors.success,
  Donate: "#9333EA",
  Sell: colors.primary,
};

export default function ListingDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        const res = await fetchListingById(id as string);
        setListing(res.data?.data || res.data);
      } catch (err) {
        // Mock fallback if API not ready
        setListing({
          _id: id,
          title: "Mocked Item",
          category: "Other",
          listingType: "Sell",
          price: "$99 or Best Offer",
          description:
            "This is a placeholder description since the backend might not be fully configured yet. Still, it covers all the details you’d expect from a listing.",
          condition: "Used",
          address: "123 Main St, Apt 4B, Example City",
          contactInfo: "Phone: (555) 123-4567 or Email: example@email.com",
          createdAt: new Date().toISOString(),
          author: { name: "John Doe" },
          images: [],
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadListing();
    }
  }, [id]);

  const onScroll = (e: any) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== activeImage) {
      setActiveImage(slide);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Listing not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const priceDisplay =
    listing.listingType === "Free" || listing.listingType === "Donate"
      ? listing.listingType
      : listing.price || "Contact for Price";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Listing Details
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Images Carousel */}
        <View style={styles.carouselContainer}>
          {listing.images && listing.images.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
              >
                {listing.images.map((img: string, i: number) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={styles.heroImage}
                  />
                ))}
              </ScrollView>
              {listing.images.length > 1 && (
                <View style={styles.dotsContainer}>
                  {listing.images.map((_: any, i: number) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        activeImage === i && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={[styles.heroImage, styles.placeholderImage]}>
              <Feather name="image" size={48} color={colors.gray} />
              <Text style={styles.noImageText}>No Photos Available</Text>
            </View>
          )}
        </View>

        {/* Content Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text
            style={[
              styles.price,
              (listing.listingType === "Free" ||
                listing.listingType === "Donate") &&
                styles.freePrice,
            ]}
          >
            {priceDisplay}
          </Text>

          <View style={styles.badges}>
            {listing.listingType ? (
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor:
                      TYPE_COLOR[listing.listingType] || colors.primary,
                  },
                ]}
              >
                <Text style={styles.typeBadgeText}>
                  {listing.listingType === "Sell"
                    ? "FOR SALE"
                    : listing.listingType.toUpperCase()}
                </Text>
              </View>
            ) : null}
            {listing.category ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{listing.category}</Text>
              </View>
            ) : null}
            {listing.condition ? (
              <View style={styles.badgeSecondary}>
                <Text style={styles.badgeTextSecondary}>
                  {listing.condition}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Feather name="map-pin" size={16} color={colors.textMuted} />
              <Text style={styles.metadataText}>
                {listing.address || listing.location}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Feather name="clock" size={16} color={colors.textMuted} />
              <Text style={styles.metadataText}>
                {listing.createdAt
                  ? new Date(listing.createdAt).toLocaleDateString()
                  : "Recently"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{listing.description}</Text>

          {listing.contactInfo && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Contact</Text>
              <Text style={styles.descriptionText}>{listing.contactInfo}</Text>
            </>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerCard}>
            {listing.userImage ? (
              <Image
                source={{ uri: listing.userImage }}
                style={styles.sellerAvatar}
              />
            ) : (
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerInitial}>
                  {(listing.userName || listing.author?.name)
                    ?.charAt(0)
                    .toUpperCase() || "S"}
                </Text>
              </View>
            )}
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                {listing.userName || listing.author?.name || "Anonymous Seller"}
              </Text>
              <Text style={styles.sellerSub}>
                {listing.userProfession || "Verified Member"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  iconBtn: {
    padding: 8,
    marginLeft: -8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 17,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  backBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
  },
  backBtnText: {
    fontWeight: "700",
    color: colors.text,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  carouselContainer: {
    position: "relative",
    height: 320,
    backgroundColor: colors.card,
  },
  heroImage: {
    width: width,
    height: 320,
    backgroundColor: colors.skeleton,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  noImageText: {
    color: colors.gray,
    fontSize: 15,
    fontWeight: "500",
  },
  dotsContainer: {
    position: "absolute",
    bottom: spacing.md,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 18,
  },
  detailsContainer: {
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: spacing.md,
  },
  freePrice: {
    color: colors.success,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  typeBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  badgeText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12.5,
  },
  badgeSecondary: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  badgeTextSecondary: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 12.5,
  },
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metadataText: {
    fontSize: 13.5,
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.md,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sellerInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 3,
  },
  sellerSub: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
  },
});
