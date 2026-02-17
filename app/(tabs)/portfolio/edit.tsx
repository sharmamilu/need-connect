// app/(tabs)/portfolio/edit.tsx
import { ScrollView } from "react-native";
import GallerySection from "../../components/portfolio/GallerySection";
import PortfolioActions from "../../components/portfolio/PortfolioActions";
import ProfileSection from "../../components/portfolio/ProfileSection";
import ServicesSection from "../../components/portfolio/ServicesSection";
import SkillsSection from "../../components/portfolio/SkillsSection";
import SocialLinksSection from "../../components/portfolio/SocialLinksSection";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function EditPortfolio() {
  const { portfolio, setPortfolio } = usePortfolio(/* fetch from API */);

  return (
    <ScrollView
      style={{ backgroundColor: "#F8F9FA" }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
    >
      <ProfileSection data={portfolio} onChange={setPortfolio} mode="edit" />
      <ServicesSection
        services={portfolio.services}
        onChange={(services) => setPortfolio({ ...portfolio, services })}
        mode="edit"
      />
      <SkillsSection
        skills={portfolio.skills}
        onChange={(skills) => setPortfolio({ ...portfolio, skills })}
        mode="edit"
      />
      <GallerySection
        images={portfolio.gallery}
        onChange={(gallery) => setPortfolio({ ...portfolio, gallery })}
        mode="edit"
      />
      <SocialLinksSection
        links={portfolio.links}
        onChange={(links) => setPortfolio({ ...portfolio, links })}
        mode="edit"
      />
      <PortfolioActions mode="edit" onSubmit={() => console.log(portfolio)} />
    </ScrollView>
  );
}
