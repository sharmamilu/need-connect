import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";

type ActionItem = {
  key: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bg: string;
  route: string;
};

const ACTIONS: ActionItem[] = [
  {
    key: "invoice",
    title: "Invoice Builder",
    subtitle: "Bill clients easily",
    icon: "file-text",
    color: "#4A6CF7",
    bg: "#EEF2FF",
    route: "/template/invoice",
  },
  {
    key: "resume",
    title: "Resume Creator",
    subtitle: "Land your next gig",
    icon: "user",
    color: "#0284C7",
    bg: "#E0F2FE",
    route: "/template/resume",
  },
  {
    key: "contract",
    title: "Service Contract",
    subtitle: "Secure agreements",
    icon: "check-square",
    color: "#EA580C",
    bg: "#FFEDD5",
    route: "/template/contract",
  },
  {
    key: "gst",
    title: "GST Calculator",
    subtitle: "Calculate taxes",
    icon: "percent",
    color: "#16A34A",
    bg: "#DCFCE7",
    route: "/quick-tools",
  },
  {
    key: "docs",
    title: "My Documents",
    subtitle: "Access saved PDFs",
    icon: "folder",
    color: "#0891B2",
    bg: "#CFFAFE",
    route: "/my-documents",
  },
];

type Props = {
  onHide?: () => void;
};

export default function QuickActionsStrip({ onHide }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Featured Tools</Text>
        {onHide && (
          <TouchableOpacity
            style={styles.hideButton}
            onPress={onHide}
            activeOpacity={0.7}
          >
            <Feather name="eye-off" size={12} color={colors.textMuted} />
            <Text style={styles.hideText}>Hide</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ACTIONS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.card, { borderColor: item.color + "1A" }]}
            activeOpacity={0.85}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconBadge, { backgroundColor: item.bg }]}>
              <Feather name={item.icon} size={18} color={item.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            <Feather
              name="chevron-right"
              size={14}
              color={colors.textMuted}
              style={styles.arrow}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  hideButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hideText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 170,
    ...shadow.card,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 4,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    opacity: 0.6,
  },
});
