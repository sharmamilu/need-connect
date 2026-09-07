// components/CustomAlert.tsx
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

type Props = {
  message: string;
  type: "success" | "error";
  duration?: number; // optional, default 3000ms
  onHide?: () => void;
};

const CustomAlert: React.FC<Props> = ({
  message,
  type,
  duration = 3000,
  onHide,
}) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity },
        type === "success" ? styles.success : styles.error,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    zIndex: 9999,
    elevation: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  success: { backgroundColor: "#4BB543" },
  error: { backgroundColor: "#FF3333" },
});

export default CustomAlert;
