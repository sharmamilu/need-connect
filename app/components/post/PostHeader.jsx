import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatRelativeTime } from "../../utils/dateUtils";
import PostMenuModal from "./PostMenuModal";

export default function PostHeader({
  user,
  userImage,
  userProfession,
  userName,
  createdAt,
  onDelete,
  showMenu = false,
}) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const name = userName || user?.name || "User";
  const avatarUri = userImage || user?.avatar;
  const profession = userProfession || user?.profession;
  const userId =
    user?._id || user?.id || (typeof user === "string" ? user : null);

  const handleProfilePress = () => {
    if (userId) {
      router.push({
        pathname: "/user-profile/[id]",
        params: {
          id: userId,
          name: name || "",
          avatarUri: avatarUri || "",
          profession: profession || "",
        },
      });
    }
  };

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileArea}
        onPress={handleProfilePress}
        activeOpacity={0.8}
      >
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
      </TouchableOpacity>

      {showMenu && (
        <>
          <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
            <Feather name="more-horizontal" size={20} color="#666" />
          </TouchableOpacity>

          <PostMenuModal
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onDelete={onDelete}
            onPin={() => alert("Post pinned successfully!")}
            onSave={() => alert("Post saved to your collection!")}
            onCopyLink={() => alert("Post link copied!")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  menuButton: {
    padding: 8,
    marginRight: -8,
  },
});
