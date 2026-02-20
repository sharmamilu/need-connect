import { StyleSheet, View } from "react-native";
import PostCard from "./PostCard";

export default function PersonalPostsList({ posts }) {
  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
});
