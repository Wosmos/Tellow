const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  bgGradient: ['#1982C4', '#8338EC', '#3BCEAC'],
  error: 'red',
  warning: 'yellow',
  success: 'green',
  gray: '#9BA1A6',
};

// colors.ts

const palette = {
  // Primary colors
  primary: '#3A86FF', // Bright blue
  secondary: '#FF006E', // Vibrant pink
  tertiary: '#FFBE0B', // Sunny yellow

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // Semantic colors
  success: '#8AC926', // Fresh green
  warning: '#FFCA3A', // Warm yellow
  error: '#FF595E', // Soft red
  info: '#1982C4', // Ocean blue

  // Additional accent colors
  accent1: '#8338EC', // Deep purple
  accent2: '#3BCEAC', // Turquoise
};

export const colors = {
  ...palette,

  // Functional color assignments
  background: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray600,
  border: palette.gray300,

  // Component-specific colors
  buttonPrimary: palette.primary,
  buttonSecondary: palette.secondary,
  inputBackground: palette.gray100,
  cardBackground: palette.white,
  navbarBackground: palette.primary,

  // Meeting-specific colors
  participantBackground: palette.gray200,
  chatBackground: palette.gray100,
  controlBarBackground: palette.gray800,
};

export type ColorName = keyof typeof colors;
