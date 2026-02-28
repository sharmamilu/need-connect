import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import ListingCard from "../components/listings/ListingCard";
import { fetchUserListings } from "../utils/apiFunctions";

export default function UserListingsScreen() {
  const router = useRouter();
  const { userId, userName } = useLocalSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadListings = async (pageNum = 1, isRefresh = false) => {
    if (!userId) return;
    try {
      if (isRefresh) setRefreshing(true);
      const res = await fetchUserListings(userId as string, {
        page: pageNum,
        limit: 10,
      });
      const newListings = res.data.data || res.data.listings || [];

      if (pageNum === 1) {
        setListings(newListings);
      } else {
        setListings((prev) => [...prev, ...newListings]);
      }

      setHasMore(newListings.length === 10);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadListings(1);
  }, [userId]);

  const handleRefresh = () => {
    loadListings(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !refreshing && hasMore) {
      loadListings(page + 1);
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
        <Text style={styles.headerTitle}>
          {userName ? `${userName}'s` : "My"} Listings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && page === 1 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather
            name="shopping-bag"
            size={48}
            color="#ccc"
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyTitle}>No listings yet.</Text>
          <Text style={styles.emptySub}>
            Any marketplace items created will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => (item._id || item.id).toString()}
          renderItem={({ item }) => (
            <View style={styles.postWrapper}>
              <ListingCard
                data={item}
                onDeleteSuccess={(listingId: string) => {
                  setListings((prev) =>
                    prev.filter((l) => (l._id || l.id) !== listingId),
                  );
                }}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore && listings.length > 0 ? (
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
  postWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
