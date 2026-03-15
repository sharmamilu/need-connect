import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfessionalCard from "../components/explore/ProfessionalCard";
import { fetchPortfolios, fetchSuggestions } from "../utils/apiFunctions";

export default function ExploreScreen() {
  const [skillQuery, setSkillQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [activeInput, setActiveInput] = useState<"skill" | "location" | null>(
    null,
  );
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  const [professionals, setProfessionals] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skillDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch professionals from API
  const loadProfessionals = useCallback(
    async (
      pageNum: number,
      skill: string,
      location: string,
      replace: boolean,
    ) => {
      try {
        if (replace) {
          if (!refreshing) setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const params: any = { page: pageNum, limit: 10 };
        if (skill) params.skill = skill;
        if (location) params.location = location;

        const res = await fetchPortfolios(params);
        const { data, pagination } = res.data;

        setProfessionals((prev) => (replace ? data : [...prev, ...data]));
        setTotalPages(pagination.pages);
        setPage(pageNum);
      } catch (err: any) {
        setError("Failed to load professionals. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const isFirstRender = useRef(true);

  // Search trigger (handles initial load and search)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadProfessionals(1, skillQuery, locationQuery, true);
      return;
    }

    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      loadProfessionals(1, skillQuery, locationQuery, true);
    }, 500);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [skillQuery, locationQuery, loadProfessionals]);

  // Fetch skill suggestions
  const handleSkillChange = (text: string) => {
    setSkillQuery(text);
    setActiveInput("skill");
    if (skillDebounce.current) clearTimeout(skillDebounce.current);
    if (!text) {
      setSkillSuggestions([]);
      return;
    }
    skillDebounce.current = setTimeout(async () => {
      try {
        const res = await fetchSuggestions("skill", text);
        setSkillSuggestions(res.data.suggestions || []);
      } catch {
        setSkillSuggestions([]);
      }
    }, 300);
  };

  // Fetch location suggestions
  const handleLocationChange = (text: string) => {
    setLocationQuery(text);
    setActiveInput("location");
    if (locationDebounce.current) clearTimeout(locationDebounce.current);
    if (!text) {
      setLocationSuggestions([]);
      return;
    }
    locationDebounce.current = setTimeout(async () => {
      try {
        const res = await fetchSuggestions("location", text);
        setLocationSuggestions(res.data.suggestions || []);
      } catch {
        setLocationSuggestions([]);
      }
    }, 300);
  };

  const handleSelectSuggestion = (
    type: "skill" | "location",
    value: string,
  ) => {
    if (type === "skill") {
      setSkillQuery(value);
      setSkillSuggestions([]);
    } else {
      setLocationQuery(value);
      setLocationSuggestions([]);
    }
    setActiveInput(null);
    Keyboard.dismiss();
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      loadProfessionals(page + 1, skillQuery, locationQuery, false);
    }
  };

  const dismissSuggestions = () => {
    setActiveInput(null);
    setSkillSuggestions([]);
    setLocationSuggestions([]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfessionals(1, skillQuery, locationQuery, true);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissSuggestions}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          {/* Search Section */}
          <View style={styles.searchSection}>
            {/* Skill Search */}
            <View
              style={[
                styles.inputWrapper,
                { zIndex: activeInput === "skill" ? 10 : 1 },
              ]}
            >
              <View style={styles.searchBar}>
                <Feather name="search" size={18} color="#7C7C7C" />
                <TextInput
                  placeholder="Search skills or profession"
                  value={skillQuery}
                  onChangeText={handleSkillChange}
                  onFocus={() => setActiveInput("skill")}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
                {skillQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSkillQuery("");
                      setSkillSuggestions([]);
                    }}
                  >
                    <Feather name="x" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              {skillSuggestions.length > 0 && activeInput === "skill" && (
                <View style={styles.suggestionsContainer}>
                  {skillSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestionItem,
                        index === skillSuggestions.length - 1 && {
                          borderBottomWidth: 0,
                        },
                      ]}
                      onPress={() => handleSelectSuggestion("skill", item)}
                    >
                      <Feather
                        name="search"
                        size={14}
                        color="#999"
                        style={styles.suggestionIcon}
                      />
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Location Search */}
            <View
              style={[
                styles.inputWrapper,
                { zIndex: activeInput === "location" ? 10 : 1 },
              ]}
            >
              <View style={styles.searchBar}>
                <Feather name="map-pin" size={18} color="#7C7C7C" />
                <TextInput
                  placeholder="Search location"
                  value={locationQuery}
                  onChangeText={handleLocationChange}
                  onFocus={() => setActiveInput("location")}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
                {locationQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setLocationQuery("");
                      setLocationSuggestions([]);
                    }}
                  >
                    <Feather name="x" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              {locationSuggestions.length > 0 && activeInput === "location" && (
                <View style={styles.suggestionsContainer}>
                  {locationSuggestions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.suggestionItem,
                        index === locationSuggestions.length - 1 && {
                          borderBottomWidth: 0,
                        },
                      ]}
                      onPress={() => handleSelectSuggestion("location", item)}
                    >
                      <Feather
                        name="map-pin"
                        size={14}
                        color="#999"
                        style={styles.suggestionIcon}
                      />
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {loading && !refreshing ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#4A6CF7" />
              <Text style={styles.loadingText}>Finding professionals...</Text>
            </View>
          ) : (
            <FlatList
              data={professionals}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <ProfessionalCard data={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                professionals.length === 0 && { flex: 1 },
              ]}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              ListEmptyComponent={
                error ? (
                  <View style={styles.centered}>
                    <Feather name="alert-circle" size={40} color="#FF4757" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={onRefresh}
                    >
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.centered}>
                    <Feather name="users" size={40} color="#ccc" />
                    <Text style={styles.emptyText}>No professionals found</Text>
                    <Text style={styles.emptySubText}>
                      Try adjusting your search filters
                    </Text>
                  </View>
                )
              }
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator
                    size="small"
                    color="#4A6CF7"
                    style={styles.loadMoreSpinner}
                  />
                ) : null
              }
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  searchSection: {
    gap: 12,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
    marginBottom: 20,
    zIndex: 100,
  },
  inputWrapper: {
    position: "relative",
    zIndex: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "500",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 8,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#F1F3F6",
    zIndex: 9999,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7FA",
  },
  suggestionIcon: {
    marginRight: 14,
  },
  suggestionText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "400",
  },
  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
  },
  errorText: {
    fontSize: 15,
    color: "#FF4757",
    textAlign: "center",
    marginTop: 8,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#4A6CF7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#444",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
  },
  loadMoreSpinner: {
    paddingVertical: 16,
  },
});
