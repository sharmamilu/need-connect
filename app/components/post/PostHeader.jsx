import { Image, StyleSheet, Text, View } from "react-native";
import { formatRelativeTime } from "../../utils/dateUtils";

export default function PostHeader({ user, createdAt }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.time}>{formatRelativeTime(createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});
