import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../utils/AuthContext";

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={60} color="#4A6CF7" />
        </View>
        <Text style={styles.title}>My Profile 👤</Text>
        <Text style={styles.subtitle}>
          Manage your account, listings, and preferences.
        </Text>
      </View>

      <View style={styles.content}>
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name || "Not set"}</Text>

            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.phone || "Not set"}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email || "Not set"}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f4ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
