import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
// import { View } from 'expo-blur';
import { commonStyles } from '@/constants/styles';
import { theme } from '@/constants/theme';

export default function VerifyCodeScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');

  const handleVerifyCode = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
      });

      if (result.status === 'needs_new_password') {
        router.push('/(auth)/password-reset');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid code');
    }
  };

  return (
    <View style={commonStyles.container}>
      <View  style={commonStyles.glass}>
        <Text style={commonStyles.title}>Enter Code</Text>
        <Text style={styles.subtitle}>
          We've sent a code to {email}. Enter it below to reset your password.
        </Text>

        <TextInput
          style={commonStyles.input}
          placeholder='Enter code'
          value={code}
          onChangeText={setCode}
          keyboardType='number-pad'
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={commonStyles.button}
          onPress={handleVerifyCode}
        >
          <Text style={commonStyles.buttonText}>Verify Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: theme.colors.error,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
});
