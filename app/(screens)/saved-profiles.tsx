import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import ProfessionalCard from "@/components/explore/ProfessionalCard";
import { fetchSavedPortfolios } from "@/utils/apiFunctions";

export default function SavedPortfoliosScreen() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPortfolios = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await fetchSavedPortfolios({ page: pageNum, limit: 10 });
      const newItems = res.data.portfolios || res.data.data || [];

      if (pageNum === 1) {
        setPortfolios(newItems);
      } else {
        setPortfolios((prev) => [...prev, ...newItems]);
      }

      setHasMore(newItems.length === 10);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPortfolios(1);
  }, []);

  const handleRefresh = () => {
    loadPortfolios(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !refreshing && hasMore) {
      loadPortfolios(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Profiles</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && page === 1 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : portfolios.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather
            name="bookmark"
            size={48}
            color="#ccc"
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyTitle}>No saved profiles yet</Text>
          <Text style={styles.emptySub}>
            {"When you save professional portfolios, they'll appear here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={portfolios}
          keyExtractor={(item) => (item._id || item.id).toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProfessionalCard data={item} />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore && portfolios.length > 0 ? (
              <ActivityIndicator
                size="small"
                color="#4A6CF7"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  cardWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
