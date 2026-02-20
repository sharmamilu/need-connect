import { StyleSheet, View } from "react-native";
import PostCard from "./PostCard";

export default function PersonalPostsList({ posts, onDeleteSuccess }) {
  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <PostCard
          key={post._id || post.id}
          post={post}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
});
