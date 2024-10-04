// import React from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import { Text, View, TouchableOpacity } from 'react-native';
// import { Link } from 'expo-router';
// import { useOAuth } from '@clerk/clerk-expo';
// import * as Linking from 'expo-linking';
// import styles from '../constants/styles';
// export const useWarmUpBrowser = () => {
//   React.useEffect(() => {
//     // Warm up the android browser to improve UX
//     // https://docs.expo.dev/guides/authentication/#improving-user-experience
//     void WebBrowser.warmUpAsync();
//     return () => {
//       void WebBrowser.coolDownAsync();
//     };
//   }, []);
// };

// WebBrowser.maybeCompleteAuthSession();

// const SignInWithOAuth = () => {
//   useWarmUpBrowser();

//   const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

//   const onPress = React.useCallback(async () => {
//     try {
//       const { createdSessionId, signIn, signUp, setActive } =
//         await startOAuthFlow({
//           redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
//         });

//       if (createdSessionId) {
//         setActive!({ session: createdSessionId });
//       } else {
//         // Use signIn or signUp for next steps such as MFA

//       }
//     } catch (err) {
//       console.error('OAuth error', err);
//     }
//   }, []);

//   return (
//     <TouchableOpacity onPress={onPress} style={styles.button}>
//       <Text style={styles.buttonText}>Sign in with Google</Text>
//     </TouchableOpacity>
//   );
// };

// export default SignInWithOAuth;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import * as WebBrowser from 'expo-web-browser';
import style from '@/constants/styles';
import Ionicons from '@expo/vector-icons/Ionicons';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: 'oauth_facebook',
  });
  const { startOAuthFlow: instagramAuth } = useOAuth({
    strategy: 'oauth_instagram',
  });

  const onSelectAuth = useCallback(
    async (authType: string) => {
      try {
        let authFunction;
        switch (authType) {
          case 'google':
            authFunction = googleAuth;
            break;
          case 'facebook':
            authFunction = facebookAuth;
            break;
          case 'instagram':
            authFunction = instagramAuth;
            break;
          default:
            return;
        }

        if (authFunction) {
          const { createdSessionId, setActive } = await authFunction();

          if (createdSessionId && setActive) {
            setActive({ session: createdSessionId });
          }
        }
      } catch (err) {
        console.error('OAuth error:', err);
      }
    },
    [googleAuth, facebookAuth, instagramAuth]
  );

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          onPress={() => onSelectAuth('google')}
          style={[style.button, styles.socialButton]}
        >
          <Ionicons
            name='logo-google'
            size={30}
            color='#FFFFFF'
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectAuth('facebook')}
          style={[style.button, styles.socialButton]}
        >
          {/* <Text style={style.buttonText}>Facebook</Text> */}
          <Ionicons
            name='logo-facebook'
            size={30}
            color='#FFFFFF'
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectAuth('instagram')}
          style={[style.button, styles.socialButton]}
        >
          {/* <Text style={style.buttonText}>Instagram</Text> */}
          <Ionicons
            name='logo-instagram'
            size={30}
            color='#FFFFFF'
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e9ff',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#e4e9ff',
    fontSize: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  socialButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  icon: {},
});

export default SignInWithOAuth;
