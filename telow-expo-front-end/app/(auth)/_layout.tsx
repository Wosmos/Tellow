import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthRootLayout() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) <Redirect href={'/(call)'} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <Stack>
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
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
