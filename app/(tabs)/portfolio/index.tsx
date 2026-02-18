import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function PortfolioIndex() {
  const { portfolio, loading } = usePortfolio();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4A6CF7" />
      </View>
    );
  }

  const hasPortfolio = !!portfolio.name;

  return (
    <Redirect href={hasPortfolio ? "/portfolio/view" : "/portfolio/create"} />
  );
}
