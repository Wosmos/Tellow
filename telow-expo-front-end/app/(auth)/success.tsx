import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
// import { View } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { commonStyles } from '@/constants/styles';
import { theme } from '@/constants/theme';

export default function SuccessScreen() {
  const router = useRouter();
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/sign-in');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.glass}>
        <Animated.View
          style={[styles.iconContainer, { transform: [{ scale: scaleValue }] }]}
        >
          <Ionicons
            name='checkmark-circle'
            size={80}
            color={theme.colors.success}
          />
        </Animated.View>
        <Text style={styles.title}>Password Reset Successfully!</Text>
        <Text style={styles.subtitle}>
          You can now sign in with your new password.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});
