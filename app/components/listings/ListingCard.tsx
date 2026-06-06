import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  Donate: { label: "DONATE", color: "#9333EA" },
  Sell: { label: "FOR SALE", color: colors.primary },
};

export default function ListingCard({ data, onDeleteSuccess }: any) {
  const router = useRouter();
  const { user } = useAuth();

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
    ? data.listingType
    : data.price || "Contact for price";
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
            <Feather name="image" size={26} color={colors.gray} />
          </View>
        )}

        <View style={[styles.typeBadge, { backgroundColor: typeStyle.color }]}>
          <Text style={styles.typeBadgeText}>{typeStyle.label}</Text>
        </View>

        {data.images && data.images.length > 1 && (
          <View style={styles.photoCount}>
            <Feather name="image" size={11} color="#fff" />
            <Text style={styles.photoCountText}>{data.images.length}</Text>
          </View>
        )}

        {isOwner && (
          <TouchableOpacity
            style={styles.deleteFloatBtn}
            onPress={handleDelete}
            hitSlop={8}
          >
            <Feather name="trash-2" size={16} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* STATUS BANNERS (owner only) */}
      {status === "pending" && isOwner && (
        <View style={[styles.statusBanner, styles.pendingBanner]}>
          <Feather name="clock" size={15} color="#B45309" />
          <Text style={styles.pendingText}>In review</Text>
        </View>
      )}
      {status === "rejected" && isOwner && (
        <View style={[styles.statusBanner, styles.rejectedBanner]}>
          <View style={styles.rejectedHeader}>
            <Feather name="alert-circle" size={15} color={colors.error} />
            <Text style={styles.rejectedTitle}>Rejected</Text>
          </View>
          <Text style={styles.rejectedReason} numberOfLines={2}>
            {data.rejectionReason || "No reason provided by admin."}
          </Text>
        </View>
      )}

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
          <Text style={[styles.price, isFreeType && styles.freePrice]} numberOfLines={1}>
            {priceDisplay}
          </Text>
        </View>

        <View style={styles.metaRow}>
          {data.category ? (
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>{data.category}</Text>
            </View>
          ) : null}
          {data.condition ? (
            <View style={styles.metaChip}>
              <Text style={styles.metaChipText}>{data.condition}</Text>
            </View>
          ) : null}
        </View>

        {(data.address || data.location) && (
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={12} color={colors.gray} />
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
              ? new Date(data.createdAt).toLocaleDateString()
              : "Just now"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
    backgroundColor: colors.skeleton,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  typeBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  photoCount: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  photoCountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  deleteFloatBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.card,
  },
  statusBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pendingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    gap: 6,
  },
  pendingText: {
    color: "#B45309",
    fontSize: 12.5,
    fontWeight: "700",
  },
  rejectedBanner: {
    backgroundColor: colors.errorSoft,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  rejectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  rejectedTitle: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "700",
  },
  rejectedReason: {
    color: "#7F1D1D",
    fontSize: 12.5,
  },
  content: {
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
    maxWidth: "42%",
    textAlign: "right",
  },
  freePrice: {
    color: colors.success,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: spacing.sm,
  },
  metaChip: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  metaChipText: {
    fontSize: 11.5,
    color: colors.textMuted,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.md,
  },
  locationText: {
    fontSize: 12.5,
    color: colors.textMuted,
    flex: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  userAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.skeleton,
  },
  userPlaceholder: {
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  userInitial: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  userName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    flex: 1,
  },
  timeText: {
    fontSize: 11.5,
    color: colors.gray,
  },
});
