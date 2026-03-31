import React, { useCallback, useEffect, useReducer, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import Input from "./Input";
import { reducer } from "../utils/reducers/formReducer";
import { validateInput } from "../utils/actions/formActions";
import { signUp } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { useTheme } from "../constants";

const initialState = {
  inputValues: { firstName: "", lastName: "", email: "", password: "" },
  inputValidities: {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
  },
  formIsValid: false,
};

const SignUpForm = () => {
  const { theme } = useTheme();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState],
  );

  const authHandler = async () => {
    try {
      setError(undefined);
      setLoading(true);
      await dispatch(
        signUp({
          firstName: formState.inputValues.firstName,
          lastName: formState.inputValues.lastName,
          email: formState.inputValues.email,
          password: formState.inputValues.password,
        }),
      );
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [
        { text: "Okay", onPress: () => setError(undefined) },
      ]);
    }
  }, [error]);

  return (
    <>
      {/* First + Last side by side */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            id="firstName"
            label="First Name"
            icon="user-o"
            iconPack={FontAwesome}
            onInputChanged={inputChangedHandler}
            autoCapitalize="none"
            errorText={formState.inputValidities["firstName"]}
          />
        </View>
        <View style={styles.half}>
          <Input
            id="lastName"
            label="Last Name"
            icon="user-o"
            iconPack={FontAwesome}
            onInputChanged={inputChangedHandler}
            autoCapitalize="none"
            errorText={formState.inputValidities["lastName"]}
          />
        </View>
      </View>

      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        onInputChanged={inputChangedHandler}
        keyboardType="email-address"
        autoCapitalize="none"
        errorText={formState.inputValidities["email"]}
      />

      <Input
        id="password"
        label="Password"
        icon="lock"
        autoCapitalize="none"
        secureTextEntry
        iconPack={Feather}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
      />

      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={{ marginTop: 24 }}
        />
      ) : (
        <SubmitButton
          title="Sign Up"
          onPress={authHandler}
          style={{ marginTop: 24, width: "100%" }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
});

export default SignUpForm;
