import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useColorScheme } from './useColorScheme';

interface TimeslotFilterProps {
  selectedFilter: 'all' | 'early-morning' | 'morning' | 'late-morning' | 'afternoon' | 'evening' | 'late-evening' | 'night';
  onFilterChange: (filter: 'all' | 'early-morning' | 'morning' | 'late-morning' | 'afternoon' | 'evening' | 'late-evening' | 'night') => void;
}

export default function TimeslotFilter({ selectedFilter, onFilterChange }: TimeslotFilterProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const filters = [
    { key: 'all', label: 'All Times', icon: '🕐' },
    { key: 'early-morning', label: '4-7AM', icon: '🌄' },
    { key: 'morning', label: '7-10AM', icon: '🌅' },
    { key: 'late-morning', label: '10-1PM', icon: '☀️' },
    { key: 'afternoon', label: '1-4PM', icon: '🌞' },
    { key: 'evening', label: '4-7PM', icon: '🌆' },
    { key: 'late-evening', label: '7-10PM', icon: '🌇' },
    { key: 'night', label: '10-1AM', icon: '🌙' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedFilter === filter.key && [
                styles.filterButtonActive,
                { backgroundColor: colors.primary, borderColor: colors.primary },
              ],
            ]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterText,
                { color: colors.text },
                selectedFilter === filter.key && { color: '#FFFFFF' },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    borderWidth: 2,
  },
  filterIcon: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});
