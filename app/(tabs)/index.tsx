import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/theme";

import UserGuide from "@/components/common/UserGuide";
import CreatePostModal from "@/components/dashboard/CreatePostModal";
import CreatePostTrigger from "@/components/dashboard/CreatePostTrigger";
import FeedControls, {
  FeedFilter,
  FeedSort,
} from "@/components/dashboard/FeedControls";
import FeedEmpty from "@/components/dashboard/FeedEmpty";
import HomeHeader from "@/components/dashboard/HomeHeader";
import PostSkeleton from "@/components/dashboard/PostSkeleton";
import SuggestedOpportunities from "@/components/dashboard/SuggestedOpportunities";
import MatchedPreferencesSection from "@/components/dashboard/MatchedPreferencesSection";
import PostCard from "@/components/post/PostCard";
import { useAuth } from "@/utils/AuthContext";
import {
  fetchFeedPosts,
  fetchMe,
  fetchMyPortfolio,
} from "@/utils/apiFunctions";
import { Portfolio, Post, User } from "@/types";

const hasImages = (p: any) => p?.images?.length > 0 || !!p?.image;
const likeCount = (p: any) => p?.likesCount ?? p?.likes ?? 0;
const postTime = (p: any) => new Date(p?.createdAt || 0).getTime();

export default function HomeScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Feed controls (client-side over loaded posts)
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [sort, setSort] = useState<FeedSort>("latest");

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

      const postsData: any = postsRes.data;
      const newPosts = postsData?.posts || postsData?.data || (Array.isArray(postsData) ? postsData : []);
      const pagination = postsData;

      if (pageNum === 1) {
        setPosts(newPosts);
        setTotalPages(pagination?.totalPages || 1);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (userRes?.data?.success) {
        const freshUser = userRes.data.user || userRes.data.data;
        setUser(freshUser);
        updateUser(freshUser); // Syncs new roles to global context immediately
      }

      if (profileRes?.data?.success) {
        setProfile(profileRes.data.data ?? null);
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

  // Apply filter + sort to the loaded posts.
  const visiblePosts = useMemo(() => {
    let arr = posts;
    if (filter === "photos") arr = arr.filter(hasImages);
    else if (filter === "text") arr = arr.filter((p) => !hasImages(p));

    arr = [...arr];
    if (sort === "top") arr.sort((a, b) => likeCount(b) - likeCount(a));
    else arr.sort((a, b) => postTime(b) - postTime(a));
    return arr;
  }, [posts, filter, sort]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (posts.length === 0) {
      return (
        <FeedEmpty
          ctaLabel="Create a post"
          onPressCta={() => setModalVisible(true)}
        />
      );
    }
    return (
      <FeedEmpty
        title="Nothing here"
        subtitle="No posts match this filter. Try a different one."
      />
    );
  };

  // Initial loading: header + skeleton placeholders.
  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.listContent}>
          <HomeHeader user={user} profile={profile} />
          <CreatePostTrigger
            user={user}
            profile={profile}
            onPress={() => setModalVisible(true)}
            onProfilePress={() => router.push("/dashboard")}
          />
          <SuggestedOpportunities />
          <MatchedPreferencesSection />
          {[0, 1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={visiblePosts}
        keyExtractor={(item, index) => `${item._id || item.id}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            <HomeHeader user={user} profile={profile} />
            <CreatePostTrigger
              user={user}
              profile={profile}
              onPress={() => setModalVisible(true)}
              onProfilePress={() => router.push("/dashboard")}
            />
            <SuggestedOpportunities />
            <MatchedPreferencesSection />
            {posts.length > 0 && (
              <FeedControls
                filter={filter}
                sort={sort}
                onFilterChange={setFilter}
                onSortChange={setSort}
              />
            )}
          </View>
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
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
    backgroundColor: colors.background,
  },
  listContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: 100,
  },
  footer: {
    paddingVertical: spacing.xl,
  },
});
