import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ListingCard({ data }: any) {
  const router = useRouter();

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
});
