import { Feather } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CreatePostTrigger({
  onPress,
  onProfilePress,
  user,
  profile,
}) {
  const avatarUri = profile?.profilePhoto || user?.avatar;
  const nameInitial =
    user?.name?.charAt(0).toUpperCase() ||
    profile?.name?.charAt(0).toUpperCase() ||
    "";

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onProfilePress}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            {nameInitial ? (
              <Text style={styles.initialText}>{nameInitial}</Text>
            ) : (
              <Feather name="user" size={16} color="#666" />
            )}
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputBar} onPress={onPress}>
        <Text style={styles.placeholder}>What's on your mind?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress}>
        <Feather name="image" size={20} color="#45bd62" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f2f5",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4A6CF7",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  inputBar: {
    flex: 1,
    height: 36,
    backgroundColor: "#f0f2f5",
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  placeholder: {
    color: "#65676b",
    fontSize: 14,
  },
});
