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
import { styles } from '@/constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';

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
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          style={styles.input}
          placeholder='Enter the email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        {error ? <Text style={{}}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.signupContainer}
        >
          <Text style={styles.signInLinkText}>Back to Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradientContainer>
  );
}
