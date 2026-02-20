import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CommentItem({ comment, onReply, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);

  // Maximum depth for visual indentation to prevent content from going off-screen
  const maxIndentationDepth = 2;
  const isDeeplyNested = depth >= maxIndentationDepth;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <View
      style={[
        styles.container,
        depth > 0 && !isDeeplyNested && { marginLeft: 6 },
        depth > 0 && { marginTop: 10 },
      ]}
    >
      {/* Thread line connecting from parent */}
      {depth > 0 && <View style={styles.threadLine} />}

      <View style={styles.contentWrap}>
        <Image
          source={{ uri: comment.user.avatar || "https://i.pravatar.cc/150" }}
          style={[
            styles.avatar,
            depth > 0 && styles.smallAvatar,
            depth > 1 && styles.tinyAvatar,
          ]}
        />

        <View style={{ flex: 1 }}>
          <View style={styles.bubble}>
            <Text style={styles.name}>{comment.user.name}</Text>
            <Text style={styles.text}>{comment.text}</Text>
          </View>

          <View style={styles.actions}>
            <Text style={styles.time}>{comment.createdAt}</Text>

            <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
              <Text style={[styles.actionText, isLiked && styles.likedText]}>
                {isLiked ? "Liked" : "Like"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onReply(comment.id, comment.user.name)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>

            {likesCount > 0 && (
              <View style={styles.likeBadge}>
                <Ionicons name="heart" size={10} color="#ff4757" />
                <Text style={styles.likeCount}>{likesCount}</Text>
              </View>
            )}
          </View>

          {comment.replies?.length > 0 && (
            <TouchableOpacity
              onPress={() => setShowReplies(!showReplies)}
              style={styles.toggleReplies}
            >
              <View style={styles.toggleLine} />
              <Text style={styles.toggleText}>
                {showReplies
                  ? "Hide replies"
                  : `View ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`}
              </Text>
            </TouchableOpacity>
          )}

          {showReplies &&
            comment.replies?.map((reply, index) => (
              <CommentItem
                key={reply._id || reply.id || index}
                comment={reply}
                onReply={onReply}
                depth={depth + 1}
              />
            ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  contentWrap: {
    flexDirection: "row",
  },
  threadLine: {
    position: "absolute",
    left: -20, // Aligns with parent's avatar center area
    top: -24,
    bottom: 20,
    width: 1.5,
    backgroundColor: "#e8e8e8",
    borderBottomLeftRadius: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  tinyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bubble: {
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  name: {
    fontWeight: "700",
    fontSize: 12,
    color: "#1c1e21",
    marginBottom: 1,
  },
  text: {
    fontSize: 14,
    color: "#050505",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    marginTop: 2,
    marginBottom: 4,
    alignItems: "center",
    gap: 16,
    paddingLeft: 4,
  },
  time: {
    fontSize: 11,
    color: "#65676b",
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#65676b",
    fontWeight: "700",
  },
  likedText: {
    color: "#3b5bdb",
  },
  likeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    gap: 2,
    marginLeft: -4,
  },
  likeCount: {
    fontSize: 10,
    color: "#65676b",
    fontWeight: "600",
  },
  toggleReplies: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 4,
    gap: 8,
  },
  toggleLine: {
    width: 20,
    height: 1,
    backgroundColor: "#ddd",
  },
  toggleText: {
    fontSize: 12,
    color: "#65676b",
    fontWeight: "700",
  },
});
