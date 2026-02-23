// app/(tabs)/portfolio/view.tsx
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExperienceSection from "../../components/portfolio/ExperienceSection";
import GallerySection from "../../components/portfolio/GallerySection";
import PortfolioActions from "../../components/portfolio/PortfolioActions";
import ProfileSection from "../../components/portfolio/ProfileSection";
import ServicesSection from "../../components/portfolio/ServicesSection";
import SkillsSection from "../../components/portfolio/SkillsSection";
import SocialLinksSection from "../../components/portfolio/SocialLinksSection";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function ViewPortfolio() {
  const { portfolio, loading, error } = usePortfolio();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A6CF7" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading Portfolio...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#E53935", textAlign: "center" }}>
          {error}
        </Text>
        <PortfolioActions
          mode="create"
          onSubmit={() => router.push("/portfolio/create")}
        />
      </View>
    );
  }

  // If loading is done and there's no name, it's likely empty
  if (!portfolio.name && !loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
          No Portfolio Found
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#666",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          You haven't created a portfolio yet. Let's build one to showcase your
          skills!
        </Text>
        <PortfolioActions
          mode="create"
          onSubmit={() => router.push("/portfolio/create")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 18, paddingBottom: 10 }}
      >
        <ProfileSection data={portfolio} onChange={() => {}} mode="view" />
        <ServicesSection
          services={portfolio.services}
          onChange={() => {}}
          mode="view"
        />
        <SkillsSection
          skills={portfolio.skills}
          onChange={() => {}}
          mode="view"
        />
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
