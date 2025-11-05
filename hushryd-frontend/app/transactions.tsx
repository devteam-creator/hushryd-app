import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  rideId?: string;
}

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'payment' | 'refund' | 'payout'>('all');

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'payment',
      amount: 450,
      date: '2025-01-15',
      description: 'Hyderabad to Vijayawada',
      status: 'completed',
      rideId: 'ride_1',
    },
    {
      id: '2',
      type: 'payout',
      amount: 1200,
      date: '2025-01-14',
      description: 'Weekly payout',
      status: 'completed',
    },
    {
      id: '3',
      type: 'refund',
      amount: 450,
      date: '2025-01-13',
      description: 'Cancelled ride refund',
      status: 'completed',
      rideId: 'ride_2',
    },
    {
      id: '4',
      type: 'payment',
      amount: 600,
      date: '2025-01-12',
      description: 'Hyderabad to Bangalore',
      status: 'pending',
      rideId: 'ride_3',
    },
  ];

  const filteredTransactions = mockTransactions.filter(
    transaction => filter === 'all' || transaction.type === filter
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💰';
      case 'payout': return '💳';
      case 'refund': return '🔄';
      default: return '💰';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <AdminLayout title="Transactions" currentPage="transactions">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Total Payments</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>₹2,150</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>💳</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Total Payouts</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>₹4,200</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter Transactions</Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'All' },
              { key: 'payment', label: 'Payments' },
              { key: 'refund', label: 'Refunds' },
              { key: 'payout', label: 'Payouts' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.lightGray, borderColor: colors.border },
                  filter === item.key && [styles.filterButtonActive, { backgroundColor: colors.primary }],
                ]}
                onPress={() => setFilter(item.key as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: colors.text },
                    filter === item.key && { color: '#FFFFFF' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {filter === 'all' ? 'All Transactions' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Transactions`}
          </Text>
          
          {filteredTransactions.map((transaction) => (
            <View
              key={transaction.id}
              style={[styles.transactionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.transactionHeader}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionIcon}>{getTransactionIcon(transaction.type)}</Text>
                  <View style={styles.transactionDetails}>
                    <Text style={[styles.transactionDescription, { color: colors.text }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                      {transaction.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionAmount}>
                  <Text
                    style={[
                      styles.amountText,
                      { color: transaction.type === 'payout' ? '#10B981' : colors.primary },
                    ]}
                  >
                    {transaction.type === 'payout' ? '+' : '-'}₹{transaction.amount}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </View>
              
              {transaction.rideId && (
                <TouchableOpacity
                  style={styles.rideLink}
                  onPress={() => router.push(`/ride/${transaction.rideId}` as any)}
                >
                  <Text style={[styles.rideLinkText, { color: colors.primary }]}>
                    View Ride Details →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summarySection: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...Shadows.small,
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  filterButtonActive: {
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: Spacing.lg,
  },
  transactionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  transactionDate: {
    fontSize: FontSizes.sm,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rideLink: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E8ECED',
  },
  rideLinkText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
