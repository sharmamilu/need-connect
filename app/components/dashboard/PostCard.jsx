import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { POST_BACKGROUNDS } from "../../constants/postBackgrounds";
import PostHeader from "../post/PostHeader";
import PostImageGrid from "../post/PostImageGrid";

import {
  deletePost,
  toggleLike,
  togglePinPost,
  toggleSavePost,
} from "../../utils/apiFunctions";
import { useAuth } from "../../utils/AuthContext";
import LikedUsersModal from "../post/LikedUsersModal";

export default function PostCard({ post, onDeleteSuccess, showMenu = true }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.liked || post.isLiked || false);
  const [likeCount, setLikeCount] = useState(
    post.likesCount || post.likes || 0,
  );
  const [loadingLike, setLoadingLike] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [commentCount, setCommentCount] = useState(
    post.commentsCount || post.comments || 0,
  );

  const [isSaved, setIsSaved] = useState(post.saved || false);
  const [isPinned, setIsPinned] = useState(post.isPinned || false);

  const { user: currentUser } = useAuth();
  const postAdminId =
    post.userId ||
    post.user?._id ||
    post.user?.id ||
    (typeof post.user === "string" ? post.user : null);
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwner = currentUserId && currentUserId === postAdminId;

  const postId = post._id || post.id;

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("CommentAdded", (event) => {
      if (event.postId === postId) {
        if (event.deleted) {
          setCommentCount((prev) => Math.max(0, prev - 1));
        } else {
          setCommentCount((prev) => prev + 1);
        }
      }
    });
    return () => sub.remove();
  }, [postId]);

  const displayImages =
    post.images?.length > 0 ? post.images : post.image ? [post.image] : [];

  const background = POST_BACKGROUNDS.find(
    (b) => b.id === post.backgroundStyle,
  );
  const showBackground =
    background && background.id !== "none" && displayImages.length === 0;

  const handleDelete = async () => {
    try {
      const postId = post._id || post.id;
      const res = await deletePost(postId);
      if (res.data.success) {
        if (Platform.OS === "android") {
          ToastAndroid.show("Post deleted successfully", ToastAndroid.SHORT);
        } else {
          Alert.alert("Success", "Post deleted successfully");
        }
        onDeleteSuccess?.(postId);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleLikeToggle = async () => {
    if (loadingLike) return;
    setLoadingLike(true);

    // Optimistic UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      const res = await toggleLike(postId);
      if (res.data?.success) {
        setIsLiked(res.data.liked);
        if (res.data.likeCount !== undefined) {
          setLikeCount(res.data.likeCount);
        }
      } else {
        // Revert on failure
        setIsLiked(!newIsLiked);
        setLikeCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikeCount((prev) => (!newIsLiked ? prev + 1 : prev - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  const handlePinToggle = async () => {
    setIsPinned(!isPinned);
    try {
      const res = await togglePinPost(postId);
      if (res.data?.success !== undefined && !res.data.success) {
        setIsPinned(isPinned);
      } else if (res.data?.isPinned !== undefined) {
        setIsPinned(res.data.isPinned);
      }
    } catch (err) {
      console.error(err);
      setIsPinned(isPinned);
      alert("Failed to pin/unpin post.");
    }
  };

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved);
    try {
      const res = await toggleSavePost(postId);
      if (res.data?.success !== undefined && !res.data.success) {
        setIsSaved(isSaved);
      } else if (res.data?.saved !== undefined) {
        setIsSaved(res.data.saved);
      }
    } catch (err) {
      console.error(err);
      setIsSaved(isSaved);
      alert("Failed to save/unsave post.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <PostHeader
          user={post.user}
          userId={post.userId || post.user?._id || post.user?.id}
          userImage={post.userImage}
          userProfession={post.userProfession}
          userName={post.userName}
          userRating={post.user?.rating || post.userRating}
          isVerified={post.user?.isVerified || post.isVerified}
          createdAt={post.createdAt}
          onDelete={handleDelete}
          showMenu={showMenu}
          isOwner={isOwner}
          isPinned={isPinned}
          isSaved={isSaved}
          onPin={handlePinToggle}
          onSave={handleSaveToggle}
        />
      </View>

      {showBackground ? (
        <LinearGradient
          colors={background.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundContent}
        >
          <Text
            style={[
              styles.description,
              styles.descriptionOnBg,
              { color: background.textColor },
            ]}
          >
            {post.description}
          </Text>
        </LinearGradient>
      ) : (
        <Text style={styles.description}>{post.description}</Text>
      )}

      <PostImageGrid images={displayImages} />

      {post.tags?.length > 0 && (
        <View style={styles.tags}>
          {post.tags.map((tag, index) => (
            <Text key={tag + index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={styles.stat}
            onPress={handleLikeToggle}
            disabled={loadingLike}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={18}
              color={isLiked ? "#FF4757" : "#666"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowLikesModal(true)}>
            <Text style={styles.statText}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionGroup}
          onPress={() =>
            router.push({
              pathname: "/comments",
              params: {
                postId,
                postAdminId:
                  post.userId ||
                  post.user?._id ||
                  post.user?.id ||
                  (typeof post.user === "string" ? post.user : null),
              },
            })
          }
        >
          <Feather name="message-circle" size={18} color="#666" />
          <Text style={styles.statText}>{commentCount}</Text>
        </TouchableOpacity>
      </View>

      {/* Liked Users Modal */}
      {showLikesModal && (
        <LikedUsersModal
          visible={showLikesModal}
          onClose={() => setShowLikesModal(false)}
          postId={postId}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  moreBtn: {
    padding: 4,
  },
  description: {
    marginVertical: 8,
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  backgroundContent: {
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginVertical: 10,
    padding: 30,
  },
  descriptionOnBg: {
    marginVertical: 0,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 32,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tag: {
    fontSize: 12,
    color: "#3b5bdb",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    marginTop: 14,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
