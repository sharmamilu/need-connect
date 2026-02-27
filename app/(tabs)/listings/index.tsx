import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ListingCard from "../../components/listings/ListingCard";
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

export default function ListingsFeed() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [listings, setListings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadListings = useCallback(
    async (
      pageNum: number,
      searchQuery: string,
      categoryFilter: string,
      replace: boolean,
    ) => {
      try {
        if (replace) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const params: any = { page: pageNum, limit: 10 };
        if (searchQuery) params.search = searchQuery;
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
      }
    },
    [],
  );

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      loadListings(1, query, activeCategory, true);
      return;
    }
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      loadListings(1, query, activeCategory, true);
    }, 500);

    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [query, activeCategory, loadListings]);

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      loadListings(page + 1, query, activeCategory, false);
    }
  };

  const handleSearchChange = (text: string) => {
    setQuery(text);
  };

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

            {/* Categories */}
            <View style={styles.categoriesWrapper}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.categoriesList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      activeCategory === item && styles.categoryItemActive,
                    ]}
                    onPress={() => setActiveCategory(item)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        activeCategory === item && styles.categoryTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>

          {/* Results */}
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#4A6CF7" />
              <Text style={styles.loadingText}>Finding listings...</Text>
            </View>
          ) : error && listings.length === 0 ? (
            <View style={styles.centered}>
              <Feather name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No Listings Found</Text>
              <Text style={styles.emptySubText}>
                Be the first to create one!
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadListings(1, query, activeCategory, true)}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : listings.length === 0 ? (
            <View style={styles.centered}>
              <Feather name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No listings found</Text>
              <Text style={styles.emptySubText}>
                Try adjusting your search or category
              </Text>
            </View>
          ) : (
            <FlatList
              data={listings}
              keyExtractor={(item) => item._id}
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
              contentContainerStyle={styles.listContent}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A6CF7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
  },
  searchSection: {
    gap: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2D3436",
    fontWeight: "500",
  },
  categoriesWrapper: {
    marginHorizontal: -16, // Bleed into edges
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 4,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryItemActive: {
    backgroundColor: "#4A6CF7",
    borderColor: "#4A6CF7",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingBottom: 20,
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
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
  },
  retryButton: {
    marginTop: 12,
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
  loadMoreSpinner: {
    paddingVertical: 16,
  },
});
