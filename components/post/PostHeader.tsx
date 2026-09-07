import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/theme";
import { formatRelativeTime } from "@/utils/dateUtils";
import PostMenuModal from "./PostMenuModal";

interface PostHeaderProps {
  user?: any;
  userImage?: string;
  userProfession?: string;
  userName?: string;
  userRating?: number;
  isVerified?: boolean;
  createdAt?: string;
  onDelete?: () => void;
  showMenu?: boolean;
  userId?: string;
  isOwner?: boolean;
  isPinned?: boolean;
  isSaved?: boolean;
  onPin?: () => void;
  onSave?: () => void;
  onCopyLink?: () => void;
  hidePin?: boolean;
}

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
  isOwner = false,
  isPinned = false,
  isSaved = false,
  onPin,
  onSave,
  onCopyLink,
  hidePin = false,
}: PostHeaderProps) {
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
        pathname: "/user-profile/[id]" as any,
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
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {verified && (
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.primary}
              />
            )}
            {profession && (
              <Text style={styles.profession} numberOfLines={1}>
                • {profession}
              </Text>
            )}
            {isPinned && !hidePin && (
              <MaterialCommunityIcons
                name="pin"
                size={14}
                color={colors.error}
                style={{ marginLeft: 2 }}
              />
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
                    color={colors.star}
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
            onPin={onPin}
            onSave={onSave}
            onCopyLink={onCopyLink || (() => alert("Post link copied!"))}
            isOwner={isOwner && !hidePin}
            isPinned={isPinned}
            isSaved={isSaved}
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
    marginBottom: spacing.md,
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
    marginRight: spacing.md,
    backgroundColor: colors.skeleton,
  },
  placeholderAvatar: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
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
    color: colors.text,
    flexShrink: 1,
  },
  profession: {
    fontSize: 13,
    color: colors.textMuted,
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },
  time: {
    fontSize: 12,
    color: colors.gray,
  },
  menuButton: {
    padding: spacing.sm,
    marginRight: -spacing.sm,
  },
});
