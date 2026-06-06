import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";

type Props = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onPressCta?: () => void;
};

/** Friendly empty state for the feed. */
export default function FeedEmpty({
  title = "No posts yet",
  subtitle = "Be the first to share something with the community.",
  ctaLabel,
  onPressCta,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather name="feather" size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {ctaLabel && onPressCta ? (
        <TouchableOpacity
          style={styles.cta}
          onPress={onPressCta}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  ctaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
