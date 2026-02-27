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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updatedText}>Last Updated: October 2026</Text>

        <Text style={styles.sectionTitle}>1. Data Collection</Text>
        <Text style={styles.paragraph}>
          We collect personal information directly provided by you, such as your
          full name, date of birth, contact number, and email. This is strictly
          required to verify your identity and foster a safe community
          environment within Need Connect.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of Information</Text>
        <Text style={styles.paragraph}>
          Your data is used specifically to facilitate matches, personalize your
          feed based on your interests and location, and enhance the security of
          the application. Contact details are never sold to external third
          parties.
        </Text>

        <Text style={styles.sectionTitle}>3. Location Data</Text>
        <Text style={styles.paragraph}>
          When opting into our location services, we map your geographic region
          to connect you accurately with peers in your desired radius. Location
          data is stored securely and can be opted out of from your device
          settings at any time.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We deploy industry-standard encryption protocols (including HTTPS/SSL)
          for the secure transmission of all sensitive user payloads.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          At any point, you can access, update, or permanently delete your
          account directly through the Need Connect dashboard, removing all
          associated data from our operational servers.
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
