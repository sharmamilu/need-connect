import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATES,
  TemplateDef,
} from "@/constants/templates";
import { radius, shadow, spacing } from "@/constants/theme";

const RECOMMENDED_IDS = ["invoice", "resume", "contract"];

export default function UtilitiesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const recommendedItems = useMemo(() => {
    return TEMPLATES.filter((t) => RECOMMENDED_IDS.includes(t.id));
  }, []);

  const categories = useMemo(() => {
    return ["All", ...TEMPLATE_CATEGORIES];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = TEMPLATES;

    if (selectedCategory !== "All") {
      items = items.filter((t) => t.category === selectedCategory);
    }

    if (!q) return items;
    return items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [query, selectedCategory]);

  const renderCard = (item: TemplateDef) => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/template/${item.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
          <Feather name={item.icon} size={18} color={item.color} />
        </View>
        <Feather name="arrow-up-right" size={16} color={colors.textMuted} style={styles.cardArrow} />
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={[styles.cardTag, { color: item.color, backgroundColor: item.bg }]}>
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Utilities</Text>
        <Text style={styles.headerSubtitle}>
          Professional templates & document generation tools
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={colors.placeholder} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents & tools..."
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
              <Feather name="x" size={18} color={colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        {/* QUICK ACTIONS ROW */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickCard, styles.quickTools]}
            activeOpacity={0.85}
            onPress={() => router.push("/quick-tools" as any)}
          >
            <View style={styles.quickIcon}>
              <Feather name="grid" size={18} color="#fff" />
            </View>
            <View>
              <Text style={styles.quickTitle}>Quick Tools</Text>
              <Text style={styles.quickDesc}>Calculators & converters</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCard, styles.quickDocs]}
            activeOpacity={0.85}
            onPress={() => router.push("/my-documents" as any)}
          >
            <View style={[styles.quickIcon, styles.quickIconDocs]}>
              <Feather name="folder" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.quickTitle, styles.quickTitleDocs]}>
                My Documents
              </Text>
              <Text style={[styles.quickDesc, styles.quickDescDocs]}>
                Access saved PDFs
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CATEGORY TABS SELECTOR */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.tabButton, isActive && styles.tabActive]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* RECOMMENDED SECTION (Only on search "All" with empty query) */}
        {selectedCategory === "All" && !query.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Templates</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedScroll}
            >
              {recommendedItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recommendedCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/template/${item.id}` as any)}
                >
                  <View style={styles.recommendedHeader}>
                    <View style={[styles.recIconBadge, { backgroundColor: item.bg }]}>
                      <Feather name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  </View>
                  <Text style={styles.recommendedTitle}>{item.title}</Text>
                  <Text style={styles.recommendedDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* TEMPLATE GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "All" ? "All Templates" : `${selectedCategory} Templates`}
          </Text>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="alert-circle" size={32} color={colors.textMuted} />
              <Text style={styles.emptyText}>No templates found matching your search</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filtered.map(renderCard)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: colors.text,
  },
  quickRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 10,
    borderWidth: 1.5,
    ...shadow.card,
  },
  quickTools: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickDocs: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconDocs: {
    backgroundColor: colors.primarySoft,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  quickTitleDocs: {
    color: colors.text,
  },
  quickDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: 1,
  },
  quickDescDocs: {
    color: colors.textMuted,
  },
  tabsContainer: {
    marginBottom: spacing.lg,
  },
  tabsScroll: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  tabTextActive: {
    color: "#fff",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  recommendedScroll: {
    gap: spacing.md,
    paddingRight: spacing.lg,
    paddingVertical: 4,
  },
  recommendedCard: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recIconBadge: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  popularBadge: {
    backgroundColor: colors.success + "15",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  popularText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.success,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  recommendedDesc: {
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  card: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cardArrow: {
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 15.5,
    marginBottom: 8,
  },
  cardFooter: {
    alignItems: "flex-start",
  },
  cardTag: {
    fontSize: 9.5,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    textTransform: "uppercase",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    gap: 8,
  },
  emptyText: {
    fontSize: 13.5,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
