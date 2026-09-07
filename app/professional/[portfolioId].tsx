import { Stack } from "expo-router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PortfolioDetail from "@/components/explore/PortfolioDetail";

export default function PortfolioDetailScreen() {
  return (
    <ProtectedRoute>
      <Stack.Screen options={{ headerShown: false }} />
      <PortfolioDetail />
    </ProtectedRoute>
  );
}
