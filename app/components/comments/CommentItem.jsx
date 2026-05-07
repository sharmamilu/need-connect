import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { toggleCommentLike } from "../../utils/apiFunctions";
import { formatRelativeTime } from "../../utils/dateUtils";

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  currentUser,
  postAdminId,
  depth = 0,
}) {
  const [showReplies, setShowReplies] = useState(true);
  const [isLiked, setIsLiked] = useState(
    comment.liked || comment.isLiked || false,
  );
  const [likesCount, setLikesCount] = useState(
    comment.likesCount || comment.likes || 0,
  );

  const id = comment._id || comment.id;
  const name = comment.userName || comment.user?.name || "User";
  const avatar =
    comment.profilePhoto || comment.user?.profilePhoto || comment.user?.avatar;
  const isVerified =
    comment.isVerified !== undefined
      ? comment.isVerified
      : comment.user?.isVerified || false;
  const title = comment.title || comment.user?.title;
  const rating =
    comment.rating !== undefined ? comment.rating : comment.user?.rating || 0;

  // Maximum depth for visual indentation to prevent content from going off-screen
  const maxIndentationDepth = 2;
  const isDeeplyNested = depth >= maxIndentationDepth;

  const handleLike = async () => {
    // Optimistic UI updates
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      if (id) {
        const res = await toggleCommentLike(id);
        if (res?.success) {
          setIsLiked(res.liked);
          if (res.likesCount !== undefined) {
            setLikesCount(res.likesCount);
          }
        }
      }
    } catch (e) {
      // Revert UI on failure
      console.error("Failed to toggle comment like:", e);
      setIsLiked(!newIsLiked);
      setLikesCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
    }
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(id),
        },
      ],
    );
  };

  const isAuthor = Boolean(
    currentUser &&
    ((comment.user &&
      (comment.user === currentUser._id || comment.user === currentUser.id)) ||
      (comment.user?._id &&
        (comment.user._id === currentUser._id ||
          comment.user._id === currentUser.id)) ||
      (comment.userId &&
        (comment.userId === currentUser._id ||
          comment.userId === currentUser.id)) ||
      (comment.userName &&
        currentUser.name &&
        comment.userName === currentUser.name) ||
      (comment.userName &&
        currentUser.userName &&
        comment.userName === currentUser.userName)),
  );

  const isPostAdmin = Boolean(
    currentUser &&
    postAdminId &&
    (postAdminId === currentUser._id || postAdminId === currentUser.id),
  );

  return (
    <View
      style={[
        styles.container,
        depth === 0 ? styles.rootCommentCard : { marginTop: 12 },
      ]}
    >
      <View style={styles.contentWrap}>
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={[styles.avatar, depth > 0 && styles.smallAvatar]}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              depth > 0 && styles.smallAvatar,
              styles.placeholderAvatar,
            ]}
          >
            <Text
              style={[styles.placeholderText, depth > 0 && { fontSize: 12 }]}
            >
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              {isVerified && (
                <Ionicons name="checkmark-circle" size={12} color="#4A6CF7" />
              )}
              {title && (
                <Text style={styles.titleInfo} numberOfLines={1}>
                  {title}
                </Text>
              )}
            </View>
            <Text style={styles.time}>
              {formatRelativeTime(comment.createdAt || new Date())}
            </Text>
          </View>

          {rating > 0 && (
            <View style={styles.ratingRow}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(rating) ? "star" : "star-outline"}
                  size={12}
                  color="#FFB800"
                />
              ))}
              <View style={styles.verifiedRow}>
                <Ionicons name="person" size={10} color="#888" />
                <Text style={styles.verifiedText}>
                  {isVerified ? "Verified" : "User"}
                </Text>
              </View>
            </View>
          )}

          <Text style={styles.text}>{comment.text}</Text>

          <View style={styles.footerRow}>
            {comment.category ? (
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{comment.category}</Text>
              </View>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <View style={styles.actions}>
              <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
                <Ionicons
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                  size={14}
                  color={isLiked ? "#4A6CF7" : "#65676b"}
                />
                <Text style={[styles.actionText, isLiked && styles.likedText]}>
                  Like
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onReply(id, name)}
                style={styles.actionBtn}
              >
                <Ionicons name="chatbubble-outline" size={14} color="#65676b" />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>

              {likesCount > 0 && (
                <View style={styles.likeBadge}>
                  <Ionicons name="thumbs-up" size={10} color="#4A6CF7" />
                  <Text style={styles.likeCount}>{likesCount}</Text>
                </View>
              )}

              {(isAuthor || isPostAdmin) && (
                <TouchableOpacity
                  onPress={handleConfirmDelete}
                  style={[styles.actionBtn, { marginLeft: "auto" }]}
                >
                  <Ionicons name="trash-outline" size={14} color="#FF4757" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {comment.replies?.length > 0 && (
            <TouchableOpacity
              onPress={() => setShowReplies(!showReplies)}
              style={styles.toggleReplies}
            >
              <Text style={styles.toggleText}>
                {showReplies
                  ? "Hide replies"
                  : `View ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`}
              </Text>
              <Ionicons
                name={showReplies ? "chevron-up" : "chevron-down"}
                size={14}
                color="#4A6CF7"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Replies nested cleanly with dynamic padding */}
      {showReplies && comment.replies?.length > 0 && (
        <View
          style={{
            paddingLeft: depth === 0 ? 46 : depth < 3 ? 32 : 12,
            marginTop: 4,
            borderLeftWidth: depth > 0 ? 2 : 0,
            borderLeftColor: "#f4f4f5",
            marginLeft: depth > 0 ? 16 : 0,
          }}
        >
          {comment.replies.map((reply, index) => (
            <CommentItem
              key={reply._id || reply.id || index}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              currentUser={currentUser}
              postAdminId={postAdminId}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  rootCommentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f2f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contentWrap: {
    flexDirection: "row",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  name: {
    fontWeight: "700",
    fontSize: 14,
    color: "#222",
  },
  titleInfo: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 8,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 6,
  },
  verifiedText: {
    fontSize: 12,
    color: "#6b7280",
  },
  text: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tagBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#4b5563",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  time: {
    fontSize: 12,
    color: "#9ca3af",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: "#65676b",
    fontWeight: "600",
  },
  likedText: {
    color: "#4A6CF7",
  },
  likeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: "#65676b",
    fontWeight: "600",
  },
  toggleReplies: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
    gap: 4,
  },
  toggleText: {
    fontSize: 13,
    color: "#4A6CF7",
    fontWeight: "600",
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
