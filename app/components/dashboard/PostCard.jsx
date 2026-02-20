import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostCard({ post }) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.time}>{post.createdAt}</Text>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{post.description}</Text>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} />
      )}

      {post.tags?.length > 0 && (
        <View style={styles.tags}>
          {post.tags.map((tag) => (
            <Text key={tag} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.stat}>
          <Feather name="heart" size={14} color="#666" />
          <Text style={styles.statText}>{post.likes || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.stat}
          onPress={() => router.push("/comments")}
        >
          <Feather name="message-circle" size={14} color="#666" />
          <Text style={styles.statText}>{post.comments || 0}</Text>
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
    alignItems: "center",
    marginBottom: 4,
  },
  time: {
    color: "#888",
    fontSize: 12,
  },
  description: {
    marginVertical: 8,
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginVertical: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
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
