import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TEMPLATES = [
  {
    id: "invoice",
    title: "Service Invoice",
    description: "Bill your clients easily for completed services or gigs.",
    icon: "file-text",
    color: "#4A6CF7",
    bgColor: "#EEF2FF",
  },
  {
    id: "quotation",
    title: "Professional Quotation",
    description: "Provide an accurate cost estimate to seal the deal.",
    icon: "dollar-sign",
    color: "#16A34A",
    bgColor: "#DCFCE7",
  },
  {
    id: "proposal",
    title: "Business Proposal",
    description: "Pitch your ideas and services effectively to prospects.",
    icon: "briefcase",
    color: "#9333EA",
    bgColor: "#F3E8FF",
  },
  {
    id: "contract",
    title: "Standard Agreement",
    description: "A simple contract establishing terms and conditions.",
    icon: "check-square",
    color: "#EA580C",
    bgColor: "#FFEDD5",
  },
  {
    id: "resume",
    title: "Clean Resume",
    description: "Generate a beautiful PDF resume from your profile.",
    icon: "user",
    color: "#0284C7",
    bgColor: "#E0F2FE",
  },
];

export default function TemplatesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: (typeof TEMPLATES)[0] }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/template/${item.id}` as any)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
        <Feather name={item.icon as any} size={24} color={item.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Utilities & Templates</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>
        Quickly generate professional documents and utilities to empower your
        business interactions.
      </Text>

      <TouchableOpacity
        style={styles.savedDocsBtn}
        activeOpacity={0.8}
        onPress={() => router.push("/my-documents" as any)}
      >
        <View style={styles.savedDocsIcon}>
          <Feather name="folder" size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.savedDocsTitle}>My Documents</Text>
          <Text style={styles.savedDocsDesc}>
            View and recreate past generated PDFs
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color="#4A6CF7" />
      </TouchableOpacity>

      <FlatList
        data={TEMPLATES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  savedDocsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savedDocsIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#3B82F6",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  savedDocsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 2,
  },
  savedDocsDesc: {
    fontSize: 13,
    color: "#60A5FA",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
});
