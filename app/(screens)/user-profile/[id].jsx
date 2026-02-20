import { useLocalSearchParams, useRouter } from "expo-router";
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
import PostCard from "../../components/dashboard/PostCard";
import ProfileHeader from "../../components/dashboard/ProfileHeader";
import { fetchPostsByUser } from "../../utils/apiFunctions";

export default function UserProfileScreen() {
  const router = useRouter();
  const { id, name, avatarUri, profession } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadUserData = async (pageNum = 1, isInitial = true) => {
    if (!id) return;
    try {
      if (pageNum === 1 && isInitial) setLoading(true);

      const postsRes = await fetchPostsByUser(id, { page: pageNum, limit: 10 });
      const newPosts = postsRes.data?.posts || postsRes.data?.data || [];
      const pagination = postsRes.data;

      if (pageNum === 1) {
        setPosts(newPosts);
        setTotalPages(pagination?.totalPages || 1);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadUserData(1);
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadUserData(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadUserData(nextPage, false);
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

  const displayUser = {
    name: name || posts[0]?.userName || posts[0]?.user?.name || "User",
    avatar: avatarUri || posts[0]?.userImage || posts[0]?.user?.avatar,
    profession:
      profession || posts[0]?.userProfession || posts[0]?.user?.profession,
  };

  const profileProps = {
    name: displayUser.name,
    profilePhoto: displayUser.avatar,
    profession: displayUser.profession,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <ProfileHeader
              user={displayUser}
              profile={profileProps}
              postsCount={posts.length}
            />
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onDeleteSuccess={(postId) => {
                setPosts(posts.filter((p) => (p._id || p.id) !== postId));
              }}
              showMenu={true}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ color: "#666" }}>
                This user hasn't posted anything yet.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
});
