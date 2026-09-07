import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portfolio } from "@/types";
import { fetchPortfolios } from "@/utils/apiFunctions";

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags = [], setSelectedTags }: TagSelectorProps) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const res = await fetchPortfolios({ limit: 50 });
        const rawData: any = res.data;
        const portfolios: Portfolio[] = Array.isArray(rawData) ? rawData : (rawData?.data || rawData?.portfolios || []);
        const allSkills: string[] = portfolios.flatMap((p: any) => p.skills || []);
        const uniqueSkills: string[] = Array.from(new Set(allSkills));
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
      const filtered = allTags.filter((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, allTags]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
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
            {selectedTags.map((tag: string) => (
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
