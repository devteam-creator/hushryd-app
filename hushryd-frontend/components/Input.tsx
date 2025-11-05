import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useColorScheme } from './useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({ label, error, icon, rightIcon, style, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderColor: error ? colors.error : 'transparent',
            borderWidth: error ? 2 : 0,
          },
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
  },
  icon: {
    marginRight: Spacing.md,
  },
  rightIcon: {
    marginLeft: Spacing.md,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  error: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
});
