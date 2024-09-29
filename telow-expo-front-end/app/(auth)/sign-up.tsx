import * as React from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../constants/styles';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <SafeAreaView
        style={[
          styles.container,
          {
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          },
        ]}
      >
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          {!pendingVerification ? (
            <>
              <TextInput
                style={styles.input}
                autoCapitalize='none'
                value={emailAddress}
                placeholder='Email'
                onChangeText={setEmailAddress}
                keyboardType='email-address'
              />
              <TextInput
                style={styles.input}
                value={password}
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                value={code}
                placeholder='Verification Code'
                onChangeText={setCode}
                keyboardType='number-pad'
              />
              <TouchableOpacity style={styles.button} onPress={onPressVerify}>
                <Text style={styles.buttonText}>Verify Email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Link href='/(auth)/sign-in' style={styles.signInLink}>
            <Text style={styles.signInLinkText}>Sign in</Text>
          </Link>
        </View>
      </SafeAreaView>
    </LinearGradientContainer>
  );
}
