import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useColorScheme } from '../useColorScheme';

interface StatsCardProps {
  icon: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export default function StatsCard({ icon, title, value, subtitle, trend, color }: StatsCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const accentColor = color || colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.medium]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: trend.isPositive ? '#10b981' : '#ef4444' }]}>
            <Text style={styles.trendText}>{trend.value}</Text>
          </View>
        )}
      </View>
      
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    borderWidth: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: FontSizes.large,
  },
  trendBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 2,
    borderRadius: BorderRadius.small,
  },
  trendText: {
    color: '#FFFFFF',
    fontSize: FontSizes.tiny,
    fontWeight: '700',
  },
  value: {
    fontSize: FontSizes.extraLarge,
    fontWeight: '800',
    marginBottom: 2,
  },
  title: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: FontSizes.tiny,
    marginTop: 2,
  },
});

