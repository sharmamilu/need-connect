import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  userName: string;
  reviewedUserId: string;
}

export default function ReviewModal({
  visible,
  onClose,
  onSubmit,
  userName,
  reviewedUserId,
}: ReviewModalProps) {
  const [relation, setRelation] = useState("worked_with"); // 'worked_with' or 'work_done_for'
  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
  });

  const getQuestions = () => {
    if (relation === "worked_with") {
      return [
        {
          id: "q1",
          label: "How was their communication and teamwork?",
          type: "text",
        },
        {
          id: "q2",
          label: "Did they meet deadlines consistently?",
          type: "text",
        },
        {
          id: "q3",
          label: "How was the quality of their contributions?",
          type: "text",
        },
        {
          id: "q4",
          label: "Would you collaborate with them again?",
          type: "text",
        },
        {
          id: "q5",
          label: "Any additional comments on their technical skills?",
          type: "text",
        },
        {
          id: "q6",
          label:
            "Would you refer them to others? (Helps others make decisions)",
          type: "boolean",
        },
      ];
    }
    return [
      {
        id: "q1",
        label: "Did they deliver the project to your expectations?",
        type: "text",
      },
      {
        id: "q2",
        label: "How responsive were they to your feedback?",
        type: "text",
      },
      {
        id: "q3",
        label: "Was the project completed on time and within budget?",
        type: "text",
      },
      { id: "q4", label: "Would you hire them again?", type: "text" },
      {
        id: "q5",
        label: "Any additional comments about the final deliverable?",
        type: "text",
      },
      {
        id: "q6",
        label: "Would you refer them to others? (Helps others make decisions)",
        type: "boolean",
      },
    ];
  };

  const currentQuestions = getQuestions();

  const handleApply = () => {
    if (rating === 0) {
      alert("Please provide a star rating.");
      return;
    }

    const formattedQuestions = currentQuestions.map((q) => ({
      question: q.label,
      answer: answers[q.id] || "",
    }));

    const parsedReferToOthers = answers.q6 === "Yes";

    const payload = {
      reviewedUserId,
      relation,
      rating,
      referToOthers: parsedReferToOthers,
      questions: formattedQuestions,
    };

    console.log("----- BACKEND REVIEW PAYLOAD (COPY START) -----");
    console.log(JSON.stringify(payload, null, 2));
    console.log("----- BACKEND REVIEW PAYLOAD (COPY END) -----");

    onSubmit(payload);
    // reset form
    setRating(0);
    setAnswers({ q1: "", q2: "", q3: "", q4: "", q5: "", q6: "" });
    onClose();
  };

  const handleCancel = () => {
    setRating(0);
    setAnswers({ q1: "", q2: "", q3: "", q4: "", q5: "", q6: "" });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Review {userName}</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Relation Selection */}
            <Text style={styles.label}>
              What was your working relationship?
            </Text>
            <View style={styles.relationTabs}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  relation === "worked_with" && styles.activeTab,
                ]}
                onPress={() => setRelation("worked_with")}
              >
                <Text
                  style={[
                    styles.tabText,
                    relation === "worked_with" && styles.activeTabText,
                  ]}
                >
                  Worked with them
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  relation === "work_done_for" && styles.activeTab,
                ]}
                onPress={() => setRelation("work_done_for")}
              >
                <Text
                  style={[
                    styles.tabText,
                    relation === "work_done_for" && styles.activeTabText,
                  ]}
                >
                  I hired them
                </Text>
              </TouchableOpacity>
            </View>

            {/* Rating */}
            <Text style={styles.label}>Overall Rating</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Ionicons
                    name={rating >= star ? "star" : "star-outline"}
                    size={32}
                    color="#FFB800"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Dynamic Questions */}
            {currentQuestions.map((q) => (
              <View key={q.id} style={styles.questionContainer}>
                <Text style={styles.questionLabel}>{q.label}</Text>
                {q.type === "boolean" ? (
                  <View style={styles.booleanButtonsRow}>
                    <TouchableOpacity
                      style={[
                        styles.booleanBtn,
                        answers[q.id] === "Yes" && styles.booleanBtnActive,
                      ]}
                      onPress={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: "Yes" }))
                      }
                    >
                      <Ionicons
                        name="thumbs-up-outline"
                        size={16}
                        color={answers[q.id] === "Yes" ? "#fff" : "#4A6CF7"}
                      />
                      <Text
                        style={[
                          styles.booleanBtnText,
                          answers[q.id] === "Yes" &&
                            styles.booleanBtnTextActive,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.booleanBtn,
                        answers[q.id] === "No" && {
                          backgroundColor: "#FF4757",
                          borderColor: "#FF4757",
                        },
                      ]}
                      onPress={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: "No" }))
                      }
                    >
                      <Ionicons
                        name="thumbs-down-outline"
                        size={16}
                        color={answers[q.id] === "No" ? "#fff" : "#FF4757"}
                      />
                      <Text
                        style={[
                          styles.booleanBtnText,
                          { color: "#FF4757" },
                          answers[q.id] === "No" && { color: "#fff" },
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="Your answer..."
                    placeholderTextColor="#999"
                    value={answers[q.id]}
                    onChangeText={(text) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: text }))
                    }
                    multiline
                  />
                )}
              </View>
            ))}
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSubmit} onPress={handleApply}>
              <Text style={styles.btnSubmitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },
  relationTabs: {
    flexDirection: "row",
    backgroundColor: "#f0f2f5",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#4A6CF7",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#fafafa",
    minHeight: 80,
    textAlignVertical: "top",
  },
  booleanButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  booleanBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4A6CF7",
    backgroundColor: "#fff",
  },
  booleanBtnActive: {
    backgroundColor: "#4A6CF7",
  },
  booleanBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A6CF7",
  },
  booleanBtnTextActive: {
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  btnCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  btnSubmit: {
    flex: 2,
    backgroundColor: "#4A6CF7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnSubmitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
