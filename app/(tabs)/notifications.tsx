import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/utils/AuthContext";
import { fetchAdminListings, fetchAdminPosts } from "@/utils/apiFunctions";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = (user as any)?.userRole === "admin";

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = useCallback(async () => {
    if (!isAdmin) {
      // For now, normal users have empty notifications or static welcome
      setNotifications([
        {
          id: "welcome",
          title: "Welcome to Need Connect!",
          message: "Explore our marketplace and professional community.",
          type: "system",
          createdAt: new Date().toISOString(),
          icon: "info",
          color: "#4A6CF7",
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      // Simulate admin notifications by fetching pending counts
      const [postsRes, listingsRes] = await Promise.all([
        fetchAdminPosts({ status: "pending", limit: 1 }),
        fetchAdminListings({ status: "pending", limit: 1 }),
      ]);

      const pendingPostsCount = postsRes.data?.count ?? postsRes.data?.pagination?.total ?? (postsRes.data?.data?.length || 0);
      const pendingListingsCount = listingsRes.data?.count ?? listingsRes.data?.pagination?.total ?? (listingsRes.data?.data?.length || 0);

      const adminNotifs = [];

      if (pendingPostsCount > 0) {
        adminNotifs.push({
          id: "pending-posts",
          title: "Pending Post Requests",
          message: `There are ${pendingPostsCount} new posts waiting for your review.`,
          type: "admin-post",
          count: pendingPostsCount,
          createdAt: new Date().toISOString(),
          icon: "file-text",
          color: "#4A6CF7",
          route: "/admin",
          tab: "Posts",
        });
      }

      if (pendingListingsCount > 0) {
        adminNotifs.push({
          id: "pending-listings",
          title: "Pending Listing Requests",
          message: `There are ${pendingListingsCount} new listings waiting for approval.`,
          type: "admin-listing",
          count: pendingListingsCount,
          createdAt: new Date().toISOString(),
          icon: "tag",
          color: "#16A34A",
          route: "/admin",
          tab: "Listings",
        });
      }

      if (adminNotifs.length === 0) {
        setNotifications([
          {
            id: "all-clear",
            title: "All Clear!",
            message: "No pending requests to review at the moment.",
            type: "system",
            createdAt: new Date().toISOString(),
            icon: "check-circle",
            color: "#16A34A",
          },
        ]);
      } else {
        setNotifications(adminNotifs);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadNotifications();

    if (!isAdmin) {
      const markWelcomeAsRead = async () => {
        try {
          await AsyncStorage.setItem("welcome_notif_read", "true");
          DeviceEventEmitter.emit("NotificationRefresh");
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
        }
      };
      markWelcomeAsRead();
    }

    const sub = DeviceEventEmitter.addListener("NotificationRefresh", loadNotifications);
    return () => sub.remove();
  }, [loadNotifications, isAdmin]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.notificationCard}
      onPress={() => {
        if (item.route) {
          router.push(item.route);
        }
      }}
      disabled={!item.route}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}
      >
        <Feather name={item.icon} size={22} color={item.color} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifTime}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text style={styles.notifMessage}>{item.message}</Text>
        {item.route && (
          <Text style={[styles.actionLink, { color: item.color }]}>
            Review Now →
          </Text>
        )}
      </View>
      {item.count > 0 && (
        <View style={[styles.countBadge, { backgroundColor: item.color }]}>
          <Text style={styles.countText}>{item.count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Feather name="refresh-cw" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Feather name="bell-off" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No new notifications</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
  },
  notifTime: {
    fontSize: 12,
    color: "#999",
  },
  notifMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  actionLink: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 12,
    fontWeight: "500",
  },
});
