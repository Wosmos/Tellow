import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from '@/constants/styles';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <SafeAreaView  style={styles.container}>
        <Text style={styles.title}>Enter Code</Text>
        <Text style={styles.subtitle}>
          We've sent a code to {email}. Enter it below to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder='Enter code'
          value={code}
          onChangeText={setCode}
          keyboardType='number-pad'
        />

        {error ? <Text style={{
          color: 'red', marginBottom: 16
        }}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerifyCode}
        >
          <Text style={styles.buttonText}>Verify Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.signupContainer}
        >
          <Text style={styles.signInLinkText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    
    </LinearGradientContainer>
  );
}
