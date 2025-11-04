import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';
import { useColorScheme } from './useColorScheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    if (variant === 'primary') return ['#00D4FF', '#00AFF5', '#0090D9'] as const;
    if (variant === 'secondary') return ['#0A5C8E', '#084F8D'] as const;
    return ['transparent', 'transparent'] as const;
  };

  const containerStyle: ViewStyle[] = [
    styles.button,
    styles[size],
    ...(fullWidth ? [styles.fullWidth] : []),
    ...(variant === 'outline' ? [{ 
      borderWidth: 2, 
      borderColor: colors.primary,
      backgroundColor: 'transparent',
    }] : []),
    ...(variant === 'ghost' ? [{ 
      backgroundColor: 'transparent',
    }] : []),
    ...((disabled || loading) ? [styles.disabled] : []),
    ...(style ? [style] : []),
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${size}Text`],
    ...(variant === 'primary' ? [{ color: '#FFFFFF' }] : []),
    ...(variant === 'secondary' ? [{ color: '#FFFFFF' }] : []),
    ...(variant === 'outline' ? [{ color: colors.primary }] : []),
    ...(variant === 'ghost' ? [{ color: colors.primary }] : []),
    ...(textStyle ? [textStyle] : []),
  ];

  const getLoadingColor = () => {
    if (textStyle?.color) return textStyle.color as string;
    if (variant === 'outline' || variant === 'ghost') return colors.primary;
    return '#FFFFFF';
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </>
  );

  if (variant === 'primary' || variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[containerStyle, { overflow: 'hidden' }]}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContent}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Shadows.medium,
  },
  gradientContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    minHeight: 36,
  },
  medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 48,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    minHeight: 56,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: FontSizes.sm,
  },
  mediumText: {
    fontSize: FontSizes.md,
  },
  largeText: {
    fontSize: FontSizes.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: Spacing.sm,
    fontSize: 20,
  },
});
