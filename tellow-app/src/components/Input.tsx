import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from "react-native";
import { useTheme } from "../constants";

type Props = TextInputProps & {
  id: string;
  label: string;
  icon?: any;
  iconPack?: any;
  iconSize?: number;
  errorText: string[] | undefined;
  onInputChanged: (inputId: string, inputValue: string) => void;
  initialValue?: string;
};

const Input = (props: Props) => {
  const { theme } = useTheme();
  const IconPack = props.iconPack;
  const [value, setValue] = useState(props.initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const onChangeText = (text: string) => {
    setValue(text);
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {props.label}
      </Text>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: theme.colors.inputBg },
          isFocused && { borderColor: theme.colors.primary },
        ]}
      >
        {IconPack && props.icon && (
          <IconPack
            name={props.icon}
            size={props.iconSize || 18}
            color={theme.colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          onChangeText={onChangeText}
          value={value}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {props.errorText && (
        <Text style={[styles.error, { color: theme.colors.red }]}>
          {props.errorText[0]}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 6,
  },
  label: {
    fontFamily: "medium",
    fontSize: 13,
    marginBottom: 8,
    marginTop: 14,
  },
  inputRow: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    height: 52,
    fontFamily: "regular",
    fontSize: 15,
    paddingTop: 0,
  },
  icon: {
    marginRight: 12,
  },
  error: {
    fontSize: 12,
    fontFamily: "regular",
    marginTop: 4,
  },
});

export default Input;
