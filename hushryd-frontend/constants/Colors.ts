import { Platform } from 'react-native';

// Currency symbol for Indian Rupee
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

// Legacy HushRyd palette preserved for web
const hushRydLight = {
  text: '#1DA1F2',
  background: '#FFFFFF',
  tint: '#1DA1F2',
  tabIconDefault: '#C4C8CC',
  tabIconSelected: '#1DA1F2',
  primary: '#1DA1F2',
  secondary: '#228B22',
  accent: '#FF8C00',
  success: '#32CD32',
  warning: '#FFC107',
  error: '#E63946',
  border: '#E8ECED',
  card: '#FFFFFF',
  cardBackground: '#F7F9FA',
  textSecondary: '#1DA1F2',
  textTertiary: '#1DA1F2',
  lightGray: '#F7F9FA',
  mediumGray: '#E8ECED',
  darkGray: '#6C7680',
  gradientStart: '#32CD32',
  gradientEnd: '#228B22',
};

const hushRydDark = {
  text: '#1DA1F2',
  background: '#121212',
  tint: '#1DA1F2',
  tabIconDefault: '#6C7680',
  tabIconSelected: '#1DA1F2',
  primary: '#1DA1F2',
  secondary: '#228B22',
  accent: '#FF8C00',
  success: '#32CD32',
  warning: '#FFC107',
  error: '#E63946',
  border: '#2E3135',
  card: '#1E1E1E',
  cardBackground: '#181818',
  textSecondary: '#1DA1F2',
  textTertiary: '#1DA1F2',
  lightGray: '#2E3135',
  mediumGray: '#3A3F47',
  darkGray: '#9CA7B0',
  gradientStart: '#32CD32',
  gradientEnd: '#228B22',
};

// Rapido-inspired palette for native mobile
const hushRydNativeLight = {
  ...hushRydLight,
  cardBackground: '#E6F4EA',
  tint: '#1DA1F2',
  tabIconDefault: hushRydLight.tabIconDefault,
  tabIconSelected: hushRydLight.tabIconSelected,
};

const hushRydNativeDark = {
  ...hushRydDark,
  cardBackground: '#1D2B1F',
};

const platformPalette =
  Platform.OS === 'web'
    ? { light: hushRydLight, dark: hushRydDark }
    : { light: hushRydNativeLight, dark: hushRydNativeDark };

export default platformPalette;
