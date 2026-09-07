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
import CreatePostModal from "@/components/dashboard/CreatePostModal";
import CreatePostTrigger from "@/components/dashboard/CreatePostTrigger";
import PostCard from "@/components/dashboard/PostCard";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import {
  fetchMe,
  fetchMyPortfolio,
  fetchMyPosts,
  fetchReviewStats,
} from "@/utils/apiFunctions";

export default function DashboardScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadDashboardData = async (pageNum = 1, isInitial = true) => {
    try {
      if (pageNum === 1 && isInitial) setLoading(true);

      const [postsRes, userRes, profileRes] = await Promise.all([
        fetchMyPosts({ page: pageNum, limit: 10 }),
        pageNum === 1 ? fetchMe().catch(() => null) : Promise.resolve(null),
        pageNum === 1
          ? fetchMyPortfolio().catch(() => null)
          : Promise.resolve(null),
      ]);

      const newPosts = postsRes.data?.posts || postsRes.data?.data || [];
      const pagination = postsRes.data as any;

      if (pageNum === 1) {
        setPosts(newPosts);
        setTotalPages(pagination?.totalPages || 1);

        if (userRes?.data?.success) {
          const uId =
            userRes.data.user?._id ||
            userRes.data.user?.id ||
            userRes.data.data?._id ||
            userRes.data.data?.id;
          if (uId) {
            try {
              const statsRes = await fetchReviewStats(uId);
              if (statsRes.data?.success) {
                setStats(statsRes.data.data);
              }
            } catch (sErr) {
              console.error("Dashboard stats fetch failed:", sErr);
            }
          }
        }
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (userRes?.data?.success) {
        setUser(userRes.data.user || userRes.data.data);
      }

      if (profileRes?.data?.success) {
        setProfile(profileRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadDashboardData(1);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadDashboardData(1, false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadDashboardData(nextPage, false);
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
            <>
              <ProfileHeader
                user={user}
                profile={{ ...profile, rating: stats.averageRating }}
                postsCount={posts.length}
                isOwner={true}
                onViewPortfolio={
                  profile?._id
                    ? () => router.push(`/professional/${profile._id}` as any)
                    : null
                }
                onViewReviews={() =>
                  router.push({
                    pathname: "/user-reviews" as any,
                    params: {
                      userId: user?._id || user?.id,
                      userName: user?.name,
                    },
                  })
                }
              />
              <CreatePostTrigger
                user={user}
                profile={profile}
                onPress={() => setModalVisible(true)}
                onProfilePress={() => router.push("/dashboard" as any)}
              />
            </>
          }
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onDeleteSuccess={(postId: string) => {
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
                {"You haven't posted anything yet."}
              </Text>
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
