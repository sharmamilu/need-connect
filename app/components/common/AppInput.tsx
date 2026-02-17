import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../constants/colors";

export default function AppInput({ error, style, ...props }: any) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        {...props}
        style={[styles.input, error && styles.errorBorder, style]}
        placeholderTextColor={colors.gray}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
