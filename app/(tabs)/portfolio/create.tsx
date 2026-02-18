import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import GallerySection from "../../components/portfolio/GallerySection";
import PortfolioActions from "../../components/portfolio/PortfolioActions";
import ProfileSection from "../../components/portfolio/ProfileSection";
import ServicesSection from "../../components/portfolio/ServicesSection";
import SkillsSection from "../../components/portfolio/SkillsSection";
import SocialLinksSection from "../../components/portfolio/SocialLinksSection";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function CreatePortfolio() {
  const { portfolio, setPortfolio } = usePortfolio();

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
          mode="create"
          onSubmit={() => console.log(portfolio)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
