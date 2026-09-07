import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/theme";

interface PostActionsProps {
  postId?: string;
  postAdminId?: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  onLikeToggle?: () => void;
  onLikesPress?: () => void;
}

export default function PostActions({
  postId,
  postAdminId,
  likes = 0,
  comments = 0,
  isLiked = false,
  onLikeToggle,
  onLikesPress,
}: PostActionsProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const firstRender = useRef(true);

  // Bounce the heart whenever the liked state changes (skip the initial mount).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.35,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();
  }, [isLiked, scale]);

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        {/* LIKE */}
        <TouchableOpacity
          style={styles.action}
          onPress={onLikeToggle}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={21}
              color={isLiked ? colors.heart : colors.textMuted}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLikesPress} hitSlop={8}>
          <Text style={[styles.count, isLiked && styles.countActive]}>
            {likes}
          </Text>
        </TouchableOpacity>

        {/* COMMENT */}
        <TouchableOpacity
          style={[styles.action, styles.commentAction]}
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: "/comments" as any,
              params: { postId: postId || "", postAdminId: postAdminId || "" },
            })
          }
        >
          <Feather name="message-circle" size={20} color={colors.textMuted} />
          <Text style={styles.count}>{comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
  },
  commentAction: {
    marginLeft: spacing.xl,
    gap: 6,
  },
  count: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
  },
  countActive: {
    color: colors.heart,
  },
});
