import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import PostCard from "../components/post/PostCard";
import { fetchFeedPosts } from "../utils/apiFunctions";

export default function HomeScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async () => {
    try {
      const res = await fetchFeedPosts();
      // The backend returns { success: true, posts: [...], ... } based on typical service patterns
      setPosts(res.data.posts || res.data.data || []);
    } catch (error) {
      console.error("Error fetching feed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFeed();
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
          <TouchableOpacity
            style={styles.createPostBox}
            onPress={() => router.push("/dashboard")}
          >
            <View style={styles.avatarPlaceholderSmall}>
              <Feather name="user" size={16} color="#666" />
            </View>
            <View style={styles.createPostInput}>
              <Text style={styles.createPostText}>What's on your mind?</Text>
            </View>
            <Feather name="image" size={20} color="#45bd62" />
          </TouchableOpacity>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  createPostBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  avatarPlaceholderSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
    justifyContent: "center",
  },
  createPostInput: {
    flex: 1,
    height: 36,
    backgroundColor: "#f0f2f5",
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  createPostText: {
    color: "#65676b",
    fontSize: 14,
  },
});
