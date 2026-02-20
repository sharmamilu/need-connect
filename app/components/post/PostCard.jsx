import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { POST_BACKGROUNDS } from "../../constants/postBackgrounds";
import PostActions from "./PostActions";
import PostHeader from "./PostHeader";
import PostImageGrid from "./PostImageGrid";
import PostTags from "./PostTags";

export default function PostCard({ post }) {
  // Use images array if available, otherwise wrap single image in an array
  const displayImages =
    post.images?.length > 0 ? post.images : post.image ? [post.image] : [];

  const background = POST_BACKGROUNDS.find(
    (b) => b.id === post.backgroundStyle,
  );
  const showBackground =
    background && background.id !== "none" && displayImages.length === 0;

  return (
    <View style={styles.card}>
      <PostHeader
        user={post.user}
        userImage={post.userImage}
        userProfession={post.userProfession}
        userName={post.userName}
        createdAt={post.createdAt}
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
