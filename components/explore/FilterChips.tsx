import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const filters = ["All", "React", "Design", "Mobile", "Project Manager"];

export default function FilterChips({ selected, onSelect }: any) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {filters.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => onSelect(item)}
          style={[styles.chip, selected === item && styles.active]}
        >
          <Text style={[styles.text, selected === item && styles.activeText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#EDF1FF",
    borderRadius: 20,
    marginRight: 10,
  },
  active: {
    backgroundColor: "#4A6CF7",
  },
  text: {
    fontSize: 13,
    color: "#4A6CF7",
  },
  activeText: {
    color: "#fff",
  },
});
