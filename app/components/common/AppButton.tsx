import { colors } from "@/app/constants/colors";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
}: AppButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        pressed && styles.pressed,
        (disabled || isLoading) && styles.disabled,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<{
  button: ViewStyle;
  pressed: ViewStyle;
  disabled: ViewStyle;
  text: TextStyle;
}>({
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,

    // 3D Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // 3D Shadow (Android)
    elevation: 6,
  },

  pressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  disabled: {
    backgroundColor: "#dddddd",
    elevation: 0,
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
