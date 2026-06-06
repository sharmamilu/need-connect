import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchPortfolios } from "../../utils/apiFunctions";

export default function TagSelector({ selectedTags, setSelectedTags }) {
  const [allTags, setAllTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetchPortfolios({ limit: 50 });
        const portfolios = res.data.portfolios || res.data.data || [];
        const allSkills = portfolios.flatMap((p) => p.skills || []);
        const uniqueSkills = [...new Set(allSkills)];
        setAllTags(uniqueSkills);
        setFilteredTags(uniqueSkills.slice(0, 10));
      } catch (error) {
        console.error("Error loading tags:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTags(allTags.slice(0, 10));
    } else {
      const filtered = allTags.filter((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, allTags]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const newTag = searchQuery.trim().toLowerCase();
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
    }
    // Also add to allTags locally so it stays in the list during this session
    if (newTag && !allTags.includes(newTag)) {
      setAllTags([...allTags, newTag]);
    }
    setSearchQuery("");
  };

  const showAddCustomTag =
    searchQuery.trim().length > 0 &&
    !allTags.some(
      (tag) => tag.toLowerCase() === searchQuery.trim().toLowerCase(),
    );

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="#3b5bdb"
        style={{ marginVertical: 10 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags</Text>

      <View style={styles.searchBar}>
        <Feather
          name="search"
          size={16}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search tags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x-circle" size={16} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tagsWrapper}>
        {filteredTags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={`tag-${tag}`}
              style={[styles.tag, active && styles.activeTag]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagText, active && styles.activeTagText]}>
                #{tag}
              </Text>
            </TouchableOpacity>
          );
        })}
        {showAddCustomTag && (
          <TouchableOpacity
            style={[styles.tag, styles.customTagButton]}
            onPress={handleAddCustomTag}
          >
            <Feather
              name="plus"
              size={14}
              color="#3b5bdb"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.customTagText}>{"Add \"" + searchQuery.trim() + "\""}</Text>
          </TouchableOpacity>
        )}
        {filteredTags.length === 0 && !showAddCustomTag && (
          <Text style={styles.noTags}>No tags found</Text>
        )}
      </View>

      {selectedTags.length > 0 && (
        <View style={styles.selectedWrapper}>
          <Text style={styles.selectedLabel}>Selected:</Text>
          <View style={styles.tagsWrapper}>
            {selectedTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, styles.activeTag]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagText, styles.activeTagText]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  label: { fontWeight: "600", marginBottom: 8, color: "#333" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: "#333",
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeTag: {
    backgroundColor: "#3b5bdb",
    borderColor: "#3b5bdb",
  },
  tagText: {
    fontSize: 12,
    color: "#65676b",
  },
  activeTagText: {
    color: "#fff",
    fontWeight: "600",
  },
  customTagButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f0fe",
    borderColor: "#d2e3fc",
    borderStyle: "dashed",
  },
  customTagText: {
    color: "#3b5bdb",
    fontSize: 12,
    fontWeight: "600",
  },
  noTags: {
    color: "#999",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  selectedWrapper: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f2f5",
  },
  selectedLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
});
