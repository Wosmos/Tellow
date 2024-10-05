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
import PasswordInput from '@/components/InputPassword';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [error, setError] = React.useState('');

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
        router.replace('/(call)/');
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

          <PasswordInput value={password} onChangeText={setPassword} />

          {error ? (
            <Text style={{ color: 'red', marginBottom: 16 }}>{error}</Text>
          ) : null}
          <Link
            href='/(auth)/forgot-password'
            // onPress={() => router.push('/(auth)/forgot-password')}
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginBottom: -10,
            }}
          >
            <Text style={{ color: 'white' }}>Forgot Password?</Text>
          </Link>
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

// // import { useSignIn } from '@clerk/clerk-expo';
// // import { Link, useRouter } from 'expo-router';
// // import {
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// //   SafeAreaView,
// // } from 'react-native';
// // import React from 'react';
// // import Dialog from 'react-native-dialog';
// // import SignInWithOAuth from '@/components/SignInWithOAuth';
// // import LinearGradientContainer from '@/components/LinearGradient';
// // import styles from '@/constants/styles';
// // import { Colors } from '@/constants/Colors';

// // export default function SignInScreen() {
// //   const { signIn, setActive, isLoaded } = useSignIn();
// //   const router = useRouter();

// //   const [emailAddress, setEmailAddress] = React.useState('');
// //   const [password, setPassword] = React.useState('');
// //   const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);
// //   const [errorMessage, setErrorMessage] = React.useState('');
// //   const [resetPasswordVisible, setResetPasswordVisible] = React.useState(false);

// //   const handleError = (message: string) => {
// //     setErrorMessage(message);
// //     setErrorDialogVisible(true);
// //   };

// //   const onSignInPress = async () => {
// //     if (!isLoaded) return;

// //     try {
// //       const signInAttempt = await signIn.create({
// //         identifier: emailAddress,
// //         password,
// //       });

// //       if (signInAttempt.status === 'complete') {
// //         await setActive({ session: signInAttempt.createdSessionId });
// //         router.replace('/');
// //       }
// //     } catch (err: any) {
// //       if (err.errors) {
// //         const errorMessage = err.errors[0]?.message || 'An error occurred';
// //         handleError(errorMessage);
// //       }
// //     }
// //   };

// //   const handleResetPassword = async () => {
// //     if (!isLoaded) return;

// //     try {
// //       await signIn.create({
// //         strategy: 'reset_password_email_code',
// //         identifier: emailAddress,
// //       });
// //       setResetPasswordVisible(false);
// //       handleError('Password reset instructions sent to your email');
// //     } catch (err: any) {
// //       handleError(
// //         err.errors[0]?.message || 'Failed to send reset instructions'
// //       );
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={{ flex: 1 }}>
// //       <LinearGradientContainer
// //         colors={Colors.bgGradient}
// //         direction='bottomLeftToTopRight'
// //       >
// //         <View style={styles.container}>
// //           <Text style={styles.title}>Sign In</Text>

// //           <View style={styles.form}>
// //             <View style={styles.inputContainer}>
// //               <TextInput
// //                 autoCapitalize='none'
// //                 value={emailAddress}
// //                 placeholder='Email...'
// //                 onChangeText={setEmailAddress}
// //                 style={styles.input}
// //               />

// //               <TextInput
// //                 value={password}
// //                 placeholder='Password...'
// //                 secureTextEntry={true}
// //                 onChangeText={setPassword}
// //                 style={styles.input}
// //               />
// //             </View>

// //             <TouchableOpacity
// //               onPress={() => setResetPasswordVisible(true)}
// //               style={{ alignSelf: 'flex-end', marginBottom: 15 }}
// //             >
// //               <Text style={styles.signupText}>Forgot Password?</Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity onPress={onSignInPress} style={styles.button}>
// //               <Text style={styles.buttonText}>Sign In</Text>
// //             </TouchableOpacity>

// //             <SignInWithOAuth />

// //             <View style={styles.signupContainer}>
// //               <Text style={styles.signupText}>Don't have an account?</Text>
// //               <Link href='/(auth)/sign-up' asChild>
// //                 <TouchableOpacity style={styles.signupLink}>
// //                   <Text style={styles.signupLinkText}>Sign up</Text>
// //                 </TouchableOpacity>
// //               </Link>
// //             </View>
// //           </View>
// //         </View>
// //       </LinearGradientContainer>

// //       <Dialog.Container visible={errorDialogVisible}>
// //         <Dialog.Title>Error</Dialog.Title>
// //         <Dialog.Description>{errorMessage}</Dialog.Description>
// //         <Dialog.Button
// //           label='OK'
// //           onPress={() => setErrorDialogVisible(false)}
// //         />
// //       </Dialog.Container>

// //       <Dialog.Container visible={resetPasswordVisible}>
// //         <Dialog.Title>Reset Password</Dialog.Title>
// //         <Dialog.Description>
// //           Enter your email to receive password reset instructions.
// //         </Dialog.Description>
// //         <Dialog.Input
// //           value={emailAddress}
// //           onChangeText={setEmailAddress}
// //           placeholder='Email address'
// //         />
// //         <Dialog.Button
// //           label='Cancel'
// //           onPress={() => setResetPasswordVisible(false)}
// //         />
// //         <Dialog.Button label='Send' onPress={handleResetPassword} />
// //       </Dialog.Container>
// //     </SafeAreaView>
// //   );
// // }

// import { useSignIn } from '@clerk/clerk-expo';
// import { Link, useRouter } from 'expo-router';
// import {
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   SafeAreaView,
// } from 'react-native';
// import React from 'react';
// import Dialog from 'react-native-dialog';
// import SignInWithOAuth from '@/components/SignInWithOAuth';
// import LinearGradientContainer from '@/components/LinearGradient';
// import PasswordInputWithEye from '@/components/InputPassword';
// import styles from '@/constants/styles';
// import { Colors } from '@/constants/Colors';

// export default function SignInScreen() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);
//   const [errorMessage, setErrorMessage] = React.useState('');
//   const [resetPasswordVisible, setResetPasswordVisible] = React.useState(false);
//   const [showResetCodeInput, setShowResetCodeInput] = React.useState(false);
//   const [resetCode, setResetCode] = React.useState('');

//   const handleError = (message: string) => {
//     setErrorMessage(message);
//     setErrorDialogVisible(true);
//   };

//   const onSignInPress = async () => {
//     if (!isLoaded) return;

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       if (signInAttempt.status === 'complete') {
//         await setActive({ session: signInAttempt.createdSessionId });
//         router.replace('/');
//       }
//     } catch (err: any) {
//       if (err.errors) {
//         const errorMessage = err.errors[0]?.message || 'An error occurred';
//         handleError(errorMessage);
//       }
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!isLoaded || !emailAddress) {
//       handleError('Please enter your email address');
//       return;
//     }

//     try {
//       await signIn.create({
//         strategy: 'reset_password_email_code',
//         identifier: emailAddress,
//       });
//       setShowResetCodeInput(true);
//       handleError('Reset code sent to your email');
//     } catch (err: any) {
//       handleError(
//         err.errors[0]?.message || 'Failed to send reset instructions'
//       );
//     }
//   };

//   const handleVerifyResetCode = async () => {
//     if (!resetCode) {
//       handleError('Please enter the reset code');
//       return;
//     }
//     try {
//       if (signIn) {
//         await signIn.attemptFirstFactor({
//           strategy: 'reset_password_email_code',
//           code: resetCode,
//         });
//         router.push('/password-reset');
//       } else {
//         throw new Error('Sign-in object is undefined');
//       }
//     } catch (err: any) {
//       handleError(err.errors[0]?.message || 'Invalid reset code');
//     }
//   };

//   return (
//     <LinearGradientContainer
//       colors={Colors.bgGradient}
//       direction='bottomLeftToTopRight'
//     >
//       <SafeAreaView style={styles.container}>
//         <Text style={styles.title}>Sign In</Text>

//         <View style={styles.form}>
//           <TextInput
//             autoCapitalize='none'
//             placeholder='Email...'
//             value={emailAddress}
//             onChangeText={setEmailAddress}
//             style={styles.input}
//           />

//           <PasswordInputWithEye
//             password={password}
//             setPassword={setPassword}
//             placeholder='Password...'
//           />

//           <TouchableOpacity
//             onPress={() => setResetPasswordVisible(true)}
//             style={{ alignSelf: 'flex-end', marginBottom: 15 }}
//           >
//             <Text style={styles.signInText}>Forgot Password?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={onSignInPress} style={styles.button}>
//             <Text style={styles.buttonText}>Sign In</Text>
//           </TouchableOpacity>

//           <SignInWithOAuth />

//           <View style={styles.signupContainer}>
//             <Text style={styles.signupText}>Don't have an account?</Text>
//             <Link href='/sign-up' asChild>
//               <TouchableOpacity style={styles.signupLink}>
//                 <Text style={styles.signupLinkText}>Sign up</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>
//         </View>
//       </SafeAreaView>

//       <Dialog.Container visible={errorDialogVisible}>
//         <Dialog.Title>Error</Dialog.Title>
//         <Dialog.Description>{errorMessage}</Dialog.Description>
//         <Dialog.Button
//           label='OK'
//           onPress={() => setErrorDialogVisible(false)}
//         />
//       </Dialog.Container>

//       <Dialog.Container visible={resetPasswordVisible}>
//         <Dialog.Title>Reset Password</Dialog.Title>
//         {!showResetCodeInput ? (
//           <>
//             <Dialog.Description>
//               Enter your email to receive a reset code.
//             </Dialog.Description>
//             <Dialog.Input
//               value={emailAddress}
//               onChangeText={setEmailAddress}
//               placeholder='Email address'
//             />
//             <Dialog.Button
//               label='Cancel'
//               onPress={() => setResetPasswordVisible(false)}
//             />
//             <Dialog.Button label='Send Code' onPress={handleResetPassword} />
//           </>
//         ) : (
//           <>
//             <Dialog.Description>
//               Enter the reset code sent to your email.
//             </Dialog.Description>
//             <Dialog.Input
//               value={resetCode}
//               onChangeText={setResetCode}
//               placeholder='Reset code'
//             />
//             <Dialog.Button
//               label='Cancel'
//               onPress={() => {
//                 setResetPasswordVisible(false);
//                 setShowResetCodeInput(false);
//               }}
//             />
//             <Dialog.Button
//               label='Verify Code'
//               onPress={handleVerifyResetCode}
//             />
//           </>
//         )}
//       </Dialog.Container>
//     </LinearGradientContainer>
//   );
// }

// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { useSignIn } from '@clerk/clerk-expo';
// import { Link, useRouter } from 'expo-router';
// // import { View } from 'expo-blur';
// import { commonStyles } from '@/constants/styles';
// import { theme } from '@/constants/theme';
// import PasswordInput from '@/components/InputPassword';
// import SocialAuthButtons from '@/components/SignInWithOAuth';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradientContainer from '@/components/LinearGradient';
// import { Colors, colors } from '@/constants/Colors';

// export default function SignInScreen() {
//   const { signIn, isLoaded } = useSignIn();
//   const router = useRouter();
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [error, setError] = React.useState('');

//   const handleSignIn = async () => {
//     if (!isLoaded) return;

//     try {
//       const result = await signIn.create({
//         identifier: email,
//         password,
//       });

//       if (result.status === 'complete') {
//         router.replace('/(call)/');
//       }
//     } catch (err: any) {
//       setError(err.errors?.[0]?.message || 'Sign in failed');
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <LinearGradientContainer
//         colors={Colors.bgGradient}
//         direction='bottomLeftToTopRight'
//       >
//         <View style={commonStyles.container}>
//           <Text style={commonStyles.title}>Welcome Back</Text>

//           <TextInput
//             style={commonStyles.input}
//             placeholder='Email'
//             value={email}
//             onChangeText={setEmail}
//             keyboardType='email-address'
//             autoCapitalize='none'
//           />

//           <PasswordInput value={password} onChangeText={setPassword} />

//           {error ? <Text style={styles.error}>{error}</Text> : null}

//           <TouchableOpacity style={commonStyles.button} onPress={handleSignIn}>
//             <Text style={commonStyles.buttonText}>Sign In</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={() => router.push('/(auth)/forgot-password')}
//             style={styles.forgotPassword}
//           >
//             <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//           </TouchableOpacity>

//           <SocialAuthButtons />

//           <View style={styles.signUpContainer}>
//             <Text style={styles.signUpText}>Don't have an account? </Text>
//             <Link href='/sign-up' asChild>
//               <TouchableOpacity>
//                 <Text style={styles.signUpLink}>Sign Up</Text>
//               </TouchableOpacity>
//             </Link>
//           </View>
//         </View>
//       </LinearGradientContainer>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   error: {
//     color: theme.colors.error,
//     marginBottom: 16,
//   },
//   forgotPassword: {
//     alignSelf: 'flex-end',
//     marginTop: 8,
//     marginBottom: 24,
//   },
//   forgotPasswordText: {
//     color: theme.colors.primary,
//   },
//   signUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 24,
//   },
//   signUpText: {
//     color: theme.colors.text,
//   },
//   signUpLink: {
//     color: theme.colors.primary,
//     fontWeight: '600',
//   },
// });
