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
import PostCard from "@/components/dashboard/PostCard";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import ReviewModal from "@/components/reviews/ReviewModal";
import {
  fetchPostsByUser,
  fetchReviewStats,
  postReview,
} from "@/utils/apiFunctions";
import { useAuth } from "@/utils/AuthContext";

export default function UserProfileScreen() {
  const router = useRouter();
  const { id, name, avatarUri, profession } = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatarUri?: string;
    profession?: string;
  }>();
  const userId = Array.isArray(id) ? id[0] : id || "";
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState<{ averageRating: number; totalReviews: number }>({ averageRating: 0, totalReviews: 0 });
  const { user: currentUser } = useAuth();

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Review state
  const [showReview, setShowReview] = useState<boolean>(false);

  const loadUserData = async (pageNum = 1, isInitial = true) => {
    if (!userId) return;
    try {
      if (pageNum === 1 && isInitial) setLoading(true);

      const postsRes = await fetchPostsByUser(userId, { page: pageNum, limit: 10 });
      const rawData: any = postsRes.data;
      const newPosts: any[] = rawData?.posts || rawData?.data || (Array.isArray(rawData) ? rawData : []);
      const pagination = rawData;

      if (pageNum === 1) {
        setPosts(newPosts);
        setTotalPages(pagination?.totalPages || 1);

        // Fetch fresh stats for the user
        try {
          const statsRes = await fetchReviewStats(userId);
          if (statsRes.data?.success) {
            setStats(statsRes.data.data);
          }
        } catch (sErr) {
          console.error("Stats fetch failed:", sErr);
        }
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
  }, [userId]);

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
    rating: stats.averageRating || posts[0]?.user?.rating || 0,
    totalReviews: stats.totalReviews || 0,
    isVerified: posts[0]?.user?.isVerified || true,
  };

  const isOwner = currentUser?.id === id || currentUser?._id === id;

  const profileProps = {
    name: displayUser.name,
    profilePhoto: displayUser.avatar,
    profession: displayUser.profession,
    rating: displayUser.rating,
    isVerified: displayUser.isVerified,
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
              isOwner={isOwner}
              onViewPortfolio={
                userId ? () => router.push(`/professional/${userId}`) : null
              }
              onWriteReview={isOwner ? null : () => setShowReview(true)}
              onViewReviews={
                userId
                  ? () =>
                      router.push({
                        pathname: "/user-reviews",
                        params: { userId, userName: displayUser.name },
                      })
                  : null
              }
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
                {"This user hasn't posted anything yet."}
              </Text>
            </View>
          }
        />
      </View>

      <ReviewModal
        visible={showReview}
        onClose={() => setShowReview(false)}
        userName={displayUser.name}
        reviewedUserId={userId}
        onSubmit={async (reviewData) => {
          try {
            await postReview(reviewData);
            alert("Review submitted successfully!");
            setShowReview(false);
          } catch (err: any) {
            console.error("Review failed:", err);
            alert(err?.response?.data?.message || "Failed to submit review.");
          }
        }}
      />
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
