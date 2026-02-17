import { Stack } from "expo-router";

export default function PortfolioLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="view" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit" />
    </Stack>
  );
}
