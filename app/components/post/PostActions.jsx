import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostActions({
  postId,
  postAdminId,
  likes,
  comments,
  isLiked,
  onLikeToggle,
  onLikesPress,
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.actionGroup}>
        <TouchableOpacity style={styles.actionIcon} onPress={onLikeToggle}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? "#FF4757" : "#666"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onLikesPress}>
          <Text style={styles.text}>{likes}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.action}
        onPress={() =>
          router.push({
            pathname: "/comments",
            params: { postId, postAdminId },
          })
        }
      >
        <Feather name="message-circle" size={20} color="#666" />
        <Text style={styles.text}>{comments}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action}>
        <Feather name="share-2" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionIcon: {
    paddingRight: 4,
  },
});
