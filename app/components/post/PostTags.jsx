import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";

export default function PostTags({ tags }) {
  if (!tags?.length) return null;

  return (
    <View style={styles.container}>
      {tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>#{tag}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  tagText: {
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "600",
  },
});
