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
import { fetchMe, fetchMyPortfolio, fetchMyPosts } from "../utils/apiFunctions";

export default function DashboardScreen() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [postsRes, userRes, profileRes] = await Promise.all([
        fetchMyPosts(),
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
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
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
          <ProfileHeader
            user={user}
            profile={profile}
            postsCount={posts.length}
          />

          <CreatePostTrigger
            user={user}
            profile={profile}
            onPress={() => setModalVisible(true)}
            onProfilePress={() => router.push("/dashboard")}
          />

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
