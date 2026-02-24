import { formatRelativeTime } from "@/app/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ReviewItem({ review }) {
  const reviewerName = review.reviewer?.name || "Anonymous User";
  const reviewerAvatar = review.reviewer?.avatar;

  const getRelationLabel = (rel) => {
    switch (rel) {
      case "worked_with":
        return "Worked with them";
      case "work_done_for":
        return "Hired them";
      default:
        return rel;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header: Reviewer Info & Rating */}
      <View style={styles.header}>
        <View style={styles.reviewerInfo}>
          {reviewerAvatar ? (
            <Image source={{ uri: reviewerAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.placeholderText}>
                {reviewerName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.reviewerName}>{reviewerName}</Text>
            <Text style={styles.relationText}>
              {getRelationLabel(review.relation)}
            </Text>
          </View>
        </View>
        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name={i < review.rating ? "star" : "star-outline"}
              size={14}
              color="#FFB800"
            />
          ))}
        </View>
      </View>

      {/* Date */}
      <Text style={styles.dateText}>
        {formatRelativeTime(new Date(review.createdAt))}
      </Text>

      {/* Questions & Answers */}
      <View style={styles.content}>
        {review.questions?.map((q, idx) => (
          <View key={idx} style={styles.qnaPair}>
            <Text style={styles.questionText}>{q.question}</Text>
            <Text style={styles.answerText}>{q.answer}</Text>
          </View>
        ))}
      </View>

      {/* Refer Status */}
      {review.referToOthers !== undefined && (
        <View
          style={[
            styles.referBadge,
            review.referToOthers ? styles.referYes : styles.referNo,
          ]}
        >
          <Ionicons
            name={review.referToOthers ? "checkmark-circle" : "close-circle"}
            size={14}
            color={review.referToOthers ? "#27AE60" : "#EB5757"}
          />
          <Text
            style={[
              styles.referText,
              { color: review.referToOthers ? "#27AE60" : "#EB5757" },
            ]}
          >
            {review.referToOthers ? "Would recommend" : "Would not recommend"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F3F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholderAvatar: {
    backgroundColor: "#4A6CF7",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  relationText: {
    fontSize: 12,
    color: "#777",
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 2,
  },
  dateText: {
    fontSize: 11,
    color: "#bbb",
    marginBottom: 12,
  },
  content: {
    gap: 12,
  },
  qnaPair: {
    gap: 4,
  },
  questionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  answerText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  referBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    alignSelf: "flex-start",
  },
  referYes: {
    backgroundColor: "#E8F5E9",
  },
  referNo: {
    backgroundColor: "#FFEBEE",
  },
  referText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
