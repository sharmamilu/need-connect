import { Feather } from "@expo/vector-icons";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "@/constants/colors";
import AppInput from "./AppInput";

export type FormFieldHandle = {
  /** Plays a horizontal shake — call when the field fails validation. */
  shake: () => void;
};

type FormFieldProps = TextInputProps & {
  icon?: keyof typeof Feather.glyphMap;
  error?: string;
  /** Toggles the eye icon + secure entry automatically when set. */
  isPassword?: boolean;
  secureVisible?: boolean;
  onToggleSecure?: () => void;
};

/**
 * A single labelled input row used across the auth screens.
 * Bundles the icon, password show/hide toggle, animated error text and the
 * shake micro-interaction so every screen stays consistent and tidy.
 */
const FormField = forwardRef<FormFieldHandle, FormFieldProps>(
  (
    { icon, error, isPassword, secureVisible, onToggleSecure, ...inputProps },
    ref,
  ) => {
    const shakeX = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      shake: () => {
        Animated.sequence([
          Animated.timing(shakeX, {
            toValue: 8,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: -8,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: -5,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeX, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
      },
    }));

    return (
      <View style={styles.wrapper}>
        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <AppInput
            icon={icon}
            hasError={!!error}
            secureTextEntry={isPassword ? !secureVisible : inputProps.secureTextEntry}
            rightAdornment={
              isPassword ? (
                <TouchableOpacity
                  onPress={onToggleSecure}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={
                    secureVisible ? "Hide password" : "Show password"
                  }
                >
                  <Feather
                    name={secureVisible ? "eye-off" : "eye"}
                    size={20}
                    color={colors.placeholder}
                  />
                </TouchableOpacity>
              ) : undefined
            }
            {...inputProps}
          />
        </Animated.View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  errorText: {
    color: colors.error,
    fontSize: 12.5,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
});
