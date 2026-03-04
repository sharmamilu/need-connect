import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteDocument, fetchMyDocuments } from "../utils/apiFunctions";

export default function MyDocumentsScreen() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDocuments = async () => {
    try {
      const res = await fetchMyDocuments();
      if (res.data?.success) {
        setDocuments(res.data.data);
      } else {
        setDocuments(res.data || []);
      }
    } catch (error) {
      console.error("Failed to load documents", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDocuments();
  };

  const handleDelete = (docId: string) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document permanently?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDocument(docId);
              setDocuments(
                documents.filter((d) => d._id !== docId && d.id !== docId),
              );
            } catch (error) {
              Alert.alert("Error", "Could not delete document.");
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const docId = item._id || item.id;
    const rawTemplateType = item.templateType || "invoice";
    const title = item.formData?.title || "Untitled Document";
    const dateStr = new Date(item.createdAt).toLocaleDateString();

    const icons: Record<string, string> = {
      invoice: "file-text",
      quotation: "dollar-sign",
      proposal: "briefcase",
      contract: "check-square",
      resume: "user",
    };

    const iconName = icons[rawTemplateType] || "file";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          router.push(`/template/${rawTemplateType}?docId=${docId}` as any)
        }
      >
        <View style={styles.iconContainer}>
          <Feather name={iconName as any} size={24} color="#4A6CF7" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.badge}>{rawTemplateType.toUpperCase()}</Text>
            <Text style={styles.date}>{dateStr}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(docId)}
        >
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Documents</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="folder-minus" size={60} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No documents yet</Text>
          <Text style={styles.emptyDesc}>
            Return to the Templates screen to generate your first professional
            document.
          </Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.createBtnText}>View Templates</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 16, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContainer: { flex: 1, paddingRight: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#1E293B", marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center" },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4A6CF7",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  date: { fontSize: 13, color: "#64748B" },
  deleteBtn: { padding: 8 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  createBtn: {
    backgroundColor: "#4A6CF7",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
});
