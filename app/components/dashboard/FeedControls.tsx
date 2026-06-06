import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";

export type FeedFilter = "all" | "photos" | "text";
export type FeedSort = "latest" | "top";

const FILTERS: { key: FeedFilter; label: string; icon: any }[] = [
  { key: "all", label: "All Posts", icon: "grid" },
  { key: "photos", label: "Photos", icon: "image" },
  { key: "text", label: "Text", icon: "align-left" },
];

type Props = {
  filter: FeedFilter;
  sort: FeedSort;
  onFilterChange: (f: FeedFilter) => void;
  onSortChange: (s: FeedSort) => void;
  showTools: boolean;
  onToggleTools: () => void;
};

/** Filter chips + sort toggle for the feed (operates on loaded posts). */
export default function FeedControls({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  showTools,
  onToggleTools,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onFilterChange(f.key)}
              activeOpacity={0.8}
            >
              <Feather
                name={f.icon}
                size={12}
                color={active ? "#fff" : colors.textMuted}
                style={styles.chipIcon}
              />
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.rightGroup}>
        <TouchableOpacity
          style={[styles.toolsToggle, showTools && styles.toolsToggleActive]}
          onPress={onToggleTools}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={showTools ? "Hide Tools" : "Show Tools"}
        >
          <Feather
            name={showTools ? "eye" : "eye-off"}
            size={12}
            color={showTools ? colors.primary : colors.textMuted}
          />
          <Text style={[styles.toolsToggleText, showTools && styles.toolsToggleTextActive]}>
            Tools
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => onSortChange(sort === "latest" ? "top" : "latest")}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${sort === "latest" ? "top" : "latest"}`}
        >
          <Feather
            name={sort === "latest" ? "clock" : "trending-up"}
            size={13}
            color={colors.primary}
          />
          <Text style={styles.sortText}>
            {sort === "latest" ? "Latest" : "Top"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  chips: {
    flexDirection: "row",
    gap: spacing.xs || 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textMuted,
  },
  chipTextActive: {
    color: "#fff",
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toolsToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolsToggleActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary + "30",
  },
  toolsToggleText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.textMuted,
  },
  toolsToggleTextActive: {
    color: colors.primary,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: "transparent",
  },
  sortText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: colors.primary,
  },
});
