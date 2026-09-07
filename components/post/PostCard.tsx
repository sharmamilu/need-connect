import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { POST_BACKGROUNDS, PostBackground } from "@/constants/postBackgrounds";
import LikedUsersModal from "./LikedUsersModal";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostImageGrid from "./PostImageGrid";
import PostTags from "./PostTags";

import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";
import {
  deletePost,
  toggleLike,
  togglePinPost,
  toggleSavePost,
} from "@/utils/apiFunctions";
import { useAuth } from "@/utils/AuthContext";

interface PostCardProps {
  post: any;
  onDeleteSuccess?: (postId: string) => void;
}

export default function PostCard({ post, onDeleteSuccess }: PostCardProps) {
  // Use images array if available, otherwise wrap single image in an array
  const displayImages: string[] =
    post.images?.length > 0 ? post.images : post.image ? [post.image] : [];

  const background = POST_BACKGROUNDS.find(
    (b: PostBackground) => b.id === post.backgroundStyle,
  );
  const showBackground =
    background && background.id !== "none" && displayImages.length === 0;

  const [isLiked, setIsLiked] = useState<boolean>(post.liked || post.isLiked || false);
  const [likeCount, setLikeCount] = useState<number>(
    post.likesCount || post.likes || 0,
  );
  const [loadingLike, setLoadingLike] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(
    post.commentsCount || post.comments || 0,
  );

  const [isSaved, setIsSaved] = useState<boolean>(post.saved || false);
  const [isPinned, setIsPinned] = useState<boolean>(post.isPinned || false);

  const { user: currentUser } = useAuth();
  const postAdminId =
    post.userId ||
    post.user?._id ||
    post.user?.id ||
    (typeof post.user === "string" ? post.user : null);
  const currentUserId = currentUser?._id || currentUser?.id;
  const isOwner = Boolean(currentUserId && currentUserId === postAdminId);

  const postId = post._id || post.id;

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("CommentAdded", (event: any) => {
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
      if (res.data?.success) {
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
        setIsLiked(Boolean(res.data.liked));
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
        setIsPinned(Boolean(res.data.isPinned));
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
        setIsSaved(Boolean(res.data.saved));
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

      {/* STATUS BANNERS */}
      {(post.status === "Pending" ||
        (post.status && post.status.toLowerCase() === "pending")) &&
        isOwner && (
          <View style={[styles.statusBanner, styles.pendingBanner]}>
            <Feather name="clock" size={16} color="#B45309" />
            <Text style={styles.pendingText}>
              This post is currently in review.
            </Text>
          </View>
        )}

      {(post.status === "Rejected" ||
        (post.status && post.status.toLowerCase() === "rejected")) &&
        isOwner && (
          <View style={[styles.statusBanner, styles.rejectedBanner]}>
            <View style={styles.rejectedHeader}>
              <Feather name="alert-circle" size={16} color="#E53935" />
              <Text style={styles.rejectedTitle}>Post Rejected</Text>
            </View>
            <Text style={styles.rejectedReason}>
              {post.rejectionReason || "No exact reason provided by admin."}
            </Text>
            <TouchableOpacity
              style={styles.rejectedDeleteBtn}
              onPress={handleDelete}
            >
              <Text style={styles.rejectedDeleteText}>Delete Post</Text>
            </TouchableOpacity>
          </View>
        )}

      {showBackground && background ? (
        <LinearGradient
          colors={
            [
              background.colors[0] || "#fff",
              background.colors[1] || background.colors[0] || "#fff",
              ...background.colors.slice(2),
            ] as const
          }
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
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.text,
  },
  backgroundContent: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.md,
    marginTop: spacing.md,
    padding: spacing.xl,
  },
  descriptionOnBg: {
    marginTop: 0,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 30,
  },
  statusBanner: {
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  pendingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    gap: spacing.sm,
  },
  pendingText: {
    color: "#B45309",
    fontSize: 13,
    fontWeight: "600",
  },
  rejectedBanner: {
    backgroundColor: colors.errorSoft,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  rejectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  rejectedTitle: {
    color: colors.error,
    fontSize: 14,
    fontWeight: "700",
  },
  rejectedReason: {
    color: "#7F1D1D",
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  rejectedDeleteBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.error,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  rejectedDeleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
