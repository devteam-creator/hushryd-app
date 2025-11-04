import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface Payout {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  method: 'bank_transfer' | 'upi' | 'wallet';
  bankDetails?: string;
  rides: number;
}

export default function PayoutsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'processing'>('all');

  const mockPayouts: Payout[] = [
    {
      id: '1',
      amount: 2450,
      date: '2025-01-15',
      status: 'completed',
      method: 'bank_transfer',
      bankDetails: 'SBI ****1234',
      rides: 6,
    },
    {
      id: '2',
      amount: 1800,
      date: '2025-01-08',
      status: 'completed',
      method: 'upi',
      bankDetails: 'UPI: 9876543210@paytm',
      rides: 4,
    },
    {
      id: '3',
      amount: 3200,
      date: '2025-01-01',
      status: 'completed',
      method: 'bank_transfer',
      bankDetails: 'HDFC ****5678',
      rides: 8,
    },
    {
      id: '4',
      amount: 2100,
      date: '2025-01-22',
      status: 'processing',
      method: 'upi',
      bankDetails: 'UPI: 9876543210@paytm',
      rides: 5,
    },
  ];

  const filteredPayouts = mockPayouts.filter(
    payout => filter === 'all' || payout.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer': return '🏦';
      case 'upi': return '📱';
      case 'wallet': return '💳';
      default: return '💰';
    }
  };

  const totalEarnings = mockPayouts
    .filter(payout => payout.status === 'completed')
    .reduce((sum, payout) => sum + payout.amount, 0);

  const pendingAmount = mockPayouts
    .filter(payout => payout.status === 'pending' || payout.status === 'processing')
    .reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <AdminLayout title="Payouts" currentPage="payouts">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Total Earnings</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>₹{totalEarnings.toLocaleString()}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>⏳</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Pending Amount</Text>
            <Text style={[styles.summaryAmount, { color: '#F59E0B' }]}>₹{pendingAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payout Methods */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payout Methods</Text>
          <View style={styles.methodsList}>
            <View style={styles.methodItem}>
              <Text style={styles.methodIcon}>🏦</Text>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, { color: colors.text }]}>Bank Transfer</Text>
                <Text style={[styles.methodDescription, { color: colors.textSecondary }]}>
                  SBI ****1234 (Primary)
                </Text>
              </View>
              <TouchableOpacity style={[styles.methodButton, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.methodButtonText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.methodItem}>
              <Text style={styles.methodIcon}>📱</Text>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodTitle, { color: colors.text }]}>UPI</Text>
                <Text style={[styles.methodDescription, { color: colors.textSecondary }]}>
                  9876543210@paytm
                </Text>
              </View>
              <TouchableOpacity style={[styles.methodButton, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.methodButtonText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter Payouts</Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'All' },
              { key: 'completed', label: 'Completed' },
              { key: 'processing', label: 'Processing' },
              { key: 'pending', label: 'Pending' },
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

        {/* Payouts List */}
        <View style={styles.payoutsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {filter === 'all' ? 'All Payouts' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Payouts`}
          </Text>
          
          {filteredPayouts.map((payout) => (
            <View
              key={payout.id}
              style={[styles.payoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.payoutHeader}>
                <View style={styles.payoutInfo}>
                  <Text style={styles.payoutIcon}>{getMethodIcon(payout.method)}</Text>
                  <View style={styles.payoutDetails}>
                    <Text style={[styles.payoutAmount, { color: colors.text }]}>
                      ₹{payout.amount.toLocaleString()}
                    </Text>
                    <Text style={[styles.payoutDate, { color: colors.textSecondary }]}>
                      {payout.date} • {payout.rides} rides
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payout.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(payout.status) }]}>
                    {payout.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.payoutFooter}>
                <Text style={[styles.bankDetails, { color: colors.textSecondary }]}>
                  {payout.bankDetails}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Request Payout Button */}
        <View style={styles.requestSection}>
          <TouchableOpacity
            style={[styles.requestButton, { backgroundColor: colors.primary }]}
            onPress={() => {/* Handle request payout */}}
          >
            <LinearGradient
              colors={['#1DA1F2', '#1976D2']}
              style={styles.requestButtonGradient}
            >
              <Text style={styles.requestButtonText}>Request Payout</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  methodsList: {
    gap: Spacing.md,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  methodDescription: {
    fontSize: FontSizes.sm,
  },
  methodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  methodButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
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
  payoutsSection: {
    paddingHorizontal: Spacing.lg,
  },
  payoutCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  payoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  payoutIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  payoutDetails: {
    flex: 1,
  },
  payoutAmount: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  payoutDate: {
    fontSize: FontSizes.sm,
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
  payoutFooter: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E8ECED',
  },
  bankDetails: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  requestSection: {
    padding: Spacing.lg,
  },
  requestButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  requestButtonGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
