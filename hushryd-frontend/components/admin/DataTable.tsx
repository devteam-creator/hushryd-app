import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { useColorScheme } from '../useColorScheme';

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  onRowPress?: (row: any) => void;
  emptyMessage?: string;
}

export default function DataTable({ columns, data, onRowPress, emptyMessage = 'No data available' }: DataTableProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.headerRow, { backgroundColor: colors.lightGray, borderColor: colors.border }]}>
          {columns.map((column) => (
            <View key={column.key} style={[styles.headerCell, { width: column.width || 120 }]}>
              <Text style={[styles.headerText, { color: colors.text }]}>{column.label}</Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        {data.map((row, rowIndex) => (
          <TouchableOpacity
            key={rowIndex}
            style={[
              styles.dataRow,
              { backgroundColor: rowIndex % 2 === 0 ? colors.card : colors.lightGray, borderColor: colors.border }
            ]}
            onPress={() => onRowPress?.(row)}
            disabled={!onRowPress}
          >
            {columns.map((column) => (
              <View key={column.key} style={[styles.dataCell, { width: column.width || 120 }]}>
                {column.render ? (
                  column.render(row[column.key], row)
                ) : (
                  <Text style={[styles.dataText, { color: colors.text }]} numberOfLines={1}>
                    {row[column.key] !== undefined && row[column.key] !== null ? String(row[column.key]) : '-'}
                  </Text>
                )}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
  },
  headerCell: {
    paddingHorizontal: Spacing.small,
  },
  headerText: {
    fontSize: FontSizes.small,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
  },
  dataCell: {
    paddingHorizontal: Spacing.small,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: FontSizes.small,
  },
  emptyContainer: {
    padding: Spacing.extraLarge,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: FontSizes.extraLarge * 2,
    marginBottom: Spacing.medium,
  },
  emptyText: {
    fontSize: FontSizes.medium,
  },
});

