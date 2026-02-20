import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader({ user, postsCount }) {
  const router = useRouter();

  const name = user?.name || "User";
  const avatarUri = user?.profilePhoto;
  const profession = user?.profession || "Member";

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.profession}>{profession}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{postsCount} Posts</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 16,
  },
  iconBtn: {
    padding: 4,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f2f5",
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1c1e21",
  },
  profession: {
    fontSize: 14,
    color: "#65676b",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#f2f3f5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b5bdb",
  },
});
