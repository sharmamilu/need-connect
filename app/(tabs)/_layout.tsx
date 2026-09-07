import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Platform } from "react-native";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "../utils/AuthContext";
import { fetchAdminListings, fetchAdminPosts } from "../utils/apiFunctions";

export default function TabsLayout() {
  const { user } = useAuth();
  const isAdmin = (user as any)?.userRole === "admin";
  const [badgeCount, setBadgeCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    const getPendingCount = async () => {
      if (!isAdmin) {
        try {
          const isRead = await AsyncStorage.getItem("welcome_notif_read");
          setBadgeCount(isRead === "true" ? undefined : 1);
        } catch {
          setBadgeCount(1);
        }
        return;
      }

      try {
        const [postsRes, listingsRes] = await Promise.all([
          fetchAdminPosts({ status: "pending", limit: 1 }),
          fetchAdminListings({ status: "pending", limit: 1 }),
        ]);
        const postCount = postsRes.data?.count ?? postsRes.data?.pagination?.total ?? (postsRes.data?.data?.length || 0);
        const listingCount = listingsRes.data?.count ?? listingsRes.data?.pagination?.total ?? (listingsRes.data?.data?.length || 0);
        const total = postCount + listingCount;
        setBadgeCount(total > 0 ? total : undefined);
      } catch (err: any) {
        if (err?.response?.status !== 401) {
          console.log("Error fetching badge count:", err);
        }
      }
    };

    getPendingCount();
    const interval = setInterval(getPendingCount, 30000);
    const sub = DeviceEventEmitter.addListener("NotificationRefresh", getPendingCount);
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [isAdmin]);

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4A6CF7",
          tabBarInactiveTintColor: "#999",
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
            height: Platform.OS === "ios" ? 88 : 78,
            paddingBottom: Platform.OS === "ios" ? 30 : 12,
            paddingTop: 10,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
        }}
      >
        {/* Home/Dashboard Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />

        {/* Explore/Search Tab */}
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" size={size} color={color} />
            ),
          }}
        />

        {/* Listings Tab */}
        <Tabs.Screen
          name="listings"
          options={{
            title: "Listings",
            tabBarIcon: ({ color, size }) => (
              <Feather name="tag" size={size} color={color} />
            ),
          }}
        />

        {/* Portfolio Tab Group */}
        <Tabs.Screen
          name="portfolio"
          options={{
            title: "Portfolio",
            tabBarIcon: ({ color, size }) => (
              <Feather name="briefcase" size={size} color={color} />
            ),
          }}
        />

        {/* Utilities/Templates Tab */}
        <Tabs.Screen
          name="utilities"
          options={{
            title: "Utilities",
            tabBarIcon: ({ color, size }) => (
              <Feather name="grid" size={size} color={color} />
            ),
          }}
        />

        {/* Notifications Tab */}
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarIcon: ({ color, size }) => (
              <Feather name="bell" size={size} color={color} />
            ),
            tabBarBadge: badgeCount,
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />

        {/* Admin Tab (Hidden from non-admins) */}
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            href:
              (user as any)?.userRole === "admin" ? ("/admin" as any) : null,
            tabBarIcon: ({ color, size }) => (
              <Feather name="shield" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
