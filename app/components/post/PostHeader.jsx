import { Feather, Ionicons } from "@expo/vector-icons";
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
  userRating,
  isVerified,
  createdAt,
  onDelete,
  showMenu = false,
  userId: userIdProp,
}) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const name = userName || user?.name || "User";
  const avatarUri = userImage || user?.avatar;
  const profession = userProfession || user?.profession;
  const rating = userRating !== undefined ? userRating : user?.rating || 0;
  const verified =
    isVerified !== undefined ? isVerified : user?.isVerified || false;
  const userId =
    userIdProp ||
    user?._id ||
    user?.id ||
    (typeof user === "string" ? user : null);

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
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {verified && (
              <Ionicons name="checkmark-circle" size={14} color="#4A6CF7" />
            )}
            {profession && (
              <Text style={styles.profession} numberOfLines={1}>
                • {profession}
              </Text>
            )}
          </View>

          <View style={styles.metaRow}>
            {rating > 0 && (
              <View style={styles.ratingRow}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < Math.floor(rating) ? "star" : "star-outline"}
                    size={12}
                    color="#FFB800"
                  />
                ))}
              </View>
            )}
            <Text style={styles.time}>{formatRelativeTime(createdAt)}</Text>
          </View>
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1a1a1a",
  },
  profession: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
  },
});
