import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/theme";

export default function PortfolioActions({ mode, onSubmit, loading }: any) {
  const isView = mode === "view";

  const label =
    mode === "view"
      ? "Edit Portfolio"
      : mode === "edit"
        ? "Save Changes"
        : "Publish Portfolio";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        style={[
          styles.button,
          isView ? styles.editButton : styles.submitButton,
          loading && styles.loadingButton,
        ]}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Feather
            name={isView ? "edit-2" : "check-circle"}
            size={18}
            color="#fff"
          />
        )}
        <Text style={styles.buttonText}>{loading ? "Saving..." : label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  editButton: {
    backgroundColor: colors.text,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
