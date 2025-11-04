import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { realDatabaseService } from '../../services/realDatabaseService';
import { useColorScheme } from '../useColorScheme';

interface DatabaseTableViewerProps {
  tableName: string;
}

export default function DatabaseTableViewer({ tableName }: DatabaseTableViewerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Get table data based on table name
  let tableData: any[] = [];
  let columns: string[] = [];
  
  switch (tableName) {
    case 'admin_users':
      tableData = realDatabaseService.getAllAdminUsers();
      columns = ['id', 'name', 'email', 'role', 'status', 'lastLogin', 'createdAt', 'updatedAt', 'department', 'permissions'];
      break;
    case 'rides':
      tableData = realDatabaseService.getAllRides();
      columns = ['id', 'driverId', 'passengerId', 'from', 'to', 'distance', 'fare', 'status', 'createdAt', 'completedAt'];
      break;
    case 'bookings':
      tableData = realDatabaseService.getAllBookings();
      columns = ['id', 'userId', 'rideId', 'bookingDate', 'status', 'paymentStatus', 'amount'];
      break;
    case 'transactions':
      tableData = realDatabaseService.getAllTransactions();
      columns = ['id', 'userId', 'type', 'amount', 'status', 'description', 'createdAt', 'processedAt'];
      break;
    default:
      return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Table "{tableName}" not found
          </Text>
        </View>
      );
  }

  const renderRow = (item: any, index: number) => (
    <View key={index} style={[styles.row, { backgroundColor: colors.background }]}>
      {columns.map((column) => (
        <View key={column} style={styles.cell}>
          <Text style={[styles.cellText, { color: colors.text }]}>
            {item[column]?.toString() || 'N/A'}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, Shadows.medium]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.tableName, { color: '#FFFFFF' }]}>
          {tableName.toUpperCase()} TABLE
        </Text>
        <Text style={[styles.rowCount, { color: '#FFFFFF' }]}>
          {tableData.length} rows
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={[styles.headerRow, { backgroundColor: colors.lightGray }]}>
            {columns.map((column) => (
              <View key={column} style={styles.headerCell}>
                <Text style={[styles.headerText, { color: colors.text }]}>
                  {column.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {tableData.length > 0 ? (
            tableData.map(renderRow)
          ) : (
            <View style={[styles.emptyRow, { backgroundColor: colors.background }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No data available
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.medium,
    marginVertical: Spacing.small,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
  },
  tableName: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
  },
  rowCount: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  tableContainer: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.small,
  },
  headerCell: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    minWidth: 120,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  headerText: {
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cell: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    minWidth: 120,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  cellText: {
    fontSize: FontSizes.small,
  },
  emptyRow: {
    padding: Spacing.large,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.medium,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: FontSizes.medium,
    textAlign: 'center',
    padding: Spacing.large,
  },
});
