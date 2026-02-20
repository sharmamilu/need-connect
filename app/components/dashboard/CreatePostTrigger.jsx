import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CreatePostTrigger({ onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.avatarPlaceholder}>
        <Feather name="user" size={16} color="#666" />
      </View>
      <View style={styles.inputBar}>
        <Text style={styles.placeholder}>What's on your mind?</Text>
      </View>
      <Feather name="image" size={20} color="#45bd62" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f2f5",
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBar: {
    flex: 1,
    height: 36,
    backgroundColor: "#f0f2f5",
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  placeholder: {
    color: "#65676b",
    fontSize: 14,
  },
});
