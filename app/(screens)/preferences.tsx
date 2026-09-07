import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPreferences, updatePreferences } from "@/utils/apiFunctions";

type FeedPreferences = {
  feedType: "latest" | "recommended";
  locations: string[];
  skills: string[];
};

export default function PreferencesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  const [preferences, setPreferences] = useState<FeedPreferences>({
    feedType: "recommended",
    locations: [],
    skills: [],
  });

  const [locationInput, setLocationInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchPreferences();
        const saved = res.data?.data || res.data;
        if (saved && Object.keys(saved).length > 0) {
          setIsExisting(true);
          setPreferences({
            feedType: saved.feedType || "recommended",
            locations: saved.locations || [],
            skills: saved.skills || [],
          });
        }
      } catch (err) {
        console.error("Failed to load preferences", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePreferences(preferences);
      Alert.alert("Success", "Your feed preferences have been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const addLocation = () => {
    if (!locationInput.trim()) return;
    if (!preferences.locations.includes(locationInput.trim())) {
      setPreferences((prev) => ({
        ...prev,
        locations: [...prev.locations, locationInput.trim()],
      }));
    }
    setLocationInput("");
  };

  const removeLocation = (index: number) => {
    setPreferences((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (!preferences.skills.includes(skillInput.trim())) {
      setPreferences((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
    }
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setPreferences((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6CF7" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feed Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.description}>
            Customize what you see on your explore feed. Set your preferred
            skills, locations, and match types to get better recommendations.
          </Text>

          {/* Feed Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feed Sort Order</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioItem,
                  preferences.feedType === "recommended" &&
                    styles.radioItemSelected,
                ]}
                onPress={() =>
                  setPreferences({ ...preferences, feedType: "recommended" })
                }
              >
                <Feather
                  name="star"
                  size={16}
                  color={
                    preferences.feedType === "recommended" ? "#4A6CF7" : "#666"
                  }
                />
                <Text
                  style={[
                    styles.radioText,
                    preferences.feedType === "recommended" &&
                      styles.radioTextSelected,
                  ]}
                >
                  Recommended Matches
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioItem,
                  preferences.feedType === "latest" && styles.radioItemSelected,
                ]}
                onPress={() =>
                  setPreferences({ ...preferences, feedType: "latest" })
                }
              >
                <Feather
                  name="clock"
                  size={16}
                  color={preferences.feedType === "latest" ? "#4A6CF7" : "#666"}
                />
                <Text
                  style={[
                    styles.radioText,
                    preferences.feedType === "latest" &&
                      styles.radioTextSelected,
                  ]}
                >
                  Latest Profiles
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Desired Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills I&apos;m looking for</Text>
            <Text style={styles.sectionSub}>
              e.g., Python, Graphic Design, Legal Advice
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter a skill..."
                value={skillInput}
                onChangeText={setSkillInput}
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity style={styles.addButton} onPress={addSkill}>
                <Feather name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {preferences.skills.map((skill, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(index)}>
                    <Feather
                      name="x"
                      size={14}
                      color="#4A6CF7"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Desired Locations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Locations</Text>
            <Text style={styles.sectionSub}>
              Filter portfolios by city or country
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter a location..."
                value={locationInput}
                onChangeText={setLocationInput}
                onSubmitEditing={addLocation}
              />
              <TouchableOpacity style={styles.addButton} onPress={addLocation}>
                <Feather name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {preferences.locations.map((loc, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{loc}</Text>
                  <TouchableOpacity onPress={() => removeLocation(index)}>
                    <Feather
                      name="x"
                      size={14}
                      color="#4A6CF7"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>
              {isExisting ? "Update Preferences" : "Save Preferences"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  radioGroup: {
    marginTop: 8,
    gap: 12,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 10,
  },
  radioItemSelected: {
    borderColor: "#4A6CF7",
    backgroundColor: "#F0F4FF",
  },
  radioText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  radioTextSelected: {
    color: "#4A6CF7",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4A6CF7",
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    borderWidth: 1,
    borderColor: "#D6E4FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    color: "#4A6CF7",
    fontWeight: "600",
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  saveBtn: {
    backgroundColor: "#4A6CF7",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
