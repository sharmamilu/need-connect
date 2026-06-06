import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";

type Props = {
  completed: number;
  total: number;
  percent: number;
};

/** Shows how far along the user is in completing the required fields. */
export default function PortfolioProgress({ completed, total, percent }: Props) {
  const width = useRef(new Animated.Value(0)).current;
  const done = completed >= total;

  useEffect(() => {
    Animated.timing(width, {
      toValue: percent,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [percent, width]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconChip}>
          <Feather
            name={done ? "check-circle" : "edit-3"}
            size={16}
            color={done ? colors.success : colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {done ? "Ready to publish!" : "Complete your profile"}
          </Text>
          <Text style={styles.subtitle}>
            {completed} of {total} required fields done
          </Text>
        </View>
        <Text style={[styles.percent, done && styles.percentDone]}>
          {percent}%
        </Text>
      </View>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            done && styles.fillDone,
            {
              width: width.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  percent: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  percentDone: {
    color: colors.success,
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.skeleton,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  fillDone: {
    backgroundColor: colors.success,
  },
});
