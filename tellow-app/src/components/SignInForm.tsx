import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import { useAppDispatch } from "../utils/store";
import { useTheme } from "../constants";

const initialState = {
  inputValues: { email: "", password: "" },
  inputValidities: { email: undefined, password: undefined },
  formIsValid: false,
};

const SignInForm = () => {
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

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [
        { text: "Okay", onPress: () => setError(undefined) },
      ]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      await dispatch(
        signIn({
          email: formState.inputValues["email"],
          password: formState.inputValues["password"],
        }),
      );
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail"
        iconPack={Feather}
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["email"]}
      />

      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={Feather}
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"]}
      />

      {/* Forgot password */}
      <View style={styles.forgotRow}>
        <TouchableOpacity>
          <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <SubmitButton
          title="Log In"
          onPress={authHandler}
          style={{ marginTop: 16, width: "100%" }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  forgotRow: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontFamily: "medium",
    fontSize: 13,
  },
});

export default SignInForm;
