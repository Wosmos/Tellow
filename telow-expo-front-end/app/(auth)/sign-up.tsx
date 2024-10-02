import * as React from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import Dialog from 'react-native-dialog';
import LinearGradientContainer from '@/components/LinearGradient';
import styles from '@/constants/styles';
import { Colors } from '@/constants/Colors';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleError = (message: string) => {
    setErrorMessage(message);
    setErrorDialogVisible(true);
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors) {
        const errorMessage = err.errors[0]?.message || 'An error occurred';
        handleError(errorMessage);
      }
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      handleError(err.errors[0]?.message || 'Verification failed');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradientContainer
        colors={Colors.bgGradient}
        direction='bottomLeftToTopRight'
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {!pendingVerification ? 'Sign Up' : 'Verify Email'}
          </Text>

          <View style={styles.form}>
            {!pendingVerification ? (
              <View style={styles.inputContainer}>
                <TextInput
                  autoCapitalize='none'
                  value={emailAddress}
                  placeholder='Email...'
                  onChangeText={setEmailAddress}
                  style={styles.input}
                />

                <TextInput
                  value={password}
                  placeholder='Password...'
                  secureTextEntry={true}
                  onChangeText={setPassword}
                  style={styles.input}
                />

                <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  value={code}
                  placeholder='Verification code...'
                  onChangeText={setCode}
                  style={styles.input}
                />

                <TouchableOpacity onPress={onPressVerify} style={styles.button}>
                  <Text style={styles.buttonText}>Verify Email</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <Link href='/(auth)/sign-in' asChild>
                <TouchableOpacity style={styles.signInLink}>
                  <Text style={styles.signInLinkText}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </LinearGradientContainer>

      <Dialog.Container visible={errorDialogVisible}>
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Description>{errorMessage}</Dialog.Description>
        <Dialog.Button
          label='OK'
          onPress={() => setErrorDialogVisible(false)}
        />
      </Dialog.Container>
    </SafeAreaView>
  );
}
