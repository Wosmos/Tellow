// import * as React from 'react';
// import {
//   TextInput,
//   Text,
//   TouchableOpacity,
//   View,
//   SafeAreaView,
// } from 'react-native';
// import { useSignIn } from '@clerk/clerk-expo';
// import { useRouter } from 'expo-router';
// import Dialog from 'react-native-dialog';
// import LinearGradientContainer from '@/components/LinearGradient';
// import styles from '@/constants/styles';
// import { Colors } from '@/constants/Colors';

// export default function ResetPasswordScreen() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [password, setPassword] = React.useState('');
//   const [code, setCode] = React.useState('');
//   const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);
//   const [errorMessage, setErrorMessage] = React.useState('');

//   const handleError = (message: string) => {
//     setErrorMessage(message);
//     setErrorDialogVisible(true);
//   };

//   const onResetPassword = async () => {
//     if (!isLoaded) return;

//     try {
//       const result = await signIn.attemptFirstFactor({
//         strategy: 'reset_password_email_code',
//         code,
//         password,
//       });

//       if (result.status === 'complete') {
//         await setActive({ session: result.createdSessionId });
//         router.push('/');
//       }
//     } catch (err: any) {
//       handleError(err.errors?.[0]?.message || 'Failed to reset password');
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <LinearGradientContainer
//         colors={Colors.bgGradient}
//         direction='bottomLeftToTopRight'
//       >
//         <View style={styles.container}>
//           <Text style={styles.title}>Reset Password</Text>

//           <View style={styles.form}>
//             <View style={styles.inputContainer}>
//               <TextInput
//                 value={code}
//                 placeholder='Verification code...'
//                 onChangeText={setCode}
//                 style={styles.input}
//               />

//               <TextInput
//                 value={password}
//                 placeholder='New password...'
//                 secureTextEntry={true}
//                 onChangeText={setPassword}
//                 style={styles.input}
//               />

//               <TouchableOpacity onPress={onResetPassword} style={styles.button}>
//                 <Text style={styles.buttonText}>Reset Password</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </LinearGradientContainer>

//       <Dialog.Container visible={errorDialogVisible}>
//         <Dialog.Title>Error</Dialog.Title>
//         <Dialog.Description>{errorMessage}</Dialog.Description>
//         <Dialog.Button
//           label='OK'
//           onPress={() => setErrorDialogVisible(false)}
//         />
//       </Dialog.Container>
//     </SafeAreaView>
//   );
// }

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

import { styles } from '@/constants/styles';
import PasswordInput from '@/components/InputPassword';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';

const PasswordStrengthIndicator = ({ strength }: { strength: number }) => {
  const getColor = (index: number) => {
    if (index < strength) {
      switch (strength) {
        case 1:
          return Colors.error;
        case 2:
          return Colors.warning;
        case 3:
          return Colors.success;
        default:
          return Colors.gray;
      }
    }
    return Colors.gray;
  };

  return (
    <View style={strengthStyles.container}>
      <View style={strengthStyles.barsContainer}>
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            style={[strengthStyles.bar, { backgroundColor: getColor(index) }]}
          />
        ))}
      </View>
      <Text style={styles.buttonText}>
        {strength === 0 && 'Enter password'}
        {strength === 1 && 'Weak'}
        {strength === 2 && 'Good'}
        {strength === 3 && 'Strong'}
      </Text>
    </View>
  );
};

const checkPasswordStrength = (password: string): number => {
  if (password.length === 0) return 0;

  let strength = 0;

  // Check length
  if (password.length >= 8) strength++;

  // Check for mixed case characters
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;

  // Check for numbers and special characters
  if (/\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password))
    strength++;

  return strength;
};
export default function ResetPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const handleResetPassword = async () => {
    if (!isLoaded) return;

    if (passwordStrength < 2) {
      setError('Please choose a stronger password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await signIn.resetPassword({
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/(auth)/success');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          (err as { errors?: { message: string }[] }).errors?.[0]?.message ||
            'Failed to reset password'
        );
      } else {
        setError('Failed to reset password');
      }
    }
  };
  return (
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>

        <View style={styles.inputContainer}>
          <PasswordInput
            value={password}
            onChangeText={handlePasswordChange}
            placeholder='New Password'
          />
          <PasswordStrengthIndicator strength={passwordStrength} />

          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder='Confirm Password'
          />
        </View>

        {error ? (
          <Text
            style={{
              color: 'red',
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </LinearGradientContainer>
  );
}

const strengthStyles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  bar: {
    height: 4,
    width: '30%',
    backgroundColor: 'gray',
    marginRight: 4,
    borderRadius: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
});
