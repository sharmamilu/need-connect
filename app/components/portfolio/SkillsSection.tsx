import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  skills: string[];
  onChange: (skills: string[]) => void;
  mode: "create" | "edit" | "view";
};

const SkillItem = ({
  item,
  onRemove,
  editable,
}: {
  item: string;
  onRemove: () => void;
  editable: boolean;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useState(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  });

  return (
    <Animated.View
      style={[
        styles.skillItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.skillContent}>
        <View style={styles.skillIconContainer}>
          <Feather name="zap" size={14} color="#FFD700" />
        </View>
        <Text style={styles.skillText}>{item}</Text>
      </View>
      {editable && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={16} color="#E53935" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default function SkillsSection({ skills = [], onChange, mode }: Props) {
  const [skill, setSkill] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const editable = mode !== "view";

  const addSkill = () => {
    if (!skill.trim()) return;
    onChange([...skills, skill.trim()]);
    setSkill("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="target" size={20} color="#4A6CF7" />
          <Text style={styles.title}>
            Key Skills <Text style={{ color: "#E53935" }}>*</Text>
          </Text>
        </View>

        {skills.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{skills.length}</Text>
          </View>
        )}
      </View>

      {skills.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="award" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No skills listed yet</Text>
          {editable && (
            <Text style={styles.emptyHint}>Showcase your expertise here</Text>
          )}
        </View>
      ) : (
        <View style={styles.skillsList}>
          {skills.map((item, index) => (
            <SkillItem
              key={`${item}-${index}`}
              item={item}
              editable={editable}
              onRemove={() => removeSkill(index)}
            />
          ))}
        </View>
      )}

      {editable && (
        <View style={styles.addSection}>
          <View style={styles.addContainer}>
            <View
              style={[
                styles.inputWrapper,
                inputFocused && styles.inputWrapperFocused,
              ]}
            >
              <Feather
                name="plus"
                size={18}
                color={inputFocused ? "#4A6CF7" : "#999"}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Add a skill"
                placeholderTextColor="#aaa"
                value={skill}
                onChangeText={setSkill}
                onSubmitEditing={addSkill}
                returnKeyType="done"
                style={styles.input}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </View>

            <TouchableOpacity
              onPress={addSkill}
              disabled={!skill.trim()}
              style={[
                styles.addButton,
                !skill.trim() && styles.addButtonDisabled,
              ]}
              activeOpacity={0.8}
            >
              <Feather
                name="plus"
                size={18}
                color={skill.trim() ? "#fff" : "#999"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
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
    elevation: 2,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
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
  skillsList: {
    marginBottom: 16,
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f4ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e8ff",
  },
  skillContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  skillIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  skillText: {
    fontSize: 13,
    color: "#303F9F",
    fontWeight: "600",
  },
  removeButton: {
    marginLeft: 8,
    padding: 2,
  },
  addSection: {
    marginTop: 8,
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
  },
  inputWrapperFocused: {
    borderColor: "#4A6CF7",
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4A6CF7",
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
});
