import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchListingById } from "../../utils/apiFunctions";

const { width } = Dimensions.get("window");

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

  const handleContact = () => {
    Alert.alert(
      "Contact",
      `Initiate chat with ${listing?.author?.name || "Seller"}`,
    );
  };

  const handleReport = () => {
    Alert.alert("Report", "Report this listing to moderation?");
  };

  const onScroll = (e: any) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== activeImage) {
      setActiveImage(slide);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A6CF7" />
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
          <Feather name="arrow-left" size={24} color="#2D3436" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleReport}>
          <Feather name="flag" size={20} color="#FF6B6B" />
        </TouchableOpacity>
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
              <Feather name="image" size={48} color="#ccc" />
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
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{listing.category}</Text>
            </View>
            <View style={styles.badgeSecondary}>
              <Text style={styles.badgeTextSecondary}>{listing.condition}</Text>
            </View>
          </View>

          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <Feather name="map-pin" size={16} color="#666" />
              <Text style={styles.metadataText}>
                {listing.address || listing.location}
              </Text>
            </View>
            <View style={styles.metadataItem}>
              <Feather name="clock" size={16} color="#666" />
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
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitial}>
                {listing.author?.name?.charAt(0).toUpperCase() || "S"}
              </Text>
            </View>
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>
                {listing.author?.name || "Anonymous Seller"}
              </Text>
              <Text style={styles.sellerSub}>Verified Member</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar (Contact) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContact}>
          <Feather name="message-circle" size={20} color="#fff" />
          <Text style={styles.contactBtnText}>Message Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 40, // rough safe area inset offset if needed, but we're in SafeAreaView
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
  },
  backBtnText: {
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  carouselContainer: {
    position: "relative",
    height: 320,
  },
  heroImage: {
    width: width,
    height: 320,
    backgroundColor: "#F5F7FA",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  noImageText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "500",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 20,
  },
  detailsContainer: {
    padding: 24,
    paddingBottom: 100, // accommodate bottom bar
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4A6CF7",
    marginBottom: 16,
  },
  freePrice: {
    color: "#16A34A",
  },
  badges: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#EDF1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: "#4A6CF7",
    fontWeight: "600",
    fontSize: 13,
  },
  badgeSecondary: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeTextSecondary: {
    color: "#666",
    fontWeight: "600",
    fontSize: 13,
  },
  metadataRow: {
    flexDirection: "row",
    gap: 24,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4a5568",
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2D3436",
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
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  sellerSub: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32, // safe area padding
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  contactBtn: {
    flexDirection: "row",
    backgroundColor: "#4A6CF7",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  contactBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
