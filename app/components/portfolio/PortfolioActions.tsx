import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PortfolioActions({ mode, onSubmit, loading }: any) {
  const isView = mode === "view";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        style={[
          styles.button,
          isView ? styles.editButton : styles.submitButton,
          loading && { opacity: 0.7 },
        ]}
        activeOpacity={0.8}
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
        <Text style={styles.buttonText}>
          {mode === "view"
            ? "Edit Portfolio"
            : mode === "edit"
              ? "Update Portfolio"
              : "Publish Portfolio"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButton: {
    backgroundColor: "#4A6CF7",
  },
  editButton: {
    backgroundColor: "#1A1A1A",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
