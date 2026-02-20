import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { POST_BACKGROUNDS } from "../../constants/postBackgrounds";
import PostHeader from "../post/PostHeader";
import PostImageGrid from "../post/PostImageGrid";

export default function PostCard({ post }) {
  const router = useRouter();
  const displayImages =
    post.images?.length > 0 ? post.images : post.image ? [post.image] : [];

  const background = POST_BACKGROUNDS.find(
    (b) => b.id === post.backgroundStyle,
  );
  const showBackground =
    background && background.id !== "none" && displayImages.length === 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <PostHeader
          user={post.user}
          userImage={post.userImage}
          userProfession={post.userProfession}
          userName={post.userName}
          createdAt={post.createdAt}
        />
        <TouchableOpacity style={styles.moreBtn}>
          <Feather name="more-horizontal" size={18} color="#888" />
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.stat}>
          <Feather name="heart" size={14} color="#666" />
          <Text style={styles.statText}>
            {post.likesCount || post.likes || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stat}
          onPress={() => router.push("/comments")}
        >
          <Feather name="message-circle" size={14} color="#666" />
          <Text style={styles.statText}>
            {post.commentsCount || post.comments || 0}
          </Text>
        </TouchableOpacity>
      </View>
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
});
