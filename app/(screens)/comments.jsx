import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { mockComments } from "../data/mockComments";

export default function CommentsScreen() {
  const router = useRouter();
  const [comments, setComments] = useState(mockComments);
  const [replyingTo, setReplyingTo] = useState(null); // { id, name }

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "https://i.pravatar.cc/150?img=15",
      },
      text,
      createdAt: "Just now",
      likes: 0,
      replies: [],
    };

    if (replyingTo) {
      // Find the parent and add to its replies
      const addReplyToNode = (list, parentId) => {
        return list.map((item) => {
          if (item.id === parentId) {
            return { ...item, replies: [...(item.replies || []), newComment] };
          }
          if (item.replies?.length > 0) {
            return { ...item, replies: addReplyToNode(item.replies, parentId) };
          }
          return item;
        });
      };
      setComments(addReplyToNode(comments, replyingTo.id));
      setReplyingTo(null);
    } else {
      setComments([newComment, ...comments]);
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
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentItem comment={item} onReply={handleReply} />
          )}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />

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
