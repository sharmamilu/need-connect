import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { User } from "@/types";

interface ProfileHeaderProps {
  user?: User | any;
  profile?: any;
  postsCount?: number;
  onViewPortfolio?: (() => void) | null;
  onWriteReview?: (() => void) | null;
  onViewReviews?: (() => void) | null;
  isOwner?: boolean;
}

export default function ProfileHeader({
  user,
  profile,
  postsCount,
  onViewPortfolio,
  onWriteReview,
  onViewReviews,
  isOwner,
}: ProfileHeaderProps) {
  const router = useRouter();

  const name = user?.name || profile?.name || "User";
  const avatarUri = profile?.profilePhoto || user?.avatar;
  const profession = profile?.profession || "Member";
  const rating = profile?.rating || user?.rating || 0;
  const isVerified = profile?.isVerified || user?.isVerified || false;
  const isLowRating = rating > 0 && rating < 2.5;

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={[styles.avatar, isLowRating && styles.lowRatingAvatar]}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.placeholderAvatar,
              isLowRating && styles.lowRatingAvatar,
            ]}
          >
            <Text style={styles.placeholderText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isVerified && (
              <Ionicons name="checkmark-circle" size={16} color="#4A6CF7" />
            )}
          </View>
          <Text style={styles.profession}>{profession}</Text>

          <TouchableOpacity
            style={styles.ratingRow}
            onPress={onViewReviews || undefined}
            activeOpacity={onViewReviews ? 0.7 : 1}
          >
            {[...Array(5)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < Math.floor(rating) ? "star" : "star-outline"}
                size={14}
                color="#FFB800"
              />
            ))}
            <Text
              style={[styles.ratingText, isLowRating && styles.lowRatingText]}
            >
              {rating > 0 ? rating.toFixed(1) : "New"}
            </Text>
            {onViewReviews && (
              <Feather
                name="chevron-right"
                size={12}
                color="#999"
                style={{ marginLeft: 2 }}
              />
            )}
          </TouchableOpacity>
          <View style={styles.statsRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{postsCount} Posts</Text>
            </View>
            {onViewPortfolio && (
              <TouchableOpacity
                style={styles.portfolioBtn}
                onPress={onViewPortfolio || undefined}
              >
                <Feather name="external-link" size={12} color="#fff" />
                <Text style={styles.portfolioBtnText}>Portfolio</Text>
              </TouchableOpacity>
            )}
            {onWriteReview && (
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={onWriteReview || undefined}
              >
                <Feather name="edit-2" size={12} color="#4A6CF7" />
                <Text style={styles.reviewBtnText}>Review</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {isOwner && isLowRating && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning-outline" size={18} color="#FF4757" />
          <Text style={styles.warningText}>
            Your rating is low ({rating.toFixed(1)}). Please maintain a high
            quality of work and good communication to improve your standing.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 16,
  },
  iconBtn: {
    padding: 4,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f2f5",
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1c1e21",
  },
  profession: {
    fontSize: 14,
    color: "#65676b",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#444",
  },
  badge: {
    backgroundColor: "#f2f3f5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3b5bdb",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  portfolioBtn: {
    backgroundColor: "#4A6CF7",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  portfolioBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 4,
    backgroundColor: "#fff",
  },
  reviewBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A6CF7",
  },
  lowRatingAvatar: {
    borderWidth: 2,
    borderColor: "#FF4757",
  },
  lowRatingText: {
    color: "#FF4757",
  },
  warningBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#C53030",
    lineHeight: 18,
    fontWeight: "500",
  },
});
