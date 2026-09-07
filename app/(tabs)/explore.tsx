import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfessionalCard from "@/components/explore/ProfessionalCard";
import { fetchPortfolios, fetchSuggestions } from "@/utils/apiFunctions";
import { colors } from "@/constants/colors";

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
        const rawData: any = res.data;
        const portfolioList: any[] = Array.isArray(rawData) ? rawData : (rawData?.data || rawData?.portfolios || []);
        const pagination = rawData?.pagination;

        setProfessionals((prev) => (replace ? portfolioList : [...prev, ...portfolioList]));
        setTotalPages(pagination?.pages || 1);
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

  const POPULAR_SKILLS = ["Developer", "Designer", "Plumber", "Electrician", "Tutor", "Chef"];

  return (
    <TouchableWithoutFeedback onPress={dismissSuggestions}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          {/* Header Hero */}
          <View style={styles.headerHero}>
            <Text style={styles.heroTitle}>Find Experts</Text>
            <Text style={styles.heroSubtitle}>Connect with trusted local professionals</Text>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchBarRow}>
              {/* Skill Search input */}
              <View style={styles.searchFieldWrap}>
                <Feather name="search" size={16} color={colors.primary} style={styles.fieldIcon} />
                <TextInput
                  placeholder="Skills, service..."
                  value={skillQuery}
                  onChangeText={handleSkillChange}
                  onFocus={() => setActiveInput("skill")}
                  style={styles.fieldInput}
                  placeholderTextColor={colors.placeholder}
                />
                {skillQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSkillQuery("");
                      setSkillSuggestions([]);
                    }}
                    style={styles.clearFieldBtn}
                  >
                    <Feather name="x" size={14} color={colors.gray} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Vertical Divider */}
              <View style={styles.fieldDivider} />

              {/* Location Search input */}
              <View style={[styles.searchFieldWrap, { flex: 0.8 }]}>
                <Feather name="map-pin" size={15} color="#10B981" style={styles.fieldIcon} />
                <TextInput
                  placeholder="Location..."
                  value={locationQuery}
                  onChangeText={handleLocationChange}
                  onFocus={() => setActiveInput("location")}
                  style={styles.fieldInput}
                  placeholderTextColor={colors.placeholder}
                />
                {locationQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setLocationQuery("");
                      setLocationSuggestions([]);
                    }}
                    style={styles.clearFieldBtn}
                  >
                    <Feather name="x" size={14} color={colors.gray} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Popular skill suggestion chips */}
            <View style={styles.popularRow}>
              <Text style={styles.popularLabel}>Popular:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.popularChips}
              >
                {POPULAR_SKILLS.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={styles.popularChip}
                    onPress={() => {
                      setSkillQuery(skill);
                      loadProfessionals(1, skill, locationQuery, true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.popularChipText}>{skill}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Float Suggestions Dropdown - Skill */}
            {activeInput === "skill" && skillSuggestions.length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {skillSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestionRow,
                      index === skillSuggestions.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => handleSelectSuggestion("skill", item)}
                  >
                    <Feather name="search" size={13} color={colors.gray} style={styles.suggestIcon} />
                    <Text style={styles.suggestText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Float Suggestions Dropdown - Location */}
            {activeInput === "location" && locationSuggestions.length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {locationSuggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestionRow,
                      index === locationSuggestions.length - 1 && { borderBottomWidth: 0 },
                    ]}
                    onPress={() => handleSelectSuggestion("location", item)}
                  >
                    <Feather name="map-pin" size={13} color={colors.gray} style={styles.suggestIcon} />
                    <Text style={styles.suggestText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: "#F8F9FA",
  },
  headerHero: {
    marginBottom: 16,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  searchSection: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16,
    zIndex: 100,
    position: "relative",
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    height: 48,
  },
  searchFieldWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
    height: "100%",
    padding: 0,
  },
  clearFieldBtn: {
    padding: 6,
  },
  fieldDivider: {
    width: 1,
    height: "50%",
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  popularRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 2,
  },
  popularLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    marginRight: 8,
  },
  popularChips: {
    gap: 6,
    alignItems: "center",
  },
  popularChip: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  popularChipText: {
    fontSize: 11.5,
    color: colors.primary,
    fontWeight: "700",
  },
  suggestionsDropdown: {
    position: "absolute",
    top: "105%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 99999,
    paddingVertical: 4,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBg,
  },
  suggestIcon: {
    marginRight: 10,
  },
  suggestText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
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
