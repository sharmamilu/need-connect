import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/post/PostCard";
import { mockPosts } from "../data/mockPosts";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
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
