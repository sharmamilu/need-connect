import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors } from "../../constants/colors";
import { radius, shadow, spacing } from "../../constants/theme";

/** Animated placeholder shown while the feed is loading. */
export default function PostSkeleton() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const Block = ({ style }) => (
    <Animated.View style={[styles.block, style, { opacity: pulse }]} />
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Block style={styles.avatar} />
        <View style={styles.headerText}>
          <Block style={styles.lineShort} />
          <Block style={styles.lineTiny} />
        </View>
      </View>
      <Block style={styles.lineFull} />
      <Block style={styles.lineWide} />
      <Block style={styles.image} />
      <View style={styles.footerRow}>
        <Block style={styles.pill} />
        <Block style={styles.pill} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  block: {
    backgroundColor: colors.skeleton,
    borderRadius: radius.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  headerText: { flex: 1, gap: 6 },
  lineShort: { width: "45%", height: 12 },
  lineTiny: { width: "25%", height: 10 },
  lineFull: { width: "100%", height: 11, marginBottom: 8 },
  lineWide: { width: "70%", height: 11, marginBottom: spacing.md },
  image: { width: "100%", height: 180, borderRadius: radius.md },
  footerRow: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  pill: { width: 56, height: 22, borderRadius: radius.pill },
});
