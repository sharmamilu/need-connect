import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PostCard from "../components/dashboard/PostCard";
import { fetchSavedPosts } from "../utils/apiFunctions";

export default function SavedPostsScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await fetchSavedPosts({ page: pageNum, limit: 10 });
      const newPosts = res.data.posts || res.data.data || [];

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(newPosts.length === 10);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const handleRefresh = () => {
    loadPosts(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && !refreshing && hasMore) {
      loadPosts(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Posts</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && page === 1 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather
            name="bookmark"
            size={48}
            color="#ccc"
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.emptyTitle}>No saved posts yet</Text>
          <Text style={styles.emptySub}>
            When you save posts they will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => (item._id || item.id).toString()}
          renderItem={({ item }) => (
            <View style={styles.postWrapper}>
              <PostCard
                post={item}
                showMenu={true}
                onDeleteSuccess={(postId: string) => {
                  setPosts(posts.filter((p) => (p._id || p.id) !== postId));
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
            hasMore && posts.length > 0 ? (
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
