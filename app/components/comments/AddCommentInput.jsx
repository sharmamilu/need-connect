import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddCommentInput({ onSubmit, replyTo, onCancelReply }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <View style={styles.outerContainer}>
      {replyTo && (
        <View style={styles.replyBar}>
          <Text style={styles.replyText}>Replying to {replyTo}</Text>
          <TouchableOpacity onPress={onCancelReply}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.container}>
        <TextInput
          placeholder={
            replyTo ? `Reply to ${replyTo}...` : "Write a comment..."
          }
          value={text}
          onChangeText={setText}
          style={styles.input}
          autoFocus={!!replyTo}
        />
        <TouchableOpacity onPress={handleSend} disabled={!text.trim()}>
          <Ionicons
            name="send"
            size={22}
            color={text.trim() ? "#3b5bdb" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  replyBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
  },
  replyText: {
    fontSize: 12,
    color: "#666",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    fontSize: 15,
    maxHeight: 100,
  },
});
