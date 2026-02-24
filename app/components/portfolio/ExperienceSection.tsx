import { Feather } from "@expo/vector-icons";
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
  const handleChange = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    const updated = [...experiences];
    (updated[index] as any)[field] = value;
    setExperiences(updated);
  };

  const toggleCurrent = (index: number, value: boolean) => {
    const updated = [...experiences];
    updated[index].currentlyWorking = value;

    // Clear end date if currently working
    if (value) {
      updated[index].endDate = "";
    }

    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      },
    ]);
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
          <Feather name="inbox" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No experiences added yet</Text>
          {(mode === "edit" || mode === "create") && (
            <Text style={styles.emptyHint}>
              Add your first experience below
            </Text>
          )}
        </View>
      ) : (
        (experiences || []).map((exp, index) => (
          <View key={exp.id || index.toString()} style={styles.experienceItem}>
            {mode === "view" ? (
              <View>
                <Text style={styles.viewRole}>{exp.role}</Text>
                <Text style={styles.viewCompany}>{exp.company}</Text>
                <Text style={styles.viewDate}>
                  {exp.startDate} -{" "}
                  {exp.currentlyWorking ? "Present" : exp.endDate}
                </Text>
                {exp.description ? (
                  <Text style={styles.viewDescription}>{exp.description}</Text>
                ) : null}
              </View>
            ) : (
              <>
                <TextInput
                  placeholder="Role / Position"
                  style={styles.input}
                  value={exp.role}
                  onChangeText={(text) => handleChange(index, "role", text)}
                />

                <TextInput
                  placeholder="Company Name"
                  style={styles.input}
                  value={exp.company}
                  onChangeText={(text) => handleChange(index, "company", text)}
                />

                <TextInput
                  placeholder="Start Date (e.g. Jan 2022)"
                  style={styles.input}
                  value={exp.startDate}
                  onChangeText={(text) =>
                    handleChange(index, "startDate", text)
                  }
                />

                {!exp.currentlyWorking && (
                  <TextInput
                    placeholder="End Date"
                    style={styles.input}
                    value={exp.endDate}
                    onChangeText={(text) =>
                      handleChange(index, "endDate", text)
                    }
                  />
                )}

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Currently Working Here</Text>
                  <Switch
                    value={exp.currentlyWorking}
                    onValueChange={(value) => toggleCurrent(index, value)}
                  />
                </View>

                <TextInput
                  placeholder="Description"
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={4}
                  value={exp.description}
                  onChangeText={(text) =>
                    handleChange(index, "description", text)
                  }
                />

                {mode === "edit" || mode === "create" ? (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      const updated = experiences.filter((_, i) => i !== index);
                      setExperiences(updated);
                    }}
                  >
                    <Text style={styles.deleteButtonText}>Remove</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </View>
        ))
      )}

      {(mode === "edit" || mode === "create") && (
        <TouchableOpacity style={styles.addButton} onPress={addExperience}>
          <Text style={styles.addButtonText}>+ Add Experience</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ExperienceSection;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  errorText: {
    color: "#E53935",
    fontSize: 13,
    marginBottom: 12,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
  countBadge: {
    backgroundColor: "#4A6CF7",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4A6CF7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  countText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },
  emptyHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  experienceItem: {
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    marginTop: 8,
    backgroundColor: "#4A6CF7",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  deleteButtonText: {
    color: "#E53935",
    fontSize: 13,
    fontWeight: "600",
  },
  viewRole: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  viewCompany: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A6CF7",
    marginTop: 2,
  },
  viewDate: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
  },
  viewDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },
});
