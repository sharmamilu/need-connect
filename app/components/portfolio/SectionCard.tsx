import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  required?: boolean;
  /** Shows a count pill on the right (e.g. number of skills). */
  count?: number;
  /** Optional element rendered on the right of the header (overrides count). */
  right?: React.ReactNode;
  children: React.ReactNode;
};

/** Standardized card + header used by every portfolio section. */
export default function SectionCard({
  icon,
  title,
  required,
  count,
  right,
  children,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconChip}>
            <Feather name={icon} size={16} color={colors.primary} />
          </View>
          <Text style={styles.title}>
            {title}
            {required ? <Text style={styles.required}> *</Text> : null}
          </Text>
        </View>

        {right
          ? right
          : typeof count === "number" && count > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count}</Text>
              </View>
            )}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  required: {
    color: colors.error,
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    minWidth: 26,
    alignItems: "center",
  },
  countText: {
    color: colors.primary,
    fontSize: 12.5,
    fontWeight: "700",
  },
});
