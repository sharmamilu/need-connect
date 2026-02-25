import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { POST_BACKGROUNDS } from "../../constants/postBackgrounds";
import LikedUsersModal from "./LikedUsersModal";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostImageGrid from "./PostImageGrid";
import PostTags from "./PostTags";

import {
  deletePost,
  toggleLike,
  togglePinPost,
  toggleSavePost,
} from "../../utils/apiFunctions";
import { useAuth } from "../../utils/AuthContext";

export default function PostCard({ post, onDeleteSuccess }) {
  // Use images array if available, otherwise wrap single image in an array
  const displayImages =
    post.images?.length > 0 ? post.images : post.image ? [post.image] : [];

  const background = POST_BACKGROUNDS.find(
    (b) => b.id === post.backgroundStyle,
  );
  const showBackground =
    background && background.id !== "none" && displayImages.length === 0;

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

  const handleDelete = async () => {
    try {
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

    // Optimistic update
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
    // Optimistic
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
    // Optimistic
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
        showMenu={true}
        isOwner={isOwner}
        isPinned={isPinned}
        isSaved={isSaved}
        onPin={handlePinToggle}
        onSave={handleSaveToggle}
      />

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

      {post.tags?.length > 0 && <PostTags tags={post.tags} />}

      <PostImageGrid images={displayImages} />

      <PostActions
        postId={postId}
        postAdminId={
          post.userId ||
          post.user?._id ||
          post.user?.id ||
          (typeof post.user === "string" ? post.user : null)
        }
        likes={likeCount}
        comments={commentCount}
        isLiked={isLiked}
        onLikeToggle={handleLikeToggle}
        onLikesPress={() => setShowLikesModal(true)}
      />

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
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#444",
  },
  backgroundContent: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 10,
    padding: 20,
  },
  descriptionOnBg: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 30,
  },
});
