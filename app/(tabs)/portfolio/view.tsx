// app/(tabs)/portfolio/view.tsx
import { router } from "expo-router";
import { ScrollView } from "react-native";
import GallerySection from "../../components/portfolio/GallerySection";
import PortfolioActions from "../../components/portfolio/PortfolioActions";
import ProfileSection from "../../components/portfolio/ProfileSection";
import ServicesSection from "../../components/portfolio/ServicesSection";
import SkillsSection from "../../components/portfolio/SkillsSection";
import SocialLinksSection from "../../components/portfolio/SocialLinksSection";
import { usePortfolio } from "../../hooks/usePortfolio";

// mock data – later from API
const mockPortfolio = {
  name: "Milan Sharma",
  profession: "Electrician",
  bio: "Experienced electrician for home and office work.",
  services: ["Wiring", "Repair", "Installation"],
  skills: ["Safety", "Fast Service"],
  gallery: [],
  links: { linkedin: "https://linkedin.com" },
};

export default function ViewPortfolio() {
  const { portfolio } = usePortfolio(mockPortfolio);

  return (
    <ScrollView
      style={{ backgroundColor: "#F8F9FA" }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
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
  );
}
