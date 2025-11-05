import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

// Mock data
const mockTransactions = [
  { id: 'TXN001', bookingId: 'BK12458', type: 'booking', amount: 1850, status: 'completed', paymentMethod: 'UPI', date: '2024-10-11 14:30', user: 'John Doe' },
  { id: 'TXN002', bookingId: 'BK12459', type: 'booking', amount: 2500, status: 'completed', paymentMethod: 'Card', date: '2024-10-11 13:15', user: 'Sarah Smith' },
  { id: 'TXN003', bookingId: 'BK12460', type: 'refund', amount: 1200, status: 'completed', paymentMethod: 'UPI', date: '2024-10-11 12:45', user: 'Mike Johnson' },
  { id: 'TXN004', bookingId: 'BK12461', type: 'payout', amount: 15000, status: 'pending', paymentMethod: 'Bank Transfer', date: '2024-10-11 11:30', user: 'Driver: Emma' },
  { id: 'TXN005', bookingId: 'BK12462', type: 'booking', amount: 3200, status: 'failed', paymentMethod: 'Card', date: '2024-10-11 10:20', user: 'David Lee' },
  { id: 'TXN006', bookingId: 'BK12463', type: 'booking', amount: 1750, status: 'completed', paymentMethod: 'Wallet', date: '2024-10-11 09:15', user: 'Lisa Wang' },
  { id: 'TXN007', bookingId: 'BK12464', type: 'platform_fee', amount: 250, status: 'completed', paymentMethod: 'Auto', date: '2024-10-11 08:45', user: 'System' },
];

export default function TransactionsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'booking' | 'refund' | 'payout'>('all');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => router.replace('/(tabs)/' as any) },
    ]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking': return '💳';
      case 'refund': return '↩️';
      case 'payout': return '💸';
      case 'platform_fee': return '💰';
      default: return '💵';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking': return '#10b981';
      case 'refund': return '#f59e0b';
      case 'payout': return '#3b82f6';
      case 'platform_fee': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'Transaction ID',
      width: 120,
      render: (value) => (
        <Text style={[styles.transactionId, { color: colors.primary }]}>{value}</Text>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      width: 140,
      render: (value) => (
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(value) + '20' }]}>
          <Text style={styles.typeBadgeIcon}>{getTypeIcon(value)}</Text>
          <Text style={[styles.typeBadgeText, { color: getTypeColor(value) }]}>
            {value.replace('_', ' ')}
          </Text>
        </View>
      ),
    },
    {
      key: 'user',
      label: 'User',
      width: 150,
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 120,
      render: (value) => (
        <Text style={[styles.amount, { color: colors.text }]}>₹{value.toLocaleString()}</Text>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Method',
      width: 130,
    },
    {
      key: 'status',
      label: 'Status',
      width: 110,
      render: (value) => (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(value) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(value) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(value) }]}>{value}</Text>
        </View>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      width: 150,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 100,
      render: (value, row) => (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => console.log('View transaction:', row)}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
      ),
    },
  ];

  const filteredTransactions = mockTransactions.filter(txn => 
    filter === 'all' || txn.type === filter
  );

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const completedAmount = filteredTransactions.filter(t => t.status === 'completed').reduce((sum, txn) => sum + txn.amount, 0);
  const pendingAmount = filteredTransactions.filter(t => t.status === 'pending').reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <AdminLayout title="Transactions" currentPage="transactions">
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={styles.pageHeader}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Transactions</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  View and manage all financial transactions
                </Text>
              </View>
              <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.exportButtonText}>📊 Export</Text>
              </TouchableOpacity>
            </View>

            {/* Financial Stats */}
            <View style={styles.statsContainer}>
              <StatCard icon="💰" label="Total Volume" value={`₹${totalAmount.toLocaleString()}`} color="#8b5cf6" />
              <StatCard icon="✅" label="Completed" value={`₹${completedAmount.toLocaleString()}`} color="#10b981" />
              <StatCard icon="⏳" label="Pending" value={`₹${pendingAmount.toLocaleString()}`} color="#f59e0b" />
              <StatCard icon="📊" label="Count" value={filteredTransactions.length.toString()} color="#3b82f6" />
            </View>

            {/* Filters */}
            <View style={[styles.filtersCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
              <View style={styles.filterButtons}>
                <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
                <FilterButton label="Bookings" active={filter === 'booking'} onPress={() => setFilter('booking')} />
                <FilterButton label="Refunds" active={filter === 'refund'} onPress={() => setFilter('refund')} />
                <FilterButton label="Payouts" active={filter === 'payout'} onPress={() => setFilter('payout')} />
              </View>
            </View>

            {/* Transactions Table */}
            <View style={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={filteredTransactions}
                onRowPress={(row) => console.log('Transaction clicked:', row)}
                emptyMessage="No transactions found"
              />
            </View>
          </View>
      </ScrollView>
    </AdminLayout>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIconText}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterButton({ label, active, onPress }: FilterButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: active ? colors.primary : colors.lightGray }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, { color: active ? '#FFFFFF' : colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
    padding: Spacing.medium,
  },
  backIcon: {
    fontSize: FontSizes.large,
  },
  backText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  main: {
    flex: 1,
  },
  mainContent: {
    padding: Spacing.large,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  pageTitle: {
    fontSize: FontSizes.extraLarge * 1.2,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: FontSizes.medium,
    marginTop: 4,
  },
  exportButton: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginBottom: Spacing.large,
  },
  statCard: {
    flex: 1,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.small,
  },
  statIconText: {
    fontSize: FontSizes.large,
  },
  statValue: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.tiny,
  },
  filtersCard: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    marginBottom: Spacing.large,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.small,
  },
  filterButton: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.small,
  },
  filterButtonText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  tableContainer: {
    marginBottom: Spacing.large,
  },
  transactionId: {
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.tiny,
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  typeBadgeIcon: {
    fontSize: FontSizes.tiny,
  },
  typeBadgeText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.tiny,
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actionButton: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
  },
  actionButtonText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
  },
});

