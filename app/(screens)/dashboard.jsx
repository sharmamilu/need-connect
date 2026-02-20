import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreatePostModal from "../components/dashboard/CreatePostModal";
import CreatePostTrigger from "../components/dashboard/CreatePostTrigger";
import PersonalPostsList from "../components/dashboard/PersonalPostsList";
import ProfileHeader from "../components/dashboard/ProfileHeader";
import { fetchMyPosts } from "../utils/apiFunctions";

export default function DashboardScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loadMyPosts = async () => {
    try {
      const res = await fetchMyPosts();
      setPosts(res.data.posts || res.data.data || []);
    } catch (error) {
      console.error("Error fetching my posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMyPosts();
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
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ProfileHeader postsCount={posts.length} />

          <CreatePostTrigger onPress={() => setModalVisible(true)} />

          {posts.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ color: "#666" }}>
                You haven't posted anything yet.
              </Text>
            </View>
          ) : (
            <PersonalPostsList posts={posts} />
          )}
        </ScrollView>

        <CreatePostModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreate={(newPost) => {
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
    paddingBottom: 40,
  },
});
