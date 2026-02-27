import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updatedText}>Last Updated: October 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using Need Connect, you agree to comply with and be
          bound by these Terms & Conditions. If you do not agree, please do not
          use our services.
        </Text>

        <Text style={styles.sectionTitle}>2. User Accounts</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your
          account credentials. All activities occurring under your account are
          your responsibility. We reserve the right to suspend or terminate
          accounts that violate our terms.
        </Text>

        <Text style={styles.sectionTitle}>3. Service Integrity</Text>
        <Text style={styles.paragraph}>
          Need Connect is a platform to facilitate peer-to-peer connections. The
          accuracy, quality, and delivery of services provided by users are
          strictly between the interacting parties. We are not liable for any
          disputes that may arise.
        </Text>

        <Text style={styles.sectionTitle}>4. User Conduct</Text>
        <Text style={styles.paragraph}>
          You agree not to post abusive, illegal, or discriminatory content. Any
          unauthorized use of our platform, including spam or malicious
          behavior, will result in immediate termination of the account and
          potential legal action.
        </Text>

        <Text style={styles.sectionTitle}>5. Modifications</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Continued use
          of the platform constitutes your acceptance of the revised terms.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  updatedText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 20,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 24,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
});
