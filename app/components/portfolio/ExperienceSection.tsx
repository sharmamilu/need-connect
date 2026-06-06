import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";
import SectionCard from "./SectionCard";

interface Experience {
  id?: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorking: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
  mode?: "edit" | "create" | "view";
  error?: string | null;
}

const ExperienceSection = ({
  experiences = [],
  setExperiences,
  mode = "edit",
  error,
}: ExperienceSectionProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const editable = mode === "edit" || mode === "create";

  const handleChange = (
    index: number,
    field: keyof Experience,
    value: string | boolean,
  ) => {
    setLocalError(null); // Clear errors on change
    const updated = [...experiences];
    (updated[index] as any)[field] = value;
    setExperiences(updated);
  };

  const toggleCurrent = (index: number, value: boolean) => {
    setLocalError(null);
    const updated = [...experiences];
    updated[index].currentlyWorking = value;
    if (value) updated[index].endDate = "";
    setExperiences(updated);
  };

  const handleSaveEntry = (index: number) => {
    const exp = experiences[index];
    if (!exp.role?.trim()) {
      setLocalError("Please enter the Role / Position.");
      return;
    }
    if (!exp.company?.trim()) {
      setLocalError("Please enter the Company Name.");
      return;
    }
    if (!exp.startDate?.trim()) {
      setLocalError("Please enter the Start Date (e.g. Jan 2022).");
      return;
    }
    if (!exp.currentlyWorking && !exp.endDate?.trim()) {
      setLocalError("Please enter the End Date or check 'I currently work here'.");
      return;
    }
    setLocalError(null);
    setEditingIndex(null);
  };

  const addExperience = () => {
    setLocalError(null);
    const newExp: Experience = {
      id: `${experiences.length}-${Math.random().toString(36).slice(2)}`,
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      currentlyWorking: false,
    };
    setExperiences([...experiences, newExp]);
    setEditingIndex(experiences.length);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setLocalError(null);
    }
  };

  return (
    <SectionCard
      icon="briefcase"
      title="Experience"
      count={experiences.length}
    >
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {experiences.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="briefcase" size={32} color={colors.gray} />
          <Text style={styles.emptyText}>No experience added</Text>
          {editable && (
            <Text style={styles.emptyHint}>
              Optional, but it builds trust
            </Text>
          )}
        </View>
      ) : (
        experiences.map((exp, index) => {
          const isEditing = editingIndex === index && editable;
          return (
            <View
              key={exp.id || index.toString()}
              style={[styles.experienceCard, isEditing && styles.activeCard]}
            >
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderMain}>
                  <View style={styles.jobIcon}>
                    <Feather name="layers" size={16} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roleTitle} numberOfLines={1}>
                      {exp.role || "Role name"}
                    </Text>
                    <Text style={styles.companySub} numberOfLines={1}>
                      {exp.company || "Company"}
                    </Text>
                  </View>
                </View>

                {editable && (
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setLocalError(null);
                        setEditingIndex(isEditing ? null : index);
                      }}
                      style={styles.actionBtn}
                    >
                      <Feather
                        name={isEditing ? "chevron-up" : "edit-2"}
                        size={16}
                        color={colors.textMuted}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeExperience(index)}
                      style={[styles.actionBtn, styles.deleteBtn]}
                    >
                      <Feather name="trash-2" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {!isEditing && (
                <View style={styles.summaryContent}>
                  {(!exp.role?.trim() || !exp.company?.trim() || !exp.startDate?.trim() || (!exp.currentlyWorking && !exp.endDate?.trim())) ? (
                    <Text style={styles.incompleteWarning}>
                      ⚠️ Incomplete entry. Tap edit to fill in details.
                    </Text>
                  ) : (
                    <Text style={styles.summaryDate}>
                      {exp.startDate} — {exp.currentlyWorking ? "Present" : exp.endDate}
                    </Text>
                  )}
                  {exp.description ? (
                    <Text style={styles.summaryDesc} numberOfLines={2}>
                      {exp.description}
                    </Text>
                  ) : null}
                </View>
              )}

              {isEditing && (
                <View style={styles.editInterface}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Role / Position</Text>
                    <TextInput
                      placeholder="e.g. Senior Designer"
                      placeholderTextColor={colors.placeholder}
                      style={styles.input}
                      value={exp.role}
                      onChangeText={(t) => handleChange(index, "role", t)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput
                      placeholder="e.g. Acme Corp"
                      placeholderTextColor={colors.placeholder}
                      style={styles.input}
                      value={exp.company}
                      onChangeText={(t) => handleChange(index, "company", t)}
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Start Date</Text>
                      <TextInput
                        placeholder="Jan 2022"
                        placeholderTextColor={colors.placeholder}
                        style={styles.input}
                        value={exp.startDate}
                        onChangeText={(t) =>
                          handleChange(index, "startDate", t)
                        }
                      />
                    </View>
                    {!exp.currentlyWorking && (
                      <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.md }]}>
                        <Text style={styles.label}>End Date</Text>
                        <TextInput
                          placeholder="Dec 2023"
                          placeholderTextColor={colors.placeholder}
                          style={styles.input}
                          value={exp.endDate}
                          onChangeText={(t) =>
                            handleChange(index, "endDate", t)
                          }
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      I currently work here
                    </Text>
                    <Switch
                      value={exp.currentlyWorking}
                      onValueChange={(v) => toggleCurrent(index, v)}
                      trackColor={{ false: "#E5E7EB", true: colors.primarySoft }}
                      thumbColor={
                        exp.currentlyWorking ? colors.primary : "#F3F4F6"
                      }
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      placeholder="What did you achieve?"
                      placeholderTextColor={colors.placeholder}
                      style={[styles.input, styles.textArea]}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={exp.description}
                      onChangeText={(t) =>
                        handleChange(index, "description", t)
                      }
                    />
                  </View>

                  {localError && (
                    <Text style={styles.cardErrorText}>{localError}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => handleSaveEntry(index)}
                  >
                    <Feather name="check" size={16} color="#fff" />
                    <Text style={styles.doneBtnText}>Save Entry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
      )}

      {editable && (
        <TouchableOpacity style={styles.addButton} onPress={addExperience}>
          <Feather name="plus" size={18} color={colors.primary} />
          <Text style={styles.addButtonText}>Add Experience</Text>
        </TouchableOpacity>
      )}
    </SectionCard>
  );
};

export default ExperienceSection;

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  emptyHint: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  experienceCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  activeCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: colors.primarySoft,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    justifyContent: "space-between",
  },
  itemHeaderMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  jobIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  companySub: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
    marginTop: 1,
  },
  itemActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: colors.errorSoft,
  },
  summaryContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingLeft: 64,
  },
  summaryDate: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  editInterface: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    fontSize: 14,
    color: colors.text,
  },
  row: {
    flexDirection: "row",
  },
  textArea: {
    height: 96,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary,
    padding: 13,
    borderRadius: radius.md,
  },
  doneBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
    borderStyle: "dashed",
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  cardErrorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  incompleteWarning: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
});
