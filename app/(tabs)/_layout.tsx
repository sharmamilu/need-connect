import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "../utils/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();
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
            href: (user as any)?.userRole === "admin" ? "/notifications" : null,
            tabBarIcon: ({ color, size }) => (
              <Feather name="bell" size={size} color={color} />
            ),
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
