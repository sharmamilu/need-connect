import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#4A6CF7",
          tabBarInactiveTintColor: "#999",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
            height: 84,
            paddingBottom: 10,
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
        {/* Hide index.tsx from tab bar */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            href: null,
          }}
        />

        {/* Home/Dashboard Tab */}
        <Tabs.Screen
          name="dashboard"
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

        {/* Sell/Add Item Tab */}
        <Tabs.Screen
          name="sell"
          options={{
            title: "Sell",
            tabBarIcon: ({ color, size }) => (
              <Feather name="plus-circle" size={size} color={color} />
            ),
          }}
        />

        {/* Messages Tab */}
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, size }) => (
              <Feather name="message-circle" size={size} color={color} />
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
      </Tabs>
    </ProtectedRoute>
  );
}
