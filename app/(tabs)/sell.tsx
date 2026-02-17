import { StyleSheet, Text, View } from "react-native";

export default function SellScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell Your Items 💰</Text>
      <Text style={styles.subtitle}>
        List your items and connect with buyers in your area.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
