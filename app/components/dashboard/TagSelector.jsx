import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MOCK_TAGS } from "../../data/mockTags";

export default function TagSelector({ selectedTags, setSelectedTags }) {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags</Text>

      <View style={styles.tagsWrapper}>
        {MOCK_TAGS.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.activeTag]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagText, active && styles.activeTagText]}>
                #{tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  label: { fontWeight: "600", marginBottom: 8 },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eef1f4",
    borderRadius: 20,
  },
  activeTag: {
    backgroundColor: "#3b5bdb",
  },
  tagText: {
    fontSize: 12,
  },
  activeTagText: {
    color: "#fff",
  },
});
