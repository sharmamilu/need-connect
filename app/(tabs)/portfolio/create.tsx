import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import GallerySection from "../../components/portfolio/GallerySection";
import PortfolioActions from "../../components/portfolio/PortfolioActions";
import ProfileSection from "../../components/portfolio/ProfileSection";
import ServicesSection from "../../components/portfolio/ServicesSection";
import SkillsSection from "../../components/portfolio/SkillsSection";
import SocialLinksSection from "../../components/portfolio/SocialLinksSection";
import { usePortfolio } from "../../hooks/usePortfolio";
import {
  createPortfolio,
  updatePortfolio,
  uploadGalleryImages,
  uploadProfileImage,
} from "../../utils/apiFunctions";

export default function CreatePortfolio() {
  const { portfolio, setPortfolio, loading: fetchLoading } = usePortfolio();
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSubmit = async () => {
    if (saveLoading) return;
    setSaveLoading(true);

    try {
      let profilePhotoUrl = portfolio.profilePhoto as string;
      let galleryUrls = portfolio.gallery as string[];

      /* 1️⃣ Upload profile photo if local */
      if (
        portfolio.profilePhoto &&
        typeof portfolio.profilePhoto !== "string" &&
        portfolio.profilePhoto.uri
      ) {
        profilePhotoUrl = await uploadProfileImage(portfolio.profilePhoto);
      }

      /* 2️⃣ Upload new gallery images */
      const newImages = portfolio.gallery.filter(
        (img) => typeof img !== "string" && img.uri,
      );

      if (newImages.length > 0) {
        const uploadedUrls = await uploadGalleryImages(newImages);

        galleryUrls = [
          ...(portfolio.gallery.filter(
            (img) => typeof img === "string",
          ) as string[]),
          ...uploadedUrls,
        ];
      } else {
        galleryUrls = portfolio.gallery.filter(
          (img) => typeof img === "string",
        ) as string[];
      }

      /* 3️⃣ Build final payload */
      const payload = {
        ...portfolio,
        profilePhoto: profilePhotoUrl,
        gallery: galleryUrls,
      };

      /* 4️⃣ Call portfolio API */
      if (portfolio._id) {
        await updatePortfolio(payload);
      } else {
        await createPortfolio(payload);
      }

      Alert.alert("Success", "Portfolio created successfully 🎉", [
        { text: "OK", onPress: () => router.push("/portfolio/view") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Something went wrong while creating your portfolio.",
      );
    } finally {
      setSaveLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A6CF7" />
        <Text style={{ marginTop: 10, color: "#666" }}>Preparing...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection
          data={portfolio}
          onChange={setPortfolio}
          mode="create"
        />
        <ServicesSection
          services={portfolio.services}
          onChange={(services) => setPortfolio({ ...portfolio, services })}
          mode="create"
        />
        <SkillsSection
          skills={portfolio.skills}
          onChange={(skills) => setPortfolio({ ...portfolio, skills })}
          mode="create"
        />
        <GallerySection
          images={portfolio.gallery}
          onChange={(gallery) => setPortfolio({ ...portfolio, gallery })}
          mode="create"
        />
        <SocialLinksSection
          links={portfolio.links}
          onChange={(links) => setPortfolio({ ...portfolio, links })}
          mode="create"
        />
        <PortfolioActions
          mode={portfolio._id ? "edit" : "create"}
          onSubmit={handleSubmit}
          loading={saveLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
