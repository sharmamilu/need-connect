import { Image, StyleSheet, Text, View } from "react-native";
import { formatRelativeTime } from "../../utils/dateUtils";

export default function PostHeader({
  user,
  userImage,
  userProfession,
  userName,
  createdAt,
}) {
  const name = userName || user?.name || "User";
  const avatarUri = userImage || user?.avatar;
  const profession = userProfession || user?.profession;

  return (
    <View style={styles.container}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.placeholderText}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {profession && <Text style={styles.profession}>{profession}</Text>}
        <Text style={styles.time}>{formatRelativeTime(createdAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1a1a1a",
  },
  profession: {
    fontSize: 12,
    color: "#666",
    marginTop: 1,
  },
  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 1,
  },
});
