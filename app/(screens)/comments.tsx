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
import AddCommentInput from "@/components/comments/AddCommentInput";
import CommentItem from "@/components/comments/CommentItem";
import {
  deleteComment,
  fetchMe,
  loadComments,
  postComment,
} from "@/utils/apiFunctions";

export default function CommentsScreen() {
  const router = useRouter();
  const { postId, postAdminId } = useLocalSearchParams<{
    postId: string;
    postAdminId?: string;
  }>();
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchMe()
      .then((res) =>
        setCurrentUser(res.data?.user || res.data?.data || res.data),
      )
      .catch(() => {});

    const fetchInitialComments = async () => {
      if (!postId) return;
      try {
        setLoading(true);
        const data = await loadComments(postId);
        setComments(data?.data || data?.comments || data || []);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialComments();
  }, [postId]);

  const handleAddComment = async (text: string) => {
    if (!postId) return;
    try {
      await postComment(postId, text, replyingTo?.id || null);
      const data = await loadComments(postId);
      setComments(data?.data || data?.comments || data || []);
      setReplyingTo(null);
      DeviceEventEmitter.emit("CommentAdded", { postId });
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleReply = (commentId: string, name: string) => {
    setReplyingTo({ id: commentId, name });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!postId) return;
    try {
      const res = await deleteComment(commentId);
      if (res?.success || res?.message) {
        const data = await loadComments(postId);
        setComments(data?.data || data?.comments || data || []);
        DeviceEventEmitter.emit("CommentAdded", { postId, deleted: true });
      }
    } catch (e) {
      console.error("Failed to delete comment:", e);
      alert("Failed to delete comment.");
    }
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
        keyboardVerticalOffset={0}
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
              <CommentItem
                comment={item}
                onReply={handleReply}
                onDelete={handleDeleteComment}
                currentUser={currentUser}
                postAdminId={postAdminId}
              />
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
