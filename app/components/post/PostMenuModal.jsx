import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function PostMenuModal({
  visible,
  onClose,
  onDelete,
  onPin,
  onSave,
  onCopyLink,
  isOwner,
  isPinned,
  isSaved,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.indicator} />

              <View style={styles.section}>
                {isOwner && (
                  <MenuOption
                    icon={isPinned ? "pin-off-outline" : "pin-outline"}
                    iconFamily="MaterialCommunityIcons"
                    title={isPinned ? "Unpin post" : "Pin post"}
                    subtitle={
                      isPinned
                        ? "Remove this from the top of your profile."
                        : "Pin this post to the top of your profile."
                    }
                    onPress={() => {
                      onPin?.();
                      onClose();
                    }}
                  />
                )}
                <MenuOption
                  icon="bookmark"
                  title={isSaved ? "Unsave post" : "Save post"}
                  subtitle={
                    isSaved
                      ? "Remove from your saved items."
                      : "Add this to your saved items."
                  }
                  onPress={() => {
                    onSave?.();
                    onClose();
                  }}
                />
                <MenuOption
                  icon="link"
                  title="Copy link"
                  onPress={() => {
                    onCopyLink?.();
                    onClose();
                  }}
                />
              </View>

              <View style={styles.separator} />

              {isOwner && onDelete && (
                <View style={styles.section}>
                  <MenuOption
                    icon="trash-2"
                    title="Delete post"
                    destructive
                    onPress={() => {
                      onDelete?.();
                      onClose();
                    }}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function MenuOption({
  icon,
  iconFamily = "Feather",
  title,
  subtitle,
  onPress,
  destructive,
}) {
  const IconComponent =
    iconFamily === "MaterialCommunityIcons" ? MaterialCommunityIcons : Feather;
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.iconContainer}>
        <IconComponent
          name={icon}
          size={22}
          color={destructive ? "#ff4d4d" : "#1c1e21"}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[styles.optionTitle, destructive && styles.destructiveText]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: "#1c1e21",
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#65676b",
    marginTop: 2,
  },
  destructiveText: {
    color: "#ff4d4d",
  },
  separator: {
    height: 8,
    backgroundColor: "#f0f2f5",
    marginVertical: 10,
  },
});
