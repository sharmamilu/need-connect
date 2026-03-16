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

  const handleChange = (
    index: number,
    field: keyof Experience,
    value: string | boolean,
  ) => {
    const updated = [...experiences];
    (updated[index] as any)[field] = value;
    setExperiences(updated);
  };

  const toggleCurrent = (index: number, value: boolean) => {
    const updated = [...experiences];
    updated[index].currentlyWorking = value;
    if (value) {
      updated[index].endDate = "";
    }
    setExperiences(updated);
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
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
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    if (editingIndex === index) setEditingIndex(null);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="briefcase" size={20} color="#4A6CF7" />
          <Text style={styles.title}>Experience</Text>
        </View>

        {(experiences || []).length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{(experiences || []).length}</Text>
          </View>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!experiences || experiences.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIllustration}>
            <Feather name="briefcase" size={40} color="#E0E7FF" />
          </View>
          <Text style={styles.emptyText}>No experience added</Text>
          {(mode === "edit" || mode === "create") && (
            <Text style={styles.emptyHint}>
              Showcase your professional journey
            </Text>
          )}
        </View>
      ) : (
        (experiences || []).map((exp, index) => {
          const isEditing =
            editingIndex === index && (mode === "edit" || mode === "create");

          return (
            <View
              key={exp.id || index.toString()}
              style={[styles.experienceCard, isEditing && styles.activeCard]}
            >
              {/* Card Header/Summary */}
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderMain}>
                  <View style={styles.jobIcon}>
                    <Feather name="layers" size={16} color="#4A6CF7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roleTitle}>
                      {exp.role || "Role Name"}
                    </Text>
                    <Text style={styles.companySub}>
                      {exp.company || "Company"}
                    </Text>
                  </View>
                </View>

                {(mode === "edit" || mode === "create") && (
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      onPress={() => setEditingIndex(isEditing ? null : index)}
                      style={styles.actionBtn}
                    >
                      <Feather
                        name={isEditing ? "chevron-up" : "edit-2"}
                        size={16}
                        color="#666"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeExperience(index)}
                      style={[styles.actionBtn, styles.deleteBtn]}
                    >
                      <Feather name="trash-2" size={16} color="#FF4757" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* View Mode or Summary Mode */}
              {!isEditing && (
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryDate}>
                    {exp.startDate || "Date"} -{" "}
                    {exp.currentlyWorking ? "Present" : exp.endDate || "Date"}
                  </Text>
                  {exp.description ? (
                    <Text style={styles.summaryDesc} numberOfLines={1}>
                      {exp.description}
                    </Text>
                  ) : null}
                </View>
              )}

              {/* Edit Mode */}
              {isEditing && (
                <View style={styles.editInterface}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Role / Position</Text>
                    <TextInput
                      placeholder="e.g. Senior Designer"
                      style={styles.input}
                      value={exp.role}
                      onChangeText={(text) => handleChange(index, "role", text)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Company Name</Text>
                    <TextInput
                      placeholder="e.g. Acme Corp"
                      style={styles.input}
                      value={exp.company}
                      onChangeText={(text) =>
                        handleChange(index, "company", text)
                      }
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.label}>Start Date</Text>
                      <TextInput
                        placeholder="Jan 2022"
                        style={styles.input}
                        value={exp.startDate}
                        onChangeText={(text) =>
                          handleChange(index, "startDate", text)
                        }
                      />
                    </View>
                    {!exp.currentlyWorking && (
                      <View
                        style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}
                      >
                        <Text style={styles.label}>End Date</Text>
                        <TextInput
                          placeholder="Present"
                          style={styles.input}
                          value={exp.endDate}
                          onChangeText={(text) =>
                            handleChange(index, "endDate", text)
                          }
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      Currently working here
                    </Text>
                    <Switch
                      value={exp.currentlyWorking}
                      onValueChange={(value) => toggleCurrent(index, value)}
                      trackColor={{ false: "#E5E7EB", true: "#C7D2FE" }}
                      thumbColor={exp.currentlyWorking ? "#4A6CF7" : "#F3F4F6"}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      placeholder="What did you achieve?"
                      style={[styles.input, styles.textArea]}
                      multiline
                      numberOfLines={4}
                      value={exp.description}
                      onChangeText={(text) =>
                        handleChange(index, "description", text)
                      }
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => setEditingIndex(null)}
                  >
                    <Text style={styles.doneBtnText}>Save Entry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
      )}

      {(mode === "edit" || mode === "create") && (
        <TouchableOpacity style={styles.addButton} onPress={addExperience}>
          <Feather name="plus" size={18} color="#4A6CF7" />
          <Text style={styles.addButtonText}>Add New Experience</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ExperienceSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
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
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  countBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  countText: {
    color: "#4A6CF7",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    marginBottom: 16,
  },
  emptyIllustration: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },
  emptyHint: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  experienceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 12,
    overflow: "hidden",
  },
  activeCard: {
    borderColor: "#4A6CF7",
    borderWidth: 2,
    backgroundColor: "#F8FAFF",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  itemHeaderMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  jobIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  companySub: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 1,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "#FFF5F5",
  },
  summaryContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 64,
  },
  summaryDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  editInterface: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  doneBtn: {
    backgroundColor: "#4A6CF7",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#EEF2FF",
    marginTop: 8,
  },
  addButtonText: {
    color: "#4A6CF7",
    fontWeight: "700",
    fontSize: 14,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
});
