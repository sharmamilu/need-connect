import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { usePortfolio } from "../../hooks/usePortfolio";

export default function PortfolioIndex() {
  const { portfolio, loading } = usePortfolio();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const hasPortfolio = !!portfolio.name;

  return (
    <Redirect href={hasPortfolio ? "/portfolio/view" : "/portfolio/create"} />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
