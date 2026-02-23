import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddCommentInput from "../components/comments/AddCommentInput";
import CommentItem from "../components/comments/CommentItem";
import { fetchMe, loadComments, postComment } from "../utils/apiFunctions";

export default function CommentsScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // { id, name }
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchMe()
      .then((res) => setCurrentUser(res.data?.data || res.data))
      .catch(console.error);

    const fetchInitialComments = async () => {
      if (!postId) return;
      try {
        setLoading(true);
        const data = await loadComments(postId);
        // Expecting data to return paginated array. E.g data.data or directly data
        setComments(data?.data || data?.comments || data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialComments();
  }, [postId]);

  const handleAddComment = async (text) => {
    try {
      const response = await postComment(postId, text, replyingTo?.id || null);

      // Successfully posted comment!
      // To ensure profile photos, names, and deeper nested structures are 100% accurate,
      // we'll fetch the full updated array from the API instead of manually building it.
      const data = await loadComments(postId);
      setComments(data?.data || data?.comments || data);

      setReplyingTo(null);

      DeviceEventEmitter.emit("CommentAdded", { postId });
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleReply = (commentId, name) => {
    setReplyingTo({ id: commentId, name });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="chevron-down" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#4A6CF7" />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item, index) =>
              item._id || item.id || index.toString()
            }
            renderItem={({ item }) => (
              <CommentItem comment={item} onReply={handleReply} />
            )}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ color: "#888" }}>
                  No comments yet. Be the first!
                </Text>
              </View>
            }
          />
        )}

        <AddCommentInput
          onSubmit={handleAddComment}
          replyTo={replyingTo?.name}
          onCancelReply={() => setReplyingTo(null)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});
