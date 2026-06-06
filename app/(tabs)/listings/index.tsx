import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import ListingCard from "../../components/listings/ListingCard";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";
import { fetchListings } from "../../utils/apiFunctions";

const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Vehicles",
  "Services",
  "Other",
];

const CATEGORY_ICONS: Record<string, string> = {
  All: "grid",
  Electronics: "smartphone",
  Furniture: "home",
  Clothing: "shopping-bag",
  Books: "book-open",
  Vehicles: "truck",
  Services: "tool",
  Other: "package",
};

type SortKey = "newest" | "priceLow" | "priceHigh";
const SORTS: { key: SortKey; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: "newest", label: "Newest", icon: "clock" },
  { key: "priceLow", label: "Price ↑", icon: "arrow-up" },
  { key: "priceHigh", label: "Price ↓", icon: "arrow-down" },
];

// Best-effort numeric price from a free-text price string ("$1,299 or best offer").
const parsePrice = (p: any): number | null => {
  if (p == null) return null;
  const m = String(p).replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

export default function ListingsFeed() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");

  const [listings, setListings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [locationText, setLocationText] = useState("");
  const locationDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [locationFilter, setLocationFilter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadListings = useCallback(
    async (
      pageNum: number,
      searchQuery: string,
      categoryFilter: string,
      locObj: { lat: number; lng: number } | null,
      locText: string,
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

        // Combine search query and location address for a simple text match on backend
        const searchParts = [];
        if (searchQuery) searchParts.push(searchQuery.trim());
        if (locText && locText !== "My Current Location")
          searchParts.push(locText.trim());

        if (searchParts.length > 0) {
          params.search = searchParts.join(" ");
        }

        if (categoryFilter !== "All") params.category = categoryFilter;

        const res = await fetchListings(params);
        const { data, pagination } = res.data;

        setListings((prev) => (replace ? data : [...prev, ...data]));
        setTotalPages(pagination?.pages || 1);
        setPage(pageNum);
      } catch (err: any) {
        // As backend might not be ready, handle gracefully.
        console.log("Error loading listings:", err);
        if (replace) setListings([]);
        setError("Failed to load listings. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadListings(
        1,
        query,
        activeCategory,
        locationFilter,
        locationText,
        true,
      );
      return;
    }
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      loadListings(
        1,
        query,
        activeCategory,
        locationFilter,
        locationText,
        true,
      );
    }, 500);

    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [query, activeCategory, locationFilter, locationText, loadListings]);

  const toggleLocationFilter = async () => {
    if (locationFilter && locationText === "My Current Location") {
      setLocationFilter(null);
      setLocationText("");
      return;
    }

    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission",
          "Please allow location access to find nearby listings.",
        );
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});

      // Get human-readable address from coordinates
      const addressArr = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addressArr.length > 0) {
        const addr = addressArr[0];
        // Create a searchable location string (e.g. "Bengaluru, Karnataka")
        const locationName = [
          addr.city || addr.district || addr.subregion,
          addr.region,
        ]
          .filter(Boolean)
          .join(", ");

        setLocationText(locationName || "My Current Location");
      } else {
        setLocationText("My Current Location");
      }

      setLocationFilter({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    } catch (e) {
      console.error("Location error:", e);
      Alert.alert("Error", "Could not fetch your location.");
      setLocationText("");
    } finally {
      setLocationLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    loadListings(1, query, activeCategory, locationFilter, locationText, true);
  };

  const handleSearchChange = (text: string) => {
    setQuery(text);
  };

  // Client-side sort over the loaded listings.
  const visibleListings = useMemo(() => {
    if (sort === "newest") return listings;
    const priceOf = (l: any) =>
      l.listingType === "Free" || l.listingType === "Donate"
        ? 0
        : parsePrice(l.price);
    const arr = [...listings];
    arr.sort((a, b) => {
      const pa = priceOf(a);
      const pb = priceOf(b);
      if (pa == null && pb == null) return 0;
      if (pa == null) return 1; // unknown prices last
      if (pb == null) return -1;
      return sort === "priceLow" ? pa - pb : pb - pa;
    });
    return arr;
  }, [listings, sort]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Listings</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/listings/create")}
          >
            <Feather name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={styles.searchBar}>
                <Feather name="search" size={18} color="#7C7C7C" />
                <TextInput
                  placeholder="Search listings..."
                  value={query}
                  onChangeText={handleSearchChange}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={() => setQuery("")}>
                    <Feather name="x" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Location Toggle Button */}
              <TouchableOpacity
                style={[
                  styles.nearMeBtn,
                  locationFilter && styles.nearMeBtnActive,
                ]}
                onPress={toggleLocationFilter}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={locationFilter ? "#fff" : colors.primary}
                  />
                ) : (
                  <Feather
                    name="navigation"
                    size={20}
                    color={locationFilter ? "#fff" : colors.primary}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Custom Location Search */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[styles.searchBar, { flex: 1 }]}>
                <Feather name="map-pin" size={18} color="#7C7C7C" />
                <TextInput
                  placeholder="Where? (e.g. New York, London)"
                  value={locationText}
                  onChangeText={(text) => {
                    // Prevent editing if it's auto-selected to current location to avoid confusion
                    if (locationText === "My Current Location" && text !== "") {
                      setLocationText("");
                      setLocationFilter(null);
                    } else {
                      setLocationText(text);
                    }
                  }}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
                {locationText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setLocationText("");
                      setLocationFilter(null);
                    }}
                  >
                    <Feather name="x" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesWrapper}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.categoriesList}
                renderItem={({ item }) => {
                  const isActive = activeCategory === item;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.categoryItem,
                        isActive && styles.categoryItemActive,
                      ]}
                      onPress={() => setActiveCategory(item)}
                      activeOpacity={0.8}
                    >
                      <Feather
                        name={CATEGORY_ICONS[item] || "package"}
                        size={13}
                        color={isActive ? "#fff" : "#4B5563"}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          isActive && styles.categoryTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>

          {/* Sort + count bar */}
          {!loading && listings.length > 0 && (
            <View style={styles.sortBar}>
              <Text style={styles.resultCount}>
                {listings.length} {listings.length === 1 ? "result" : "results"}
              </Text>
              <View style={styles.sortChips}>
                {SORTS.map((s) => {
                  const active = sort === s.key;
                  return (
                    <TouchableOpacity
                      key={s.key}
                      style={[styles.sortChip, active && styles.sortChipActive]}
                      onPress={() => setSort(s.key)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.sortChipText,
                          active && styles.sortChipTextActive,
                        ]}
                      >
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Results */}
          {loading && !refreshing ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Finding listings...</Text>
            </View>
          ) : (
            <FlatList
              data={visibleListings}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => (
                <ListingCard
                  data={item}
                  onDeleteSuccess={(deletedId: string) => {
                    setListings((prevListings) =>
                      prevListings.filter((l) => l._id !== deletedId),
                    );
                  }}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                listings.length === 0 && { flex: 1 },
              ]}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReached={() => {
                if (!loadingMore && page < totalPages) {
                  loadListings(
                    page + 1,
                    query,
                    activeCategory,
                    locationFilter,
                    locationText,
                    false,
                  );
                }
              }}
              onEndReachedThreshold={0.4}
              ListEmptyComponent={
                error ? (
                  <View style={styles.centered}>
                    <Feather name="alert-circle" size={48} color={colors.error} />
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
                    <Feather name="inbox" size={48} color={colors.gray} />
                    <Text style={styles.emptyText}>No listings found</Text>
                    <Text style={styles.emptySubText}>
                      Try adjusting your search or category
                    </Text>
                  </View>
                )
              }
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
    gap: 6,
    ...shadow.card,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  searchSection: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nearMeBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  nearMeBtnActive: {
    backgroundColor: colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: "500",
  },
  categoriesWrapper: {
    marginHorizontal: -spacing.lg,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: 2,
  },
  categoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  categoryItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#4B5563",
  },
  categoryTextActive: {
    color: "#fff",
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  sortChips: {
    flexDirection: "row",
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  sortChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.textMuted,
  },
  sortChipTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 15,
    color: colors.error,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptySubText: {
    fontSize: 13.5,
    color: colors.textMuted,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  loadMoreSpinner: {
    paddingVertical: spacing.lg,
  },
});
