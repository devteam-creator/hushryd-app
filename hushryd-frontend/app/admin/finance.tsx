import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatsCard from '../../components/admin/StatsCard';
import { useColorScheme } from '../../components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { AdminRole } from '../../types/models';

const mockAdmin = {
  id: '1',
  name: 'Super Admin',
  email: 'superadmin@hushryd.com',
  role: 'superadmin' as AdminRole,
};

const recentTransactions = [
  { id: 'TXN001', date: '2025-01-15', type: 'Booking', amount: 900, status: 'completed' },
  { id: 'TXN002', date: '2025-01-15', type: 'Payout', amount: -650, status: 'completed' },
  { id: 'TXN003', date: '2025-01-14', type: 'Booking', amount: 1040, status: 'completed' },
  { id: 'TXN004', date: '2025-01-14', type: 'Refund', amount: -450, status: 'pending' },
  { id: 'TXN005', date: '2025-01-13', type: 'Booking', amount: 460, status: 'completed' },
];

export default function AdminFinanceScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    router.replace('/(tabs)/' as any);
  };

  const columns = [
    { key: 'id', label: 'Transaction ID', width: 120 },
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount', render: (value: any, row: any) => (
      <Text style={{ color: value >= 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
        {value >= 0 ? '+' : ''}{CURRENCY_SYMBOL}{Math.abs(value)}
      </Text>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: any) => (
      <View style={[styles.statusBadge, { backgroundColor: value === 'completed' ? '#10b981' : '#f59e0b' }]}>
        <Text style={styles.statusText}>{value}</Text>
      </View>
    )},
  ];

  return (
    <AdminLayout title="Finance Management" currentPage="finance">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Revenue, transactions, and payouts</Text>
        </View>

        {/* Financial Stats */}
        <View style={styles.statsGrid}>
          <StatsCard icon="💰" title="Total Revenue" value="₹24.5M" trend={{ value: '+28%', isPositive: true }} color="#10b981" />
          <StatsCard icon="💳" title="This Month" value="₹2.4M" trend={{ value: '+23%', isPositive: true }} color="#3b82f6" />
          <StatsCard icon="💸" title="Total Payouts" value="₹18.2M" color="#f59e0b" />
          <StatsCard icon="📊" title="Net Profit" value="₹6.3M" trend={{ value: '+35%', isPositive: true }} color="#8b5cf6" />
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/admin/transactions')}
          >
            <Text style={styles.actionIcon}>💳</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Transactions</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>View all</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/admin/payouts')}
          >
            <Text style={styles.actionIcon}>💸</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Payouts</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Process</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Reports</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Generate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Text style={styles.actionIcon}>↩️</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Refunds</Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>Process</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
        <View style={[styles.tableCard, { backgroundColor: colors.card }]}>
          <DataTable
            columns={columns}
            data={recentTransactions}
            onRowPress={(txn) => console.log('Transaction pressed:', txn)}
          />
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flex: 1,
    minWidth: 150,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  actionIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  actionSubtitle: {
    fontSize: FontSizes.sm,
  },
  tableCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

