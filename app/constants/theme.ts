import { Platform, TextStyle, ViewStyle } from "react-native";
import { colors } from "./colors";

/**
 * Shared design tokens for the app. Import these instead of hardcoding
 * magic numbers / hex codes so spacing, radius, shadows and type stay
 * consistent across screens.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 17,
  xxl: 20,
  title: 24,
} as const;

const elevatedShadow = (
  opacity: number,
  radiusValue: number,
  elevation: number,
  height = radiusValue / 2,
): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: "#0B1B3A",
      shadowOffset: { width: 0, height },
      shadowOpacity: opacity,
      shadowRadius: radiusValue,
    },
    android: { elevation },
    default: {},
  }) as ViewStyle;

export const shadow = {
  /** Subtle lift for feed cards. */
  card: elevatedShadow(0.06, 10, 2),
  /** Slightly stronger, for headers / floating elements. */
  header: elevatedShadow(0.08, 12, 4),
  /** Pronounced, for modals / FABs. */
  raised: elevatedShadow(0.16, 18, 8),
} as const;

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: fontSize.title, fontWeight: "800", color: colors.text },
  h2: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text },
  title: { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  body: { fontSize: fontSize.base, fontWeight: "400", color: colors.text },
  label: { fontSize: fontSize.md, fontWeight: "600", color: colors.textMuted },
  caption: { fontSize: fontSize.sm, fontWeight: "400", color: colors.gray },
};

export { colors };
