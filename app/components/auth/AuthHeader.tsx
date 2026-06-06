import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export default function AuthHeader({ title, subtitle }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 22, alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14.5,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
  },
});
