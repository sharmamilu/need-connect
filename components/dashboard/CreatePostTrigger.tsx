import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/theme";
import { User } from "@/types";

interface CreatePostTriggerProps {
  onPress: () => void;
  onProfilePress?: () => void;
  user?: User | null;
  profile?: any;
}

export default function CreatePostTrigger({
  onPress,
  onProfilePress,
  user,
  profile,
}: CreatePostTriggerProps) {
  const avatarUri = profile?.profilePhoto || user?.avatar;
  const nameInitial =
    user?.name?.charAt(0).toUpperCase() ||
    profile?.name?.charAt(0).toUpperCase() ||
    "";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onProfilePress}
        activeOpacity={0.85}
        style={styles.avatarWrapper}
      >
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            {nameInitial ? (
              <Text style={styles.initialText}>{nameInitial}</Text>
            ) : (
              <Feather name="user" size={15} color="#fff" />
            )}
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputBar}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.placeholder}>What&apos;s on your mind?</Text>
        <Feather name="edit-2" size={14} color={colors.placeholder} style={styles.editIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.photoButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Feather name="image" size={18} color={colors.success} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: spacing.md,
    marginTop: 4,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
    ...Platform.select({
      ios: {
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 1.5,
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "rgba(74, 108, 247, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 17,
    backgroundColor: colors.skeleton,
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  inputBar: {
    flex: 1,
    height: 40,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  placeholder: {
    color: "#94A3B8",
    fontSize: 13.5,
    fontWeight: "500",
  },
  editIcon: {
    opacity: 0.6,
  },
  photoButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
});
