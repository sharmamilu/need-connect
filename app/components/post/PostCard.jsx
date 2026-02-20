import { StyleSheet, Text, View } from "react-native";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostImageGrid from "./PostImageGrid";
import PostTags from "./PostTags";

export default function PostCard({ post }) {
  // Use images array if available, otherwise wrap single image in an array
  const displayImages =
    post.images?.length > 0 ? post.images : post.image ? [post.image] : [];

  return (
    <View style={styles.card}>
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <Text style={styles.description}>{post.description}</Text>

      {post.tags?.length > 0 && <PostTags tags={post.tags} />}

      <PostImageGrid images={displayImages} />

      <PostActions
        likes={post.likesCount || post.likes || 0}
        comments={post.commentsCount || post.comments || 0}
      />
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
});
