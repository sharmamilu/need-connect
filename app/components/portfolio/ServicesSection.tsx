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
  services: string[];
  onChange: (services: string[]) => void;
  mode: "create" | "edit" | "view";
};

const ServiceItem = ({
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
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.serviceItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceIconContainer}>
          <Feather name="check" size={13} color={colors.primary} />
        </View>
        <Text style={styles.serviceText}>{item}</Text>
      </View>
      {editable && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeButton}
          activeOpacity={0.7}
          hitSlop={6}
        >
          <Feather name="trash-2" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default function ServicesSection({
  services = [],
  onChange,
  mode,
}: Props) {
  const [service, setService] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const editable = mode !== "view";

  const addService = () => {
    const v = service.trim();
    if (!v) return;
    if (services.some((s) => s.toLowerCase() === v.toLowerCase())) {
      setService("");
      return;
    }
    onChange([...services, v]);
    setService("");
  };

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index));
  };

  return (
    <SectionCard
      icon="briefcase"
      title="Services Offered"
      required
      count={services.length}
    >
      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={32} color={colors.gray} />
          <Text style={styles.emptyText}>No services added yet</Text>
          {editable && (
            <Text style={styles.emptyHint}>e.g. Wiring, Repairs, Install</Text>
          )}
        </View>
      ) : (
        <View style={styles.servicesList}>
          {services.map((item, index) => (
            <ServiceItem
              key={`${item}-${index}`}
              item={item}
              editable={editable}
              onRemove={() => removeService(index)}
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
              placeholder="Add a service"
              placeholderTextColor={colors.placeholder}
              value={service}
              onChangeText={setService}
              onSubmitEditing={addService}
              returnKeyType="done"
              style={styles.input}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
          </View>

          <TouchableOpacity
            onPress={addService}
            disabled={!service.trim()}
            style={[
              styles.addButton,
              !service.trim() && styles.addButtonDisabled,
            ]}
            activeOpacity={0.8}
          >
            <Feather
              name="plus"
              size={20}
              color={service.trim() ? "#fff" : colors.gray}
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
  servicesList: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.inputBg,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.sm,
  },
  serviceIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    fontWeight: "500",
  },
  removeButton: {
    padding: 6,
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
