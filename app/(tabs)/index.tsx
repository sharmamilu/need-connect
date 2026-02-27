import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserGuide from "../components/common/UserGuide";
import CreatePostModal from "../components/dashboard/CreatePostModal";
import CreatePostTrigger from "../components/dashboard/CreatePostTrigger";
import PostCard from "../components/post/PostCard";
import { useAuth } from "../utils/AuthContext";
import {
  fetchFeedPosts,
  fetchMe,
  fetchMyPortfolio,
} from "../utils/apiFunctions";

export default function HomeScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadHomeData = async (pageNum = 1, isInitial = true) => {
    try {
      if (pageNum === 1 && isInitial) setLoading(true);

      const [postsRes, userRes, profileRes] = await Promise.all([
        fetchFeedPosts({ page: pageNum, limit: 10 }),
        pageNum === 1 ? fetchMe().catch(() => null) : Promise.resolve(null),
        pageNum === 1
          ? fetchMyPortfolio().catch(() => null)
          : Promise.resolve(null),
      ]);

      const newPosts = postsRes.data.posts || postsRes.data.data || [];
      const pagination = postsRes.data;

      if (pageNum === 1) {
        setPosts(newPosts);
        setTotalPages(pagination.totalPages || 1);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (userRes?.data?.success) {
        const freshUser = userRes.data.user || userRes.data.data;
        setUser(freshUser);
        updateUser(freshUser); // Syncs new roles to global context immediately
      }

      if (profileRes?.data?.success) {
        setProfile(profileRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadHomeData(1);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadHomeData(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadHomeData(nextPage, false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#3b5bdb" />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b5bdb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <CreatePostTrigger
            user={user}
            profile={profile}
            onPress={() => setModalVisible(true)}
            onProfilePress={() => router.push("/dashboard")}
          />
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onDeleteSuccess={(postId: string) => {
              setPosts(posts.filter((p) => (p._id || p.id) !== postId));
            }}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: "#666" }}>No posts yet. Be the first!</Text>
          </View>
        }
      />

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={(newPost: any) => {
          setPosts([newPost, ...posts]);
        }}
      />
      <UserGuide />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
});
