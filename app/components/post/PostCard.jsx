import { StyleSheet, Text, View } from "react-native";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostTags from "./PostTags";

export default function PostCard({ post }) {
  return (
    <View style={styles.card}>
      <PostHeader user={post.user} createdAt={post.createdAt} />
      <Text style={styles.description}>{post.description}</Text>

      {post.tags?.length > 0 && <PostTags tags={post.tags} />}

      {post.image && <PostImage image={post.image} />}

      <PostActions likes={post.likes} comments={post.comments} />
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
