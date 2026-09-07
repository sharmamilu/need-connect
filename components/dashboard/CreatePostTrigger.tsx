import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.xl,
    marginBottom: spacing.lg,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: colors.primarySoft,
    borderRadius: 22,
    padding: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.skeleton,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  placeholder: {
    color: colors.placeholder,
    fontSize: 14,
    fontWeight: "500",
  },
  editIcon: {
    opacity: 0.7,
  },
  photoButton: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },
});
