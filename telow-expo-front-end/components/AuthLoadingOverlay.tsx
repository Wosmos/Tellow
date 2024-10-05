// app/components/AuthLoadingOverlay.tsx
import React from 'react';
import { StyleSheet, Animated, View, ActivityIndicator } from 'react-native';

import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLoadingOverlayProps {
  visible: boolean;
}

const AuthLoadingOverlay: React.FC<AuthLoadingOverlayProps> = ({ visible }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible ) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <View style={styles.content}>
          <ActivityIndicator size='large' color='blue' />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoadingOverlay;
