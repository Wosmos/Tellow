import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import LinearGradientContainer from '@/components/LinearGradient';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LogLevel,
  logLevels,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';

const streamApiKey = process.env.EXPO_PUBLIC_GET_STREAM_API_KEY;

if (!streamApiKey) {
  throw new Error('Missing Stream API Key');
}

export default function CallRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  if (!isSignedIn || !clerkUser || !streamApiKey)
    return <Redirect href={'/(auth)/sign-in'} />;

  const user: User = {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.username || clerkUser.id,
    image: clerkUser.imageUrl,
  };

  const tokenProvider = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/generateUserToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: clerkUser.id,
          name: clerkUser.fullName,
          image: clerkUser.imageUrl,
          email: clerkUser.primaryEmailAddress?.toString()!,
        }),
      }
    );

    const data = await response.json();
    return data.token;
  };

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey: streamApiKey,
    user,
    tokenProvider,
    options: {
      logger: (logLevel: LogLevel, message: string, ...args: unknown[]) => {
        // Implement your logging logic here
        console.log(logLevel, message, ...args);
      },
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StreamVideo client={client}>
        {/* Rest of your component remains the same */}
        <Tabs
          screenOptions={({ route }: { route: { name: string } }) => ({
            header: () => null,
            tabBarActiveTintColor: '#1100ff',
            tabBarInactiveTintColor: '#e8e8ff',
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              borderTopWidth: 0,
              borderTopColor: 'transparent',
              shadowColor: 'transparent',
              height: 60,
              display: route.name === '[id]' ? 'none' : 'flex',
              backgroundColor: '#12002c',
            },
            tabBarLabelStyle: {
              fontSize: 15,
              height: 20,
              borderRadius: 50,
            },
          })}
        >
          <Tabs.Screen
            name='index'
            options={{
              title: 'All Calls',
              header: () => null,
              tabBarIcon: ({ color }) => {
                return <Ionicons name='call-outline' size={24} color={color} />;
              },
            }}
          />
          <Tabs.Screen
            name='[id]'
            options={{
              title: 'All Calls',
              header: () => null,
              tabBarIcon: ({ color }) => {
                return (
                  <LinearGradient
                    style={{
                      backgroundColor: 'transparent',
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 50,
                      width: 50,
                      marginBottom: 35,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 5,
                      elevation: 5,
                    }}
                    colors={Colors.bgGradient}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 30,
                        textAlign: 'center',
                        fontWeight: '900',
                      }}
                    >
                      <Ionicons name='add-outline' size={24} color='white' />
                    </Text>
                  </LinearGradient>
                );
              },
            }}
          />

          <Tabs.Screen
            name='join'
            options={{
              title: 'Join Call',
              headerShown: true,

              headerTitle: 'Join Call',
              tabBarIcon: ({ color }) => {
                return (
                  <Ionicons name='enter-outline' size={24} color={color} />
                );
              },
            }}
          />
        </Tabs>
      </StreamVideo>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
