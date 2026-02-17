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

  // Simple entry animation when a service is added
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
          <Feather name="check-circle" size={14} color="#4A6CF7" />
        </View>
        <Text style={styles.serviceText}>{item}</Text>
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

export default function ServicesSection({
  services = [],
  onChange,
  mode,
}: Props) {
  const [service, setService] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const editable = mode !== "view";

  const addService = () => {
    if (!service.trim()) return;
    onChange([...services, service.trim()]);
    setService("");
  };

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="briefcase" size={20} color="#4A6CF7" />
          <Text style={styles.title}>Services Offered</Text>
        </View>

        {services.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{services.length}</Text>
          </View>
        )}
      </View>

      {services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No services added yet</Text>
          {editable && (
            <Text style={styles.emptyHint}>Add your first service below</Text>
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
                placeholder="Add a service"
                placeholderTextColor="#aaa"
                value={service}
                onChangeText={setService}
                onSubmitEditing={addService}
                returnKeyType="done"
                style={styles.input}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              {service.length > 0 && (
                <TouchableOpacity
                  onPress={() => setService("")}
                  style={styles.clearButton}
                >
                  <Feather name="x" size={16} color="#999" />
                </TouchableOpacity>
              )}
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
                size={18}
                color={service.trim() ? "#fff" : "#999"}
              />
            </TouchableOpacity>
          </View>

          {services.length > 0 && (
            <Text style={styles.hint}>
              <Feather name="info" size={12} color="#999" /> Tap trash to remove
            </Text>
          )}
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
  servicesList: {
    marginBottom: 16,
    gap: 8,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  serviceContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  serviceIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e8f0fe",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  removeButton: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 6,
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
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: "#4A6CF7",
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  hint: {
    fontSize: 11,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
