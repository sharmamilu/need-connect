import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { radius, spacing } from "../../constants/theme";
import SectionCard from "./SectionCard";

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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
      <Text style={styles.skillText}>{item}</Text>
      {editable && (
        <TouchableOpacity onPress={onRemove} hitSlop={6} activeOpacity={0.7}>
          <Feather name="x" size={14} color={colors.primary} />
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
    const v = skill.trim();
    if (!v) return;
    if (skills.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setSkill("");
      return;
    }
    onChange([...skills, v]);
    setSkill("");
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <SectionCard
      icon="award"
      title="Key Skills"
      required
      count={skills.length}
    >
      {skills.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="zap" size={32} color={colors.gray} />
          <Text style={styles.emptyText}>No skills listed yet</Text>
          {editable && (
            <Text style={styles.emptyHint}>Showcase your expertise</Text>
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
              color={inputFocused ? colors.primary : colors.placeholder}
            />
            <TextInput
              placeholder="Add a skill"
              placeholderTextColor={colors.placeholder}
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
              size={20}
              color={skill.trim() ? "#fff" : colors.gray}
            />
          </TouchableOpacity>
        </View>
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontWeight: "600",
  },
  emptyHint: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  skillsList: {
    marginBottom: spacing.md,
    gap: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  skillText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: colors.border,
  },
});
