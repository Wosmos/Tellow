import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
// import { View } from 'expo-blur';
import { commonStyles } from '@/constants/styles';
import { theme } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSendCode = async () => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      router.push({
        pathname: '/(auth)/verify-code',
        params: { email },
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to send reset code');
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.glass}>
        <Text style={commonStyles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a code to reset your
          password.
        </Text>

        <TextInput
          style={commonStyles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={commonStyles.button} onPress={handleSendCode}>
          <Text style={commonStyles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back to Sign In</Text>
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
