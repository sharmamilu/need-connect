import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "@/constants/colors";

type AppInputProps = TextInputProps & {
  /** Optional Feather icon shown on the left of the field. */
  icon?: keyof typeof Feather.glyphMap;
  /** Optional element rendered on the right (e.g. a show/hide password button). */
  rightAdornment?: React.ReactNode;
  /** When true, the field renders in its error (red) state. */
  hasError?: boolean;
  containerStyle?: ViewStyle;
};

export default function AppInput({
  icon,
  rightAdornment,
  hasError = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        focused && styles.focused,
        hasError && styles.error,
        containerStyle,
      ]}
    >
      {icon && (
        <Feather
          name={icon}
          size={19}
          color={
            hasError
              ? colors.error
              : focused
                ? colors.primary
                : colors.placeholder
          }
          style={styles.leftIcon}
        />
      )}

      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor={colors.placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />

      {rightAdornment ? (
        <View style={styles.rightAdornment}>{rightAdornment}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  focused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  error: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15.5,
    color: colors.text,
    paddingVertical: 14,
  },
  rightAdornment: {
    marginLeft: 8,
  },
});
