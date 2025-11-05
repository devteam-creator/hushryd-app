import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';

// Mock data
const mockVerifications = [
  { id: 'V001', userId: 'U123', userName: 'John Doe', type: 'vehicle', documentType: 'registration', status: 'pending', submittedDate: '2024-10-11', userRole: 'driver', details: 'Toyota Prius - DL5CAP1234' },
  { id: 'V002', userId: 'U124', userName: 'Sarah Smith', type: 'license', documentType: 'drivers_license', status: 'pending', submittedDate: '2024-10-11', userRole: 'driver', details: 'DL-123456789' },
  { id: 'V003', userId: 'U125', userName: 'Mike Johnson', type: 'vehicle', documentType: 'insurance', status: 'approved', submittedDate: '2024-10-10', userRole: 'customer', details: 'Mercedes E-Class - HR26AB1234' },
  { id: 'V004', userId: 'U126', userName: 'Emma Wilson', type: 'user', documentType: 'id_card', status: 'pending', submittedDate: '2024-10-10', userRole: 'passenger', details: 'Aadhaar Card' },
  { id: 'V005', userId: 'U127', userName: 'David Lee', type: 'vehicle', documentType: 'registration', status: 'rejected', submittedDate: '2024-10-09', userRole: 'driver', details: 'Honda City - MH01AB1234' },
];

export default function VerificationsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);


  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return '🚗';
      case 'license': return '🪪';
      case 'user': return '👤';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vehicle': return '#3b82f6';
      case 'license': return '#8b5cf6';
      case 'user': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleReview = (verification: any) => {
    setSelectedVerification(verification);
    setShowReviewModal(true);
  };

  const handleApprove = () => {
    Alert.alert('Success', `Verification ${selectedVerification?.id} has been approved!`);
    setShowReviewModal(false);
    setSelectedVerification(null);
  };

  const handleReject = () => {
    Alert.alert('Rejected', `Verification ${selectedVerification?.id} has been rejected.`);
    setShowReviewModal(false);
    setSelectedVerification(null);
  };

  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'Request ID',
      width: 100,
      render: (value) => (
        <Text style={[styles.requestId, { color: colors.primary }]}>{value}</Text>
      ),
    },
    {
      key: 'userName',
      label: 'User',
      width: 180,
      render: (value, row) => (
        <View style={styles.userCell}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={styles.avatarText}>{value[0]}</Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>{row.userRole}</Text>
          </View>
        </View>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      width: 130,
      render: (value) => (
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(value) + '20' }]}>
          <Text style={styles.typeBadgeIcon}>{getTypeIcon(value)}</Text>
          <Text style={[styles.typeBadgeText, { color: getTypeColor(value) }]}>
            {value}
          </Text>
        </View>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      width: 200,
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
      key: 'submittedDate',
      label: 'Submitted',
      width: 120,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 120,
      render: (_, row) => (
        row.status === 'pending' ? (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleReview(row)}
          >
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Review</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>
            {row.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
          </Text>
        )
      ),
    },
  ];

  const filteredVerifications = mockVerifications.filter(v => 
    filter === 'all' || v.status === filter
  );

  const pendingCount = mockVerifications.filter(v => v.status === 'pending').length;
  const approvedCount = mockVerifications.filter(v => v.status === 'approved').length;
  const rejectedCount = mockVerifications.filter(v => v.status === 'rejected').length;

  return (
    <AdminLayout title="Verifications" currentPage="verifications">
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={styles.pageHeader}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Verifications</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  Review and approve user verifications
                </Text>
              </View>
            </View>

            {/* Verification Stats */}
            <View style={styles.statsContainer}>
              <StatCard icon="⏳" label="Pending" value={pendingCount.toString()} color="#f59e0b" />
              <StatCard icon="✅" label="Approved" value={approvedCount.toString()} color="#10b981" />
              <StatCard icon="✗" label="Rejected" value={rejectedCount.toString()} color="#ef4444" />
              <StatCard icon="📊" label="Total" value={mockVerifications.length.toString()} color="#3b82f6" />
            </View>

            {/* Filters */}
            <View style={[styles.filtersCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
              <View style={styles.filterButtons}>
                <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
                <FilterButton label="Pending" active={filter === 'pending'} onPress={() => setFilter('pending')} />
                <FilterButton label="Approved" active={filter === 'approved'} onPress={() => setFilter('approved')} />
                <FilterButton label="Rejected" active={filter === 'rejected'} onPress={() => setFilter('rejected')} />
              </View>
            </View>

            {/* Verifications Table */}
            <View style={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={filteredVerifications}
                onRowPress={(row) => console.log('Verification clicked:', row)}
                emptyMessage="No verifications found"
              />
            </View>
          </View>
      </ScrollView>

      {/* Review Modal */}
      <Modal visible={showReviewModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.large]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Review Verification</Text>
            
            {selectedVerification && (
              <View style={styles.verificationDetails}>
                <DetailRow label="Request ID" value={selectedVerification.id} />
                <DetailRow label="User" value={selectedVerification.userName} />
                <DetailRow label="User Role" value={selectedVerification.userRole} />
                <DetailRow label="Type" value={selectedVerification.type} />
                <DetailRow label="Document" value={selectedVerification.documentType} />
                <DetailRow label="Details" value={selectedVerification.details} />
                <DetailRow label="Submitted" value={selectedVerification.submittedDate} />
                
                {/* Document Preview Placeholder */}
                <View style={[styles.documentPreview, { backgroundColor: colors.lightGray, borderColor: colors.border }]}>
                  <Text style={styles.documentIcon}>📄</Text>
                  <Text style={[styles.documentText, { color: colors.textSecondary }]}>
                    Document Preview
                  </Text>
                  <Text style={[styles.documentSubtext, { color: colors.textSecondary }]}>
                    Click to view full document
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ef4444' }]}
                onPress={handleReject}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>✗ Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#10b981' }]}
                onPress={handleApprove}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>✓ Approve</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AdminLayout>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
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
  requestId: { fontSize: FontSizes.small, fontWeight: '700' },
  userCell: { flexDirection: 'row', alignItems: 'center', gap: Spacing.small },
  avatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSizes.small, fontWeight: '700' },
  userName: { fontSize: FontSizes.small, fontWeight: '700' },
  userRole: { fontSize: FontSizes.tiny, textTransform: 'capitalize' },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.tiny, paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small, alignSelf: 'flex-start' },
  typeBadgeIcon: { fontSize: FontSizes.tiny },
  typeBadgeText: { fontSize: FontSizes.tiny, fontWeight: '700', textTransform: 'capitalize' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.tiny, paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSizes.tiny, fontWeight: '700', textTransform: 'capitalize' },
  actionButton: { paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small },
  actionButtonText: { fontSize: FontSizes.tiny, fontWeight: '700' },
  statusLabel: { fontSize: FontSizes.tiny },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.large },
  modalContent: { width: '100%', maxWidth: 600, borderRadius: BorderRadius.large, padding: Spacing.extraLarge },
  modalTitle: { fontSize: FontSizes.extraLarge, fontWeight: '800', marginBottom: Spacing.large, textAlign: 'center' },
  verificationDetails: { gap: Spacing.medium, marginBottom: Spacing.large },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: FontSizes.small, fontWeight: '600' },
  detailValue: { fontSize: FontSizes.small, fontWeight: '700', textTransform: 'capitalize' },
  documentPreview: { marginTop: Spacing.medium, padding: Spacing.extraLarge, borderRadius: BorderRadius.medium, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center' },
  documentIcon: { fontSize: FontSizes.extraLarge * 2, marginBottom: Spacing.small },
  documentText: { fontSize: FontSizes.medium, fontWeight: '700', marginBottom: 4 },
  documentSubtext: { fontSize: FontSizes.small },
  modalButtons: { flexDirection: 'row', gap: Spacing.medium, marginBottom: Spacing.medium },
  modalButton: { flex: 1, padding: Spacing.medium, borderRadius: BorderRadius.medium, alignItems: 'center' },
  modalButtonText: { fontSize: FontSizes.small, fontWeight: '700' },
  closeButton: { alignItems: 'center', padding: Spacing.small },
  closeButtonText: { fontSize: FontSizes.small, fontWeight: '600' },
});

