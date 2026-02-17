import { StyleSheet, Text, View } from "react-native";

export default function AuthHeader({ title, subtitle }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 6 },
});
