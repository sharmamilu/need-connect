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
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/theme";
import SectionCard from "./SectionCard";

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
    onChange({ ...links, [key.toLowerCase()]: value });
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
    <SectionCard
      icon="link"
      title="Social Links"
      right={
        editable && !showAdd ? (
          <TouchableOpacity
            style={styles.addHeaderButton}
            onPress={() => setShowAdd(true)}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={16} color={colors.primary} />
            <Text style={styles.addHeaderText}>Add</Text>
          </TouchableOpacity>
        ) : undefined
      }
    >
      {showAdd && (
        <View style={styles.addSection}>
          <TextInput
            style={styles.addInput}
            placeholder="Platform name (e.g. Instagram)"
            placeholderTextColor={colors.placeholder}
            value={newPlatform}
            onChangeText={setNewPlatform}
            onSubmitEditing={handleAddPlatform}
            autoFocus
          />
          <View style={styles.addActions}>
            <TouchableOpacity
              onPress={() => {
                setShowAdd(false);
                setNewPlatform("");
              }}
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
          <Text style={styles.emptyText}>
            No links added{editable ? " — optional" : ""}.
          </Text>
        </View>
      )}

      {allPlatforms.map((platform) => (
        <View key={platform} style={styles.inputContainer}>
          <Feather
            name={SOCIAL_ICONS[platform] || "link"}
            size={18}
            color={colors.placeholder}
            style={styles.icon}
          />
          <TextInput
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
            placeholderTextColor={colors.placeholder}
            value={links[platform]}
            editable={editable}
            autoCapitalize="none"
            keyboardType="url"
            onChangeText={(val) => handleUpdate(platform, val)}
            style={[styles.input, !editable && styles.inputDisabled]}
          />
          {editable && (
            <TouchableOpacity
              onPress={() => handleRemove(platform)}
              style={styles.removeButton}
              hitSlop={6}
            >
              <Feather name="trash-2" size={16} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  addHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  addHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  addSection: {
    backgroundColor: colors.inputBg,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 11,
    backgroundColor: colors.card,
    fontSize: 14,
    color: colors.text,
  },
  addActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
    marginTop: spacing.md,
    alignItems: "center",
  },
  cancelButton: { padding: 6 },
  cancelText: { color: colors.textMuted, fontWeight: "600" },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  confirmText: { color: "#fff", fontWeight: "700" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 14,
    zIndex: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingLeft: 42,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.inputBg,
  },
  inputDisabled: {
    backgroundColor: colors.inputBg,
    color: colors.textMuted,
    paddingRight: 12,
  },
  removeButton: {
    position: "absolute",
    right: 12,
    padding: 6,
  },
  emptyState: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  emptyText: {
    color: colors.gray,
  },
});
