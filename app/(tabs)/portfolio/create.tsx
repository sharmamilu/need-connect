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
import { SafeAreaView } from "react-native-safe-area-context";
import ExperienceSection from "../../components/portfolio/ExperienceSection";
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
  const [experienceError, setExperienceError] = useState("");

  const validate = (): boolean => {
    if (!portfolio.name?.trim()) {
      Alert.alert("Required Field", "Please enter your full name.");
      return false;
    }
    if (!portfolio.location?.trim()) {
      Alert.alert("Required Field", "Please enter your location.");
      return false;
    }
    if (!portfolio.profession?.trim()) {
      Alert.alert("Required Field", "Please enter your profession.");
      return false;
    }
    if (!portfolio.bio?.trim()) {
      Alert.alert("Required Field", "Please add a professional bio.");
      return false;
    }
    if (!portfolio.contact?.phone?.trim()) {
      Alert.alert("Required Field", "Please provide a contact phone number.");
      return false;
    }
    if (
      portfolio.email?.trim() &&
      !/^\S+@\S+\.\S+$/.test(portfolio.email.trim())
    ) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (!portfolio.services || portfolio.services.length < 1) {
      Alert.alert("Required Field", "Please add at least 1 service you offer.");
      return false;
    }
    if (!portfolio.skills || portfolio.skills.length < 1) {
      Alert.alert("Required Field", "Please add at least 1 skill.");
      return false;
    }
    setExperienceError("");
    if (!portfolio.experience || portfolio.experience.length < 1) {
      setExperienceError("Please add your experience details.");
      return false;
    }

    const hasInvalidExp = portfolio.experience.some(
      (exp: any) =>
        !exp.role?.trim() ||
        !exp.company?.trim() ||
        !exp.startDate?.trim() ||
        (!exp.currentlyWorking && !exp.endDate?.trim()),
    );

    if (hasInvalidExp) {
      setExperienceError(
        "Please fill out completely your experience details (Role, Company, Dates) or remove empty ones.",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (saveLoading) return;
    if (!validate()) return;

    setSaveLoading(true);

    try {
      const currentGallery = portfolio.gallery || [];
      let profilePhotoUrl = portfolio.profilePhoto as string;
      let galleryUrls: string[] = [];

      /* 1️⃣ Upload profile photo if local */
      if (
        portfolio.profilePhoto &&
        typeof portfolio.profilePhoto !== "string" &&
        (portfolio.profilePhoto as any).uri
      ) {
        const uploadedProfileUrl = await uploadProfileImage(
          portfolio.profilePhoto,
        );
        if (uploadedProfileUrl) {
          profilePhotoUrl = uploadedProfileUrl;
        }
      }

      /* 2️⃣ Upload new gallery images */
      const newImages = currentGallery.filter(
        (img) => typeof img !== "string" && (img as any).uri,
      );

      const existingUrls = currentGallery.filter(
        (img) => typeof img === "string",
      ) as string[];

      if (newImages.length > 0) {
        const uploadedUrls = await uploadGalleryImages(newImages);
        galleryUrls = [...existingUrls, ...(uploadedUrls || [])];
      } else {
        galleryUrls = existingUrls;
      }

      /* 3️⃣ Build final payload */
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 10 }}
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
          <ExperienceSection
            experiences={portfolio.experience || []}
            setExperiences={(experience: any[]) => {
              setExperienceError("");
              setPortfolio({ ...portfolio, experience });
            }}
            mode="create"
            error={experienceError}
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
    </SafeAreaView>
  );
}
