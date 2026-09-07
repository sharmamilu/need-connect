import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { toggleSavePortfolio } from "@/utils/apiFunctions";
import { useAuth } from "@/utils/AuthContext";

export default function ProfessionalCard({ data }: any) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [isSaved, setIsSaved] = useState(data.saved || data.isSaved || false);

  const currentUid = currentUser?._id || currentUser?.id;
  const targetUid =
    data.userId ||
    data.user?._id ||
    (typeof data.user === "string" ? data.user : null);

  const rating = data.rating || data.user?.rating || 0;
  const isLowRating = rating > 0 && rating < 2.5;

  const isOwner = currentUid && targetUid && currentUid === targetUid;

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved);
    try {
      const res = await toggleSavePortfolio(data._id);
      if (res.data?.success !== undefined && !res.data.success) {
        setIsSaved(isSaved);
      } else if (res.data?.saved !== undefined) {
        setIsSaved(res.data.saved);
      }
    } catch (err) {
      console.error(err);
      setIsSaved(isSaved);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/professional/${data._id}` as any)}
    >
      {data.profilePhoto ? (
        <Image source={{ uri: data.profilePhoto }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.placeholderText}>
            {data.name?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
          <TouchableOpacity onPress={handleSaveToggle} style={styles.saveBtn}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? "#16A34A" : "#CCC"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.professionRow}>
          <Text style={styles.profession} numberOfLines={1}>
            {data.profession}
          </Text>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text
              style={[styles.ratingText, isLowRating && styles.lowRatingText]}
            >
              {rating > 0 ? rating.toFixed(1) : "New"}
            </Text>
          </View>
        </View>

        <View style={styles.skills}>
          {data.skills.slice(0, 3).map((skill: any) => (
            <Text key={skill} style={styles.skill}>
              {skill}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveBtn: {
    padding: 4,
    marginRight: -4,
  },
  professionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profession: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#444",
  },
  lowRatingText: {
    color: "#FF4757",
  },
  skills: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  skill: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#EDF1FF",
    borderRadius: 12,
    color: "#4A6CF7",
  },
});
