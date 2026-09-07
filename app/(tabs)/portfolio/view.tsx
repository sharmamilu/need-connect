import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import GallerySection from "@/components/portfolio/GallerySection";
import PortfolioActions from "@/components/portfolio/PortfolioActions";
import ProfileSection from "@/components/portfolio/ProfileSection";
import ServicesSection from "@/components/portfolio/ServicesSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import SocialLinksSection from "@/components/portfolio/SocialLinksSection";
import { colors } from "@/constants/colors";
import { radius, shadow, spacing } from "@/constants/theme";
import { usePortfolio } from "@/hooks/usePortfolio";

export default function ViewPortfolio() {
  const { portfolio, loading, error } = usePortfolio();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centeredText}>Loading portfolio...</Text>
      </View>
    );
  }

  // Error or empty → prompt to create.
  if (error || (!portfolio.name && !loading)) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Feather name="user-plus" size={30} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>
            {error ? "Couldn't load portfolio" : "No portfolio yet"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {error ||
              "Create a portfolio to showcase your skills and get discovered by clients."}
          </Text>
          <View style={styles.emptyCta}>
            <PortfolioActions
              mode="create"
              onSubmit={() => router.replace("/portfolio/create")}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      const shareUrl = `https://needconnect.in/professional/${(portfolio as any)._id}`;
      await Share.share({
        message: `Check out my professional portfolio on Need Connect!\n\n${shareUrl}`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Portfolio</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerButton}
            activeOpacity={0.8}
          >
            <Feather name="share-2" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/portfolio/edit")}
            style={[styles.headerButton, styles.editButton]}
            activeOpacity={0.8}
          >
            <Feather name="edit-2" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProfileSection data={portfolio} onChange={() => {}} mode="view" />
        <ServicesSection
          services={portfolio.services}
          onChange={() => {}}
          mode="view"
        />
        <SkillsSection skills={portfolio.skills} onChange={() => {}} mode="view" />
        <ExperienceSection
          experiences={portfolio.experience || []}
          setExperiences={() => {}}
          mode="view"
        />
        <GallerySection
          images={portfolio.gallery}
          onChange={() => {}}
          mode="view"
        />
        <SocialLinksSection
          links={portfolio.links}
          onChange={() => {}}
          mode="view"
        />

        <PortfolioActions
          mode="view"
          onSubmit={() => router.push("/portfolio/edit")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  centeredText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xxl,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 21,
  },
  emptyCta: {
    alignSelf: "stretch",
    marginTop: spacing.xl,
  },
});
