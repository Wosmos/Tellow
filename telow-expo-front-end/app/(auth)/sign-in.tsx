import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ViewBase,
} from 'react-native';
import React from 'react';

import styles from '../../constants/styles';
import SignInWithOAuth from '@/components/SignInWithOAuth';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('opps something went wrong', err.message, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            router.replace('/(auth)/sign-in');
          },
        },
      ]);
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <SafeAreaView style={styles.container}>
        <Text style={[styles.title, { fontSize: 100, fontFamily: 'poppins' }]}>
          Tele
        </Text>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputContainer}>
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
          <View
            style={{
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              marginVertical: 20,
            }}
          />
          <TouchableOpacity style={styles.button} onPress={onSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.buttonText,
              { textAlign: 'center', marginVertical: 10 },
            ]}
          >
            OR
          </Text>
          {/* <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity> */}
          <SignInWithOAuth />
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <Link href='/(auth)/sign-up' style={styles.signupLink}>
            <Text style={styles.signupLinkText}>Sign up</Text>
          </Link>
        </View>
      </SafeAreaView>
    </LinearGradientContainer>
  );
}
