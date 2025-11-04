// HushRyd-inspired color scheme with green background and Twitter blue text
const tintColorLight = '#1DA1F2'; // Twitter blue
const tintColorDark = '#1DA1F2'; // Twitter blue

// Currency symbol for Indian Rupee
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

export default {
  light: {
    text: '#1DA1F2', // Twitter blue for text
    background: '#FFFFFF', // White background
    tint: tintColorLight,
    tabIconDefault: '#C4C8CC',
    tabIconSelected: tintColorLight,
    primary: '#1DA1F2', // Twitter blue as primary
    secondary: '#228B22', // Forest Green (darker variant)
    accent: '#FF8C00', // Orange for highlights
    success: '#32CD32', // Lime Green
    warning: '#FFC107',
    error: '#E63946',
    border: '#E8ECED',
    card: '#FFFFFF',
    cardBackground: '#F7F9FA',
    textSecondary: '#1DA1F2', // Twitter blue for secondary text
    textTertiary: '#1DA1F2', // Twitter blue for tertiary text
    lightGray: '#F7F9FA',
    mediumGray: '#E8ECED',
    darkGray: '#6C7680',
    gradientStart: '#32CD32',
    gradientEnd: '#228B22',
  },
  dark: {
    text: '#1DA1F2', // Twitter blue for text
    background: '#121212', // Dark background for dark mode
    tint: tintColorDark,
    tabIconDefault: '#6C7680',
    tabIconSelected: tintColorDark,
    primary: '#1DA1F2', // Twitter blue as primary
    secondary: '#228B22',
    accent: '#FF8C00',
    success: '#32CD32',
    warning: '#FFC107',
    error: '#E63946',
    border: '#2E3135',
    card: '#1E1E1E',
    cardBackground: '#181818',
    textSecondary: '#1DA1F2', // Twitter blue for secondary text
    textTertiary: '#1DA1F2', // Twitter blue for tertiary text
    lightGray: '#2E3135',
    mediumGray: '#3A3F47',
    darkGray: '#9CA7B0',
    gradientStart: '#32CD32',
    gradientEnd: '#228B22',
  },
};
