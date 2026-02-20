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
import CreatePostModal from "../components/dashboard/CreatePostModal";
import CreatePostTrigger from "../components/dashboard/CreatePostTrigger";
import PostCard from "../components/post/PostCard";
import {
  fetchFeedPosts,
  fetchMe,
  fetchMyPortfolio,
} from "../utils/apiFunctions";

export default function HomeScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loadHomeData = async () => {
    try {
      const [postsRes, userRes, profileRes] = await Promise.all([
        fetchFeedPosts(),
        fetchMe().catch(() => null),
        fetchMyPortfolio().catch(() => null),
      ]);

      setPosts(postsRes.data.posts || postsRes.data.data || []);

      if (userRes?.data?.success) {
        setUser(userRes.data.user || userRes.data.data);
      }

      if (profileRes?.data?.success) {
        setProfile(profileRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
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
        keyExtractor={(item) => item._id || item.id}
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
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ padding: 16 }}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
});
