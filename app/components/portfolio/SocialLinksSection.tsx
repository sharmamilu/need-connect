import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  links: {
    linkedin?: string;
    github?: string;
    website?: string;
    [key: string]: string | undefined;
  };
  onChange: (links: any) => void;
  mode: "create" | "edit" | "view";
};

const SOCIAL_ICONS: Record<string, any> = {
  linkedin: "linkedin",
  github: "github",
  website: "globe",
  twitter: "twitter",
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
};

export default function SocialLinksSection({
  links = {},
  onChange,
  mode,
}: Props) {
  const editable = mode !== "view";
  const [newPlatform, setNewPlatform] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleUpdate = (key: string, value: string) => {
    const updated = { ...links, [key.toLowerCase()]: value };
    onChange(updated);
  };

  const handleRemove = (key: string) => {
    const updated = { ...links };
    delete updated[key];
    onChange(updated);
  };

  const handleAddPlatform = () => {
    if (!newPlatform.trim()) return;
    const platform = newPlatform.trim().toLowerCase();
    if (links[platform] !== undefined) {
      Alert.alert("Already exists", "This platform is already in your list.");
      return;
    }
    handleUpdate(platform, "");
    setNewPlatform("");
    setShowAdd(false);
  };

  const allPlatforms = Object.keys(links);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="link" size={20} color="#4A6CF7" />
          <Text style={styles.title}>Public & Social Links</Text>
        </View>
        {editable && !showAdd && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAdd(true)}
          >
            <Feather name="plus" size={18} color="#4A6CF7" />
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {showAdd && (
        <View style={styles.addSection}>
          <TextInput
            style={styles.addInput}
            placeholder="Platform Name (e.g. Instagram)"
            value={newPlatform}
            onChangeText={setNewPlatform}
            autoFocus
          />
          <View style={styles.addActions}>
            <TouchableOpacity
              onPress={() => setShowAdd(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddPlatform}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {allPlatforms.length === 0 && !showAdd && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No links added yet.</Text>
        </View>
      )}

      {allPlatforms.map((platform) => (
        <View key={platform} style={styles.inputContainer}>
          <Feather
            name={SOCIAL_ICONS[platform] || "link"}
            size={18}
            color="#999"
            style={styles.icon}
          />
          <TextInput
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
            placeholderTextColor="#aaa"
            value={links[platform]}
            editable={editable}
            onChangeText={(val) => handleUpdate(platform, val)}
            style={[styles.input, !editable && styles.inputDisabled]}
          />
          {editable && (
            <TouchableOpacity
              onPress={() => handleRemove(platform)}
              style={styles.removeButton}
            >
              <Feather name="trash-2" size={16} color="#E53935" />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A6CF7",
  },
  addSection: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  addActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    padding: 6,
  },
  cancelText: {
    color: "#777",
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#4A6CF7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 14,
    zIndex: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f8f9fa",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#777",
    paddingRight: 10,
  },
  removeButton: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  emptyState: {
    padding: 10,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontStyle: "italic",
  },
});
