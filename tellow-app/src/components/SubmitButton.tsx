import React from "react";
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from "react-native";
import { useTheme } from "../constants";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle;
};

const SubmitButton = (props: Props) => {
  const { theme } = useTheme();
  const bgColor = props.disabled
    ? theme.colors.border
    : props.color || theme.colors.primary;

  return (
    <TouchableOpacity
      onPress={props.disabled ? () => {} : props.onPress}
      style={[styles.button, props.style, { backgroundColor: bgColor }]}
      activeOpacity={0.75}
    >
      <Text
        style={[
          styles.text,
          { color: props.disabled ? theme.colors.textSecondary : "#fff" },
        ]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "medium",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

export default SubmitButton;
