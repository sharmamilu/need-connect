import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PostActions({ likes, comments }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.action}>
        <Feather name="heart" size={20} color="#666" />
        <Text style={styles.text}>{likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => router.push("/comments")}
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
});
