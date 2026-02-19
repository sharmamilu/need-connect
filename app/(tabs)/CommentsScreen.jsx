import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AddCommentInput from "../components/comments/AddCommentInput";
import CommentItem from "../components/comments/CommentItem";

export default function CommentsScreen() {
  const [comments, setComments] = useState(mockComments);

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "https://i.pravatar.cc/150?img=15",
      },
      text,
      createdAt: "Just now",
      replies: [],
    };

    setComments([newComment, ...comments]);
  };

  const handleReply = (commentId) => {
    console.log("Reply to:", commentId);
    // Later: open reply input under that comment
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommentItem comment={item} onReply={handleReply} />
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      <AddCommentInput onSubmit={handleAddComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
