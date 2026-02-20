import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreatePostModal from "../components/dashboard/CreatePostModal";
import CreatePostTrigger from "../components/dashboard/CreatePostTrigger";
import PersonalPostsList from "../components/dashboard/PersonalPostsList";
import ProfileHeader from "../components/dashboard/ProfileHeader";
import { PERSONAL_POSTS } from "../data/personalPostMockData";

export default function DashboardScreen() {
  const [posts, setPosts] = useState(PERSONAL_POSTS);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <ProfileHeader postsCount={posts.length} />

          <CreatePostTrigger onPress={() => setModalVisible(true)} />

          <PersonalPostsList posts={posts} />
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
