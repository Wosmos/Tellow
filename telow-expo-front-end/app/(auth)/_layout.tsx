// app/(auth)/_layout.tsx
import { StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthLoadingOverlay from '@/components/AuthLoadingOverlay';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isLoading) {
        // Prevent navigation while loading
        e.preventDefault();
      }
    });

    return unsubscribe;
  }, [navigation, isLoading]);

  // Not ready to show content yet
  if (!isLoaded) return null;

  // If signed in, redirect to the main app
  if (isSignedIn) {
    return <Redirect href='/(call)' />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthLoadingOverlay visible={isLoading} />
      <Stack
        screenListeners={{
          transitionStart: () => setIsLoading(true),
          transitionEnd: () => setIsLoading(false),
        }}
      >
        <Stack.Screen
          name='sign-in'
          options={{
            title: 'Sign in to get started',
            headerShown: false,
            statusBarStyle: 'dark',
            statusBarHidden: true,
          }}
        />
        <Stack.Screen
          name='sign-up'
          options={{
            title: 'Create a new account',
            headerBackTitle: 'Sign In',
            headerShown: true,
            statusBarStyle: 'dark',
            statusBarHidden: true,
          }}
        />
        {/* Other stack screens */}
      </Stack>
    </SafeAreaView>
  );
}
