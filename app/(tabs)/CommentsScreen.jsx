import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddCommentInput from "../components/comments/AddCommentInput";
import CommentItem from "../components/comments/CommentItem";
import { mockComments } from "../data/mockComments";

export default function CommentsScreen() {
  const [comments, setComments] = useState(mockComments);
  const [replyingTo, setReplyingTo] = useState(null);

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
      // Logic to add reply nestedly
      const addReplyRecursively = (list) => {
        return list.map((item) => {
          if (item.id === replyingTo.id) {
            return { ...item, replies: [...(item.replies || []), newComment] };
          }
          if (item.replies?.length > 0) {
            return { ...item, replies: addReplyRecursively(item.replies) };
          }
          return item;
        });
      };
      setComments(addReplyRecursively(comments));
      setReplyingTo(null);
    } else {
      setComments([newComment, ...comments]);
    }
  };

  const handleReply = (commentId, name) => {
    setReplyingTo({ id: commentId, name });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // Offset helps the input stay above the keyboard/emoji-picker
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentItem comment={item} onReply={handleReply} />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
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
});
