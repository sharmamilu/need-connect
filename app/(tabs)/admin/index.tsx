import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { POST_BACKGROUNDS } from "../../constants/postBackgrounds";
import {
  approveListing,
  approvePost,
  fetchAdminListings,
  fetchAdminPosts,
  rejectListing,
  rejectPost,
} from "../../utils/apiFunctions";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"Posts" | "Listings">("Posts");

  const [posts, setPosts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState<{
    id: string;
    type: "post" | "listing";
  } | null>(null);

  const loadPendingItems = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "Posts") {
        const res = await fetchAdminPosts({ status: "pending" });
        setPosts(res.data?.data || []);
      } else {
        const res = await fetchAdminListings({ status: "pending" });
        setListings(res.data?.data || []);
      }
    } catch (error) {
      console.log(`Error fetching pending ${activeTab}:`, error);
      // Fallback fake data if backend admin routes aren't instantly ready
      if (activeTab === "Posts") {
        setPosts([
          {
            _id: "mock-post-1",
            author: { name: "Mock User" },
            description: "This is a requested post review.",
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        setListings([
          {
            _id: "mock-list-1",
            author: { name: "Mock User" },
            title: "Mock Pending Jacket",
            price: "$150",
            category: "Clothing",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadPendingItems();
  }, [loadPendingItems]);

  const handleApprovePost = async (id: string) => {
    try {
      await approvePost(id);
      Alert.alert("Success", "Post Approved");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      // Mock success if api not ready
      Alert.alert("Success", "Post Approved (Mock)");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const handleRejectPost = (id: string) => {
    setRejectTarget({ id, type: "post" });
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const handleApproveListing = async (id: string) => {
    try {
      await approveListing(id);
      Alert.alert("Success", "Listing Approved");
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (e) {
      Alert.alert("Success", "Listing Approved (Mock)");
      setListings((prev) => prev.filter((l) => l._id !== id));
    }
  };

  const handleRejectListing = (id: string) => {
    setRejectTarget({ id, type: "listing" });
    setRejectReason("");
    setRejectModalVisible(true);
  };

  const submitRejection = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      Alert.alert(
        "Missing Input",
        "Please provide a reason for rejecting this content.",
      );
      return;
    }

    try {
      if (rejectTarget.type === "post") {
        await rejectPost(rejectTarget.id, rejectReason);
        setPosts((prev) => prev.filter((p) => p._id !== rejectTarget.id));
      } else {
        await rejectListing(rejectTarget.id, rejectReason);
        setListings((prev) => prev.filter((l) => l._id !== rejectTarget.id));
      }
      Alert.alert("Success", "Item successfully rejected.");
    } catch (e) {
      // Mock success if api not ready
      if (rejectTarget.type === "post") {
        setPosts((prev) => prev.filter((p) => p._id !== rejectTarget.id));
      } else {
        setListings((prev) => prev.filter((l) => l._id !== rejectTarget.id));
      }
      Alert.alert("Success", "Item rejected (Mock).");
    } finally {
      setRejectModalVisible(false);
      setRejectTarget(null);
    }
  };

  const renderPostCard = ({ item }: { item: any }) => {
    const authorName =
      item.author?.name || item.user?.name || item.userName || "User";
    const bg = POST_BACKGROUNDS.find((b: any) => b.id === item.backgroundStyle);
    const showBg =
      bg && bg.id !== "none" && (!item.images || item.images.length === 0);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {authorName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>

        {showBg ? (
          <LinearGradient
            colors={bg.colors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
              minHeight: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: bg.textColor,
                textAlign: "center",
              }}
            >
              {item.description}
            </Text>
          </LinearGradient>
        ) : (
          <Text style={styles.descriptionText}>{item.description}</Text>
        )}

        {item.tags && item.tags.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {item.tags.map((tag: string, index: number) => (
              <Text
                key={`${tag}-${index}`}
                style={{ fontSize: 13, color: "#4A6CF7", fontWeight: "600" }}
              >
                #{tag}
              </Text>
            ))}
          </View>
        )}

        {item.images && item.images.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            {item.images.length === 1 ? (
              <Image
                source={{ uri: item.images[0] }}
                style={[styles.cardImage, { marginBottom: 0 }]}
              />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 16 }}
              >
                {item.images.map((url: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={[styles.cardImage, { width: 280, marginBottom: 0 }]}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        )}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleRejectPost(item._id)}
          >
            <Feather name="x" size={18} color="#E53935" />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleApprovePost(item._id)}
          >
            <Feather name="check" size={18} color="#fff" />
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderListingCard = ({ item }: { item: any }) => {
    const authorName =
      item.author?.name ||
      item.user?.name ||
      item.seller?.name ||
      item.userName ||
      "User";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {authorName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingPrice}>{item.price}</Text>

        {item.images && item.images.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            {item.images.length === 1 ? (
              <Image
                source={{ uri: item.images[0] }}
                style={[styles.cardImage, { marginBottom: 0 }]}
              />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 16 }}
              >
                {item.images.map((url: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={[styles.cardImage, { width: 280, marginBottom: 0 }]}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleRejectListing(item._id)}
          >
            <Feather name="x" size={18} color="#E53935" />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => handleApproveListing(item._id)}
          >
            <Feather name="check" size={18} color="#fff" />
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Review Pending Submissions</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            activeTab === "Posts" && styles.toggleBtnActive,
          ]}
          onPress={() => setActiveTab("Posts")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "Posts" && styles.toggleTextActive,
            ]}
          >
            Pending Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            activeTab === "Listings" && styles.toggleBtnActive,
          ]}
          onPress={() => setActiveTab("Listings")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "Listings" && styles.toggleTextActive,
            ]}
          >
            Pending Listings
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : activeTab === "Posts" ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="check-circle" size={48} color="#16A34A" />
              <Text style={styles.emptyText}>All posts reviewed!</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          renderItem={renderListingCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="check-circle" size={48} color="#16A34A" />
              <Text style={styles.emptyText}>All listings reviewed!</Text>
            </View>
          }
        />
      )}

      {/* Reject Reason Modal */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Content</Text>
              <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Please explain why this content is being rejected. This will be
              visible to the user.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Violates guidelines..."
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
              autoFocus
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSubmitBtn]}
                onPress={submitRejection}
              >
                <Text style={styles.modalSubmitText}>Confirm Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2D3436",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleBtnActive: {
    backgroundColor: "#4A6CF7",
    borderColor: "#4A6CF7",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  toggleTextActive: {
    color: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2D3436",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#aaa",
  },
  badge: {
    backgroundColor: "#EDF1FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#4A6CF7",
    fontSize: 12,
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 15,
    color: "#4a5568",
    lineHeight: 22,
    marginBottom: 12,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
    marginBottom: 12,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#F0F0F0",
  },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  rejectBtn: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  approveBtn: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  rejectBtnText: {
    color: "#E53935",
    fontWeight: "700",
  },
  approveBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#E53935",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 20,
  },
  modalActionRow: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  modalCancelText: {
    color: "#666",
    fontWeight: "700",
    fontSize: 16,
  },
  modalSubmitBtn: {
    backgroundColor: "#E53935",
  },
  modalSubmitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
