import { Feather } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import CreatePostCard from "./CreatePostCard";

export default function CreatePostModal({ visible, onClose, onCreate }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <CreatePostCard
          onSubmit={(post) => {
            onCreate(post);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  closeBtn: {
    padding: 4,
  },
});
