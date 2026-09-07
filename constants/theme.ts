import { Platform, TextStyle, ViewStyle } from "react-native";
import { colors } from "./colors";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

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

export const shadow: Record<"card" | "header" | "raised", ViewStyle> = {
  card: elevatedShadow(0.06, 10, 2),
  header: elevatedShadow(0.08, 12, 4),
  raised: elevatedShadow(0.16, 18, 8),
};

export const typography: Record<string, TextStyle> = {
  h1: { fontSize: fontSize.title, fontWeight: "800", color: colors.text },
  h2: { fontSize: fontSize.xxl, fontWeight: "800", color: colors.text },
  title: { fontSize: fontSize.xl, fontWeight: "700", color: colors.text },
  body: { fontSize: fontSize.base, fontWeight: "400", color: colors.text },
  label: { fontSize: fontSize.md, fontWeight: "600", color: colors.textMuted },
  caption: { fontSize: fontSize.sm, fontWeight: "400", color: colors.gray },
};

export { colors };
