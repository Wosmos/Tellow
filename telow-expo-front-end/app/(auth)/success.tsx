import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import LinearGradientContainer from '@/components/LinearGradient';

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
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradientContainer
      colors={Colors.bgGradient}
      direction='bottomLeftToTopRight'
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              width: 100,
              height: 100,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <Ionicons name='checkmark-circle' size={80} color={Colors.success} />
        </Animated.View>
        <Text style={styles.title}>Password Reset Successfully!</Text>
        <Text style={styles.subtitle}>
          You can now sign in with your new password.
        </Text>
      </SafeAreaView>
    </LinearGradientContainer>
  );
}
