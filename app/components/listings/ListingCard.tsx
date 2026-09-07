import { Feather, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";
import { deleteListing } from "../../utils/apiFunctions";
import { useAuth } from "../../utils/AuthContext";

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  Free: { label: "FREE", color: colors.success },
  Donate: { label: "DONATED", color: "#9333EA" },
  Sell: { label: "FOR SALE", color: colors.primary },
};

export default function ListingCard({ data, onDeleteSuccess }: any) {
  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const currentUserId = user?._id || user?.id;
  const authorId =
    data.author?._id ||
    data.author?.id ||
    data.author ||
    data.seller?._id ||
    data.seller?.id ||
    data.seller;
  const isOwner = currentUserId && currentUserId === authorId;

  const isFreeType =
    data.listingType === "Free" || data.listingType === "Donate";
  const priceDisplay = isFreeType
    ? data.listingType === "Free" ? "FREE" : "DONATE"
    : data.price || "Contact";
  const typeStyle = TYPE_STYLES[data.listingType] || TYPE_STYLES.Sell;

  const status = (data.status || "").toLowerCase();
  const sellerName = data.userName || data.author?.name || "Seller";

  const handleDelete = () => {
    Alert.alert("Delete Listing", "Are you sure you want to delete this listing?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteListing(data._id);
            onDeleteSuccess?.(data._id);
          } catch {
            Alert.alert("Error", "Failed to delete listing.");
          }
        },
      },
    ],
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/listings/${data._id}` as any)}
    >
      {/* IMAGE + OVERLAYS */}
      <View style={styles.imageWrap}>
        {data.images && data.images.length > 0 ? (
          <Image source={{ uri: data.images[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Feather name="image" size={24} color={colors.gray} />
          </View>
        )}

        {/* Dynamic Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: typeStyle.color }]}>
          <Text style={styles.typeBadgeText}>{typeStyle.label}</Text>
        </View>

        {/* Favorite Heart Trigger */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.8}
        >
          {isFavorite ? (
            <FontAwesome name="heart" size={15} color="#EF4444" />
          ) : (
            <Feather name="heart" size={15} color="#4B5563" />
          )}
        </TouchableOpacity>

        {/* Floating Price Tag */}
        <View style={styles.priceTag}>
          <Text style={[styles.priceText, isFreeType && styles.freePriceText]} numberOfLines={1}>
            {priceDisplay}
          </Text>
        </View>

        {/* Photo Count */}
        {data.images && data.images.length > 1 && (
          <View style={styles.photoCount}>
            <Feather name="camera" size={10} color="#fff" />
            <Text style={styles.photoCountText}>{data.images.length}</Text>
          </View>
        )}

        {isOwner && (
          <TouchableOpacity
            style={styles.deleteFloatBtn}
            onPress={handleDelete}
            hitSlop={8}
          >
            <Feather name="trash-2" size={14} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* STATUS BANNERS (owner only) */}
      {status === "pending" && isOwner && (
        <View style={[styles.statusBanner, styles.pendingBanner]}>
          <Feather name="clock" size={12} color="#B45309" />
          <Text style={styles.pendingText}>In review</Text>
        </View>
      )}
      {status === "rejected" && isOwner && (
        <View style={[styles.statusBanner, styles.rejectedBanner]}>
          <View style={styles.rejectedHeader}>
            <Feather name="alert-circle" size={12} color={colors.error} />
            <Text style={styles.rejectedTitle}>Rejected</Text>
          </View>
          <Text style={styles.rejectedReason} numberOfLines={2}>
            {data.rejectionReason || "No reason provided by admin."}
          </Text>
        </View>
      )}

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {data.title}
        </Text>

        <Text style={styles.categorySubText} numberOfLines={1}>
          {data.category || "General"} • {data.condition || "Good"}
        </Text>

        {(data.address || data.location) && (
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={11} color={colors.gray} />
            <Text style={styles.locationText} numberOfLines={1}>
              {data.address || data.location}
            </Text>
          </View>
        )}

        <View style={styles.footerRow}>
          <View style={styles.sellerHeader}>
            {data.userImage ? (
              <Image source={{ uri: data.userImage }} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatar, styles.userPlaceholder]}>
                <Text style={styles.userInitial}>
                  {sellerName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.userName} numberOfLines={1}>
              {sellerName}
            </Text>
          </View>
          <Text style={styles.timeText}>
            {data.createdAt
              ? new Date(data.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })
              : "Now"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flex: 1,
    maxWidth: "48.5%", // Prevents single grid items from stretching full-width
    ...shadow.card,
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    height: 135,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.skeleton,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(17, 24, 39, 0.85)", // Dark glassmorphism tag
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  priceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },
  freePriceText: {
    color: "#34D399", // bright green for free items
  },
  photoCount: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 10,
  },
  photoCountText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  deleteFloatBtn: {
    position: "absolute",
    top: 40,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusBanner: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pendingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    gap: 4,
  },
  pendingText: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "700",
  },
  rejectedBanner: {
    backgroundColor: colors.errorSoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  rejectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  rejectedTitle: {
    color: colors.error,
    fontSize: 11,
    fontWeight: "700",
  },
  rejectedReason: {
    color: "#7F1D1D",
    fontSize: 10.5,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 2,
  },
  categorySubText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  locationText: {
    fontSize: 11,
    color: "#9CA3AF",
    flex: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
    marginTop: 8,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.skeleton,
  },
  userPlaceholder: {
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  userInitial: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
  },
  userName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
    flex: 1,
  },
  timeText: {
    fontSize: 10.5,
    color: "#9CA3AF",
  },
});
