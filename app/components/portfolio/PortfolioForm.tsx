import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../constants/colors";
import { spacing } from "../../constants/theme";
import { usePortfolio } from "../../hooks/usePortfolio";
import {
  createPortfolio,
  updatePortfolio,
  uploadGalleryImages,
  uploadProfileImage,
} from "../../utils/apiFunctions";
import {
  getPortfolioCompletion,
  validatePortfolio,
} from "../../utils/portfolioValidation";
import ExperienceSection from "./ExperienceSection";
import GallerySection from "./GallerySection";
import PortfolioActions from "./PortfolioActions";
import PortfolioProgress from "./PortfolioProgress";
import ProfileSection from "./ProfileSection";
import ServicesSection from "./ServicesSection";
import SkillsSection from "./SkillsSection";
import SocialLinksSection from "./SocialLinksSection";

type Props = {
  mode: "create" | "edit";
};

export default function PortfolioForm({ mode }: Props) {
  const {
    portfolio,
    setPortfolio,
    loading: fetchLoading,
    error,
  } = usePortfolio();
  const [saveLoading, setSaveLoading] = useState(false);
  const [experienceError, setExperienceError] = useState("");

  const completion = getPortfolioCompletion(portfolio);
  const isUpdate = !!portfolio._id;

  const handleSubmit = async () => {
    if (saveLoading) return;

    const result = validatePortfolio(portfolio);
    if (!result.valid) {
      if (result.experienceError) setExperienceError(result.experienceError);
      else if (result.message) Alert.alert("Almost there", result.message);
      return;
    }
    setExperienceError("");
    setSaveLoading(true);

    try {
      const currentGallery = portfolio.gallery || [];
      let profilePhotoUrl = portfolio.profilePhoto as string;
      let galleryUrls: string[] = [];

      // 1. Upload profile photo if it's a freshly-picked local file.
      if (
        portfolio.profilePhoto &&
        typeof portfolio.profilePhoto !== "string" &&
        (portfolio.profilePhoto as any).uri
      ) {
        const uploaded = await uploadProfileImage(portfolio.profilePhoto);
        if (uploaded) profilePhotoUrl = uploaded;
      }

      // 2. Upload any new gallery images, keep already-uploaded URLs.
      const newImages = currentGallery.filter(
        (img) => typeof img !== "string" && (img as any).uri,
      );
      const existingUrls = currentGallery.filter(
        (img) => typeof img === "string",
      ) as string[];

      if (newImages.length > 0) {
        const uploaded = await uploadGalleryImages(newImages);
        galleryUrls = [...existingUrls, ...(uploaded || [])];
      } else {
        galleryUrls = existingUrls;
      }

      // 3. Build payload.
      const payload = {
        ...portfolio,
        name: portfolio.name?.trim(),
        profession: portfolio.profession?.trim(),
        bio: portfolio.bio?.trim(),
        location: portfolio.location?.trim(),
        email: portfolio.email?.trim(),
        contact: {
          countryCode: portfolio.contact?.countryCode || "+1",
          phone: portfolio.contact?.phone?.trim() || "",
        },
        experience: portfolio.experience || [],
        links: portfolio.links || {},
        profilePhoto: profilePhotoUrl,
        gallery: galleryUrls,
      };

      // 4. Save.
      if (isUpdate) await updatePortfolio(payload);
      else await createPortfolio(payload);

      Alert.alert(
        "Success",
        isUpdate
          ? "Your portfolio has been updated 🎉"
          : "Your portfolio is live 🎉",
        [{ text: "View", onPress: () => router.replace("/portfolio/view") }],
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while saving your portfolio.";
      Alert.alert("Couldn't save", msg);
    } finally {
      setSaveLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centeredText}>
          {mode === "edit" ? "Loading your portfolio..." : "Preparing..."}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <PortfolioActions
          mode="create"
          onSubmit={() => router.replace("/portfolio/create")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <PortfolioProgress
            completed={completion.completed}
            total={completion.total}
            percent={completion.percent}
          />

          <ProfileSection data={portfolio} onChange={setPortfolio} mode={mode} />
          <ServicesSection
            services={portfolio.services}
            onChange={(services) => setPortfolio({ ...portfolio, services })}
            mode={mode}
          />
          <SkillsSection
            skills={portfolio.skills}
            onChange={(skills) => setPortfolio({ ...portfolio, skills })}
            mode={mode}
          />
          <ExperienceSection
            experiences={portfolio.experience || []}
            setExperiences={(experience: any[]) => {
              setExperienceError("");
              setPortfolio({ ...portfolio, experience });
            }}
            mode={mode}
            error={experienceError}
          />
          <GallerySection
            images={portfolio.gallery}
            onChange={(gallery) => setPortfolio({ ...portfolio, gallery })}
            mode={mode}
          />
          <SocialLinksSection
            links={portfolio.links}
            onChange={(links) => setPortfolio({ ...portfolio, links })}
            mode={mode}
          />
          <PortfolioActions
            mode={isUpdate ? "edit" : "create"}
            onSubmit={handleSubmit}
            loading={saveLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  centeredText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
