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
import { BlurView } from 'expo-blur';
import { commonStyles } from '@/constants/styles';
import { theme } from '@/constants/theme';
import PasswordInput from '@/components/InputPassword';

export default function ResetPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleResetPassword = async () => {
    if (!isLoaded) return;
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
        router.push('/success');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to reset password');
    }
  };

  return (
    <View style={commonStyles.container}>
      <BlurView intensity={80} style={commonStyles.glass}>
        <Text style={commonStyles.title}>Reset Password</Text>

        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder='New password'
        />

        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder='Confirm new password'
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={commonStyles.button}
          onPress={handleResetPassword}
        >
          <Text style={commonStyles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: theme.colors.error,
    marginBottom: 16,
  },
});