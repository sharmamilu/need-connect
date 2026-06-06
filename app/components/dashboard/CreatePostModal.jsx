import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/theme";
import CreatePostCard from "./CreatePostCard";

export default function CreatePostModal({ visible, onClose, onCreate }) {
  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <CreatePostCard
          onSubmit={(post) => {
            onCreate(post);
            onClose();
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
