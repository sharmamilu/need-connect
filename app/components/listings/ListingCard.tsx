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
import { useAuth } from "../../utils/AuthContext";
import { deleteListing } from "../../utils/apiFunctions";

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

  const handleDelete = async () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListing(data._id);
              if (onDeleteSuccess) {
                onDeleteSuccess(data._id);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete listing.");
            }
          },
        },
      ],
    );
  };

  const priceDisplay =
    data.listingType === "Free" || data.listingType === "Donate"
      ? data.listingType
      : data.price || "Contact for Price";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listings/${data._id}` as any)}
    >
      {data.images && data.images.length > 0 ? (
        <Image source={{ uri: data.images[0] }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Feather name="image" size={24} color="#ccc" />
        </View>
      )}

      {/* STATUS BANNERS */}
      {(data.status === "Pending" ||
        (data.status && data.status.toLowerCase() === "pending")) &&
        isOwner && (
          <View style={[styles.statusBanner, styles.pendingBanner]}>
            <Feather name="clock" size={16} color="#B45309" />
            <Text style={styles.pendingText}>
              This listing is currently in review.
            </Text>
          </View>
        )}

      {(data.status === "Rejected" ||
        (data.status && data.status.toLowerCase() === "rejected")) &&
        isOwner && (
          <View style={[styles.statusBanner, styles.rejectedBanner]}>
            <View style={styles.rejectedHeader}>
              <Feather name="alert-circle" size={16} color="#E53935" />
              <Text style={styles.rejectedTitle}>Listing Rejected</Text>
            </View>
            <Text style={styles.rejectedReason}>
              {data.rejectionReason || "No exact reason provided by admin."}
            </Text>
            <TouchableOpacity
              style={styles.rejectedDeleteBtn}
              onPress={handleDelete}
            >
              <Text style={styles.rejectedDeleteText}>Delete Listing</Text>
            </TouchableOpacity>
          </View>
        )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
          <Text
            style={[
              styles.price,
              (data.listingType === "Free" || data.listingType === "Donate") &&
                styles.freePrice,
            ]}
          >
            {priceDisplay}
          </Text>
        </View>

        <Text style={styles.category} numberOfLines={1}>
          {data.category} • {data.condition}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={12} color="#888" />
            <Text style={styles.locationText} numberOfLines={1}>
              {data.address || data.location}
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
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: "#F5F7FA",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    flex: 1,
    paddingRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A6CF7",
  },
  freePrice: {
    color: "#16A34A",
  },
  category: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: "#888",
  },
  timeText: {
    fontSize: 12,
    color: "#aaa",
  },
  statusBanner: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  pendingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7", // amber-100
    gap: 8,
  },
  pendingText: {
    color: "#B45309", // amber-700
    fontSize: 13,
    fontWeight: "600",
  },
  rejectedBanner: {
    backgroundColor: "#FEF2F2", // red-50
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
  },
  rejectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  rejectedTitle: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "700",
  },
  rejectedReason: {
    color: "#7F1D1D", // red-900
    fontSize: 13,
    marginBottom: 10,
  },
  rejectedDeleteBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectedDeleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
