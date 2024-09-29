import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

type GradientDirection =
  | 'leftToRight'
  | 'rightToLeft'
  | 'topToBottom'
  | 'bottomToTop'
  | 'topLeftToBottomRight'
  | 'bottomRightToTopLeft'
  | 'topRightToBottomLeft'
  | 'bottomLeftToTopRight';

interface GradientPoint {
  x: number;
  y: number;
}

const gradientDirections: Record<
  GradientDirection,
  { start: GradientPoint; end: GradientPoint }
> = {
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  topLeftToBottomRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  bottomRightToTopLeft: { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } },
  topRightToBottomLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  bottomLeftToTopRight: { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
};

interface LinearGradientContainerProps {
  children: React.ReactNode;
  colors: string[];
  direction?: GradientDirection;
  style?: ViewStyle;
}

export default function LinearGradientContainer({
  children,
  colors,
  direction = 'leftToRight',
  style,
}: LinearGradientContainerProps) {
  const { start, end } = gradientDirections[direction];

  return (
    <View style={[styles.container, style]}>
      <ExpoLinearGradient
        colors={colors}
        start={start}
        end={end}
        style={styles.gradient}
      >
        {children}
      </ExpoLinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
