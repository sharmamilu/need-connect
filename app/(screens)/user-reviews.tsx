import ReviewItem from "@/components/reviews/ReviewItem";
import { fetchReviews } from "@/utils/apiFunctions";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserReviewsScreen() {
  const router = useRouter();
  const { userId, userName } = useLocalSearchParams<{
    userId: string;
    userName?: string;
  }>();
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadReviews = async (pageNum = 1, isInitial = true) => {
    if (!userId) return;
    try {
      if (pageNum === 1 && isInitial) setLoading(true);

      const res = await fetchReviews(userId, { page: pageNum, limit: 10 });
      const data = res.data as any;

      if (pageNum === 1) {
        setReviews(data?.reviews || data?.data || []);
        setStats(data?.stats || { averageRating: 0, totalReviews: 0 });
        setTotalPages(data?.totalPages || 1);
      } else {
        setReviews((prev) => [...prev, ...(data?.reviews || data?.data || [])]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadReviews(1);
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadReviews(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadReviews(nextPage, false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerStats}>
      <View style={styles.statsCard}>
        <View style={styles.ratingInfo}>
          <Text style={styles.avgRating}>{stats.averageRating.toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={
                  i < Math.floor(stats.averageRating) ? "star" : "star-outline"
                }
                size={18}
                color="#FFB800"
              />
            ))}
          </View>
          <Text style={styles.totalReviews}>
            Based on {stats.totalReviews} reviews
          </Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Recent Reviews</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#4A6CF7" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.appHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {userName ? `${userName}'s Reviews` : "Reviews"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => <ReviewItem review={item} />}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={64}
                color="#ddd"
              />
              <Text style={styles.emptyText}>No reviews yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  appHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  headerStats: {
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  ratingInfo: {
    alignItems: "center",
  },
  avgRating: {
    fontSize: 48,
    fontWeight: "800",
    color: "#333",
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
});
