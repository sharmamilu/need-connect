import { colors } from "@/app/constants/colors";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  /** Optional text shown next to the spinner while loading. */
  loadingTitle?: string;
};

export default function AppButton({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  loadingTitle,
}: AppButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || isLoading;

  const animateTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={() => !isDisabled && animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.button, isDisabled && styles.disabled]}
      >
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color="#fff" />
            {loadingTitle ? (
              <Text style={[styles.text, styles.loadingText]}>
                {loadingTitle}
              </Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  disabled: {
    backgroundColor: "#C2C8D6",
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    marginLeft: 0,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
