import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchPostLikes } from "../../utils/apiFunctions";

export default function LikedUsersModal({ visible, onClose, postId }) {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadLikes = async (pageNum = 1) => {
    if (!postId) return;
    try {
      if (pageNum === 1) setLoading(true);

      const res = await fetchPostLikes(postId, { page: pageNum, limit: 10 });
      const data = res.data;

      if (data?.success) {
        if (pageNum === 1) {
          setUsers(data.likes || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setUsers((prev) => [...prev, ...(data.likes || [])]);
        }
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (visible && postId) {
      setPage(1);
      loadLikes(1);
    } else {
      setUsers([]);
    }
  }, [visible, postId]);

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      loadLikes(nextPage);
    }
  };

  const navigateToProfile = (userId) => {
    onClose();
    if (userId) {
      router.push(`/user-profile/${userId}`);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => navigateToProfile(item.userId)}
    >
      {item.profilePhoto ? (
        <Image source={{ uri: item.profilePhoto }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.placeholderText}>
            {(item.userName || "U").charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.userName || "User"}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#bbb" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Likes</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#3b5bdb" />
            </View>
          ) : users.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No likes yet</Text>
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item, index) => `${item.userId}-${index}`}
              renderItem={renderItem}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={
                loadingMore && (
                  <View style={{ paddingVertical: 10 }}>
                    <ActivityIndicator size="small" color="#3b5bdb" />
                  </View>
                )
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "70%",
    width: "100%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  closeBtn: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
