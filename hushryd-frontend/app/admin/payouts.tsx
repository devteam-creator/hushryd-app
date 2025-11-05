import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

// Mock data
const mockPayouts = [
  { id: 'PO001', userId: 'U123', userName: 'Sarah Smith', userRole: 'driver', amount: 15000, earnings: 17500, platformFee: 2500, status: 'pending', requestDate: '2024-10-11', method: 'Bank Transfer' },
  { id: 'PO002', userId: 'U124', userName: 'Emma Wilson', userRole: 'customer', amount: 8500, earnings: 10000, platformFee: 1500, status: 'completed', requestDate: '2024-10-10', method: 'UPI' },
  { id: 'PO003', userId: 'U125', userName: 'David Lee', userRole: 'driver', amount: 12000, earnings: 14000, platformFee: 2000, status: 'pending', requestDate: '2024-10-11', method: 'Bank Transfer' },
  { id: 'PO004', userId: 'U126', userName: 'Michael Brown', userRole: 'customer', amount: 6500, earnings: 7500, platformFee: 1000, status: 'processing', requestDate: '2024-10-09', method: 'Bank Transfer' },
  { id: 'PO005', userId: 'U127', userName: 'Lisa Wang', userRole: 'driver', amount: 22000, earnings: 25000, platformFee: 3000, status: 'completed', requestDate: '2024-10-08', method: 'Bank Transfer' },
];

export default function PayoutsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);


  const getRoleIcon = (role: string) => {
    return role === 'driver' ? '🚗' : '🚙';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'processing': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleProcessPayout = (payout: any) => {
    setSelectedPayout(payout);
    setShowProcessModal(true);
  };

  const confirmPayout = () => {
    Alert.alert('Success', `Payout ${selectedPayout?.id} has been processed successfully!`);
    setShowProcessModal(false);
    setSelectedPayout(null);
  };

  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'Payout ID',
      width: 100,
      render: (value) => (
        <Text style={[styles.payoutId, { color: colors.primary }]}>{value}</Text>
      ),
    },
    {
      key: 'userName',
      label: 'User',
      width: 180,
      render: (value, row) => (
        <View style={styles.userCell}>
          <Text style={styles.userIcon}>{getRoleIcon(row.userRole)}</Text>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>{row.userRole}</Text>
          </View>
        </View>
      ),
    },
    {
      key: 'earnings',
      label: 'Earnings',
      width: 120,
      render: (value) => (
        <Text style={[styles.amount, { color: colors.text }]}>₹{value.toLocaleString()}</Text>
      ),
    },
    {
      key: 'platformFee',
      label: 'Platform Fee',
      width: 120,
      render: (value) => (
        <Text style={[styles.fee, { color: '#ef4444' }]}>-₹{value.toLocaleString()}</Text>
      ),
    },
    {
      key: 'amount',
      label: 'Payout Amount',
      width: 130,
      render: (value) => (
        <Text style={[styles.payoutAmount, { color: '#10b981' }]}>₹{value.toLocaleString()}</Text>
      ),
    },
    {
      key: 'method',
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
      key: 'requestDate',
      label: 'Request Date',
      width: 120,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 120,
      render: (_, row) => (
        row.status === 'pending' ? (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#10b981' }]}
            onPress={() => handleProcessPayout(row)}
          >
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Process</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
            {row.status === 'completed' ? '✓ Done' : '⏳ Processing'}
          </Text>
        )
      ),
    },
  ];

  const filteredPayouts = mockPayouts.filter(payout => 
    filter === 'all' || payout.status === filter
  );

  const totalPayouts = filteredPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = mockPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const completedPayouts = mockPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminLayout title="Payouts Management" currentPage="payouts">
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={styles.pageHeader}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Payouts Management</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  Process driver and customer earnings
                </Text>
              </View>
              <TouchableOpacity style={[styles.bulkButton, { backgroundColor: colors.primary }]}>
                <Text style={styles.bulkButtonText}>💸 Bulk Process</Text>
              </TouchableOpacity>
            </View>

            {/* Payout Stats */}
            <View style={styles.statsContainer}>
              <StatCard icon="💰" label="Total Payouts" value={`₹${totalPayouts.toLocaleString()}`} color="#8b5cf6" />
              <StatCard icon="⏳" label="Pending" value={`₹${pendingPayouts.toLocaleString()}`} color="#f59e0b" />
              <StatCard icon="✅" label="Completed" value={`₹${completedPayouts.toLocaleString()}`} color="#10b981" />
              <StatCard icon="📊" label="Count" value={filteredPayouts.length.toString()} color="#3b82f6" />
            </View>

            {/* Filters */}
            <View style={[styles.filtersCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
              <View style={styles.filterButtons}>
                <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
                <FilterButton label="Pending" active={filter === 'pending'} onPress={() => setFilter('pending')} />
                <FilterButton label="Processing" active={filter === 'processing'} onPress={() => setFilter('processing')} />
                <FilterButton label="Completed" active={filter === 'completed'} onPress={() => setFilter('completed')} />
              </View>
            </View>

            {/* Payouts Table */}
            <View style={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={filteredPayouts}
                onRowPress={(row) => console.log('Payout clicked:', row)}
                emptyMessage="No payouts found"
              />
            </View>
          </View>
      </ScrollView>

      {/* Process Payout Modal */}
      <Modal visible={showProcessModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.large]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Process Payout</Text>
            
            {selectedPayout && (
              <View style={styles.payoutDetails}>
                <DetailRow label="Payout ID" value={selectedPayout.id} />
                <DetailRow label="User" value={selectedPayout.userName} />
                <DetailRow label="Role" value={selectedPayout.userRole} />
                <DetailRow label="Total Earnings" value={`₹${selectedPayout.earnings.toLocaleString()}`} />
                <DetailRow label="Platform Fee" value={`₹${selectedPayout.platformFee.toLocaleString()}`} />
                <DetailRow label="Payout Amount" value={`₹${selectedPayout.amount.toLocaleString()}`} highlight />
                <DetailRow label="Method" value={selectedPayout.method} />
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.lightGray }]}
                onPress={() => setShowProcessModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#10b981' }]}
                onPress={confirmPayout}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>✓ Confirm Payout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </AdminLayout>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function DetailRow({ label, value, highlight }: DetailRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[
        styles.detailValue, 
        { color: highlight ? '#10b981' : colors.text },
        highlight && styles.highlightValue
      ]}>
        {value}
      </Text>
    </View>
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
  container: { flex: 1 },
  content: { flex: 1 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.small, padding: Spacing.medium },
  backIcon: { fontSize: FontSizes.large },
  backText: { fontSize: FontSizes.medium, fontWeight: '600' },
  main: { flex: 1 },
  mainContent: { padding: Spacing.large },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.large },
  pageTitle: { fontSize: FontSizes.extraLarge * 1.2, fontWeight: '800' },
  pageSubtitle: { fontSize: FontSizes.medium, marginTop: 4 },
  bulkButton: { paddingHorizontal: Spacing.large, paddingVertical: Spacing.medium, borderRadius: BorderRadius.medium },
  bulkButtonText: { color: '#FFFFFF', fontSize: FontSizes.small, fontWeight: '700' },
  statsContainer: { flexDirection: 'row', gap: Spacing.medium, marginBottom: Spacing.large },
  statCard: { flex: 1, padding: Spacing.medium, borderRadius: BorderRadius.medium, borderWidth: 1, alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: BorderRadius.small, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.small },
  statIconText: { fontSize: FontSizes.large },
  statValue: { fontSize: FontSizes.large, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: FontSizes.tiny },
  filtersCard: { padding: Spacing.medium, borderRadius: BorderRadius.medium, borderWidth: 1, marginBottom: Spacing.large },
  filterButtons: { flexDirection: 'row', gap: Spacing.small },
  filterButton: { paddingHorizontal: Spacing.medium, paddingVertical: Spacing.small, borderRadius: BorderRadius.small },
  filterButtonText: { fontSize: FontSizes.small, fontWeight: '600' },
  tableContainer: { marginBottom: Spacing.large },
  payoutId: { fontSize: FontSizes.small, fontWeight: '700' },
  userCell: { flexDirection: 'row', alignItems: 'center', gap: Spacing.small },
  userIcon: { fontSize: FontSizes.medium },
  userName: { fontSize: FontSizes.small, fontWeight: '700' },
  userRole: { fontSize: FontSizes.tiny, textTransform: 'capitalize' },
  amount: { fontSize: FontSizes.small, fontWeight: '700' },
  fee: { fontSize: FontSizes.small, fontWeight: '700' },
  payoutAmount: { fontSize: FontSizes.small, fontWeight: '800' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.tiny, paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSizes.tiny, fontWeight: '700', textTransform: 'capitalize' },
  actionButton: { paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small },
  actionButtonText: { fontSize: FontSizes.tiny, fontWeight: '700' },
  statusLabel: { fontSize: FontSizes.tiny },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.large },
  modalContent: { width: '100%', maxWidth: 500, borderRadius: BorderRadius.large, padding: Spacing.extraLarge },
  modalTitle: { fontSize: FontSizes.extraLarge, fontWeight: '800', marginBottom: Spacing.large, textAlign: 'center' },
  payoutDetails: { gap: Spacing.medium, marginBottom: Spacing.large },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: FontSizes.small, fontWeight: '600' },
  detailValue: { fontSize: FontSizes.small, fontWeight: '700' },
  highlightValue: { fontSize: FontSizes.large },
  modalButtons: { flexDirection: 'row', gap: Spacing.medium },
  modalButton: { flex: 1, padding: Spacing.medium, borderRadius: BorderRadius.medium, alignItems: 'center' },
  modalButtonText: { fontSize: FontSizes.small, fontWeight: '700' },
});

