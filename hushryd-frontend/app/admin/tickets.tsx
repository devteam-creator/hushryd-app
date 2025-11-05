import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

// Mock data
const mockTickets = [
  { id: 'T001', ticketNumber: 'TKT-12458', userId: 'U123', userName: 'John Doe', subject: 'Payment not received', category: 'payment', priority: 'high', status: 'open', createdDate: '2024-10-11 14:30' },
  { id: 'T002', ticketNumber: 'TKT-12459', userId: 'U124', userName: 'Sarah Smith', subject: 'Unable to verify vehicle', category: 'verification', priority: 'medium', status: 'in_progress', createdDate: '2024-10-11 12:15' },
  { id: 'T003', ticketNumber: 'TKT-12460', userId: 'U125', userName: 'Mike Johnson', subject: 'Ride cancelled by driver', category: 'ride_issue', priority: 'urgent', status: 'open', createdDate: '2024-10-11 10:45' },
  { id: 'T004', ticketNumber: 'TKT-12461', userId: 'U126', userName: 'Emma Wilson', subject: 'Account access issue', category: 'account', priority: 'high', status: 'open', createdDate: '2024-10-11 09:30' },
  { id: 'T005', ticketNumber: 'TKT-12462', userId: 'U127', userName: 'David Lee', subject: 'Refund not processed', category: 'payment', priority: 'high', status: 'resolved', createdDate: '2024-10-10 16:20' },
  { id: 'T006', ticketNumber: 'TKT-12463', userId: 'U128', userName: 'Lisa Wang', subject: 'App crashing on iOS', category: 'other', priority: 'medium', status: 'in_progress', createdDate: '2024-10-10 14:15' },
];

export default function TicketsPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout } = useAuth();
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [resolution, setResolution] = useState('');

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        onPress: async () => {
          await logout();
          router.replace('/(tabs)/' as any);
        }
      },
    ]);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return '💳';
      case 'verification': return '✅';
      case 'ride_issue': return '🚗';
      case 'account': return '👤';
      case 'other': return '📝';
      default: return '🎫';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return '#10b981';
      case 'verification': return '#3b82f6';
      case 'ride_issue': return '#f59e0b';
      case 'account': return '#8b5cf6';
      case 'other': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleResolveTicket = () => {
    if (!resolution.trim()) {
      Alert.alert('Error', 'Please enter a resolution');
      return;
    }
    Alert.alert('Success', `Ticket ${selectedTicket?.ticketNumber} has been resolved!`);
    setShowTicketModal(false);
    setSelectedTicket(null);
    setResolution('');
  };

  const handleAssignToMe = () => {
    Alert.alert('Assigned', `Ticket ${selectedTicket?.ticketNumber} has been assigned to you.`);
  };

  const handleCreateNewTicket = () => {
    router.push('/admin/tickets/new');
  };



  const columns: TableColumn[] = [
    {
      key: 'ticketNumber',
      label: 'Ticket #',
      width: 120,
      render: (value) => (
        <Text style={[styles.ticketNumber, { color: colors.primary }]}>{value}</Text>
      ),
    },
    {
      key: 'userName',
      label: 'User',
      width: 150,
      render: (value) => (
        <View style={styles.userCell}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={styles.avatarText}>{value[0]}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{value}</Text>
        </View>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      width: 220,
    },
    {
      key: 'category',
      label: 'Category',
      width: 140,
      render: (value) => (
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(value) + '20' }]}>
          <Text style={styles.categoryIcon}>{getCategoryIcon(value)}</Text>
          <Text style={[styles.categoryText, { color: getCategoryColor(value) }]}>
            {value.replace('_', ' ')}
          </Text>
        </View>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      width: 100,
      render: (value) => (
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(value) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(value) }]}>
            {value}
          </Text>
        </View>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 120,
      render: (value) => (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(value) + '20' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(value) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(value) }]}>
            {value.replace('_', ' ')}
          </Text>
        </View>
      ),
    },
    {
      key: 'createdDate',
      label: 'Created',
      width: 150,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 100,
      render: (_, row) => (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => handleViewTicket(row)}
        >
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>View</Text>
        </TouchableOpacity>
      ),
    },
  ];

  const filteredTickets = mockTickets.filter(ticket => 
    filter === 'all' || ticket.status === filter
  );

  const openCount = mockTickets.filter(t => t.status === 'open').length;
  const inProgressCount = mockTickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = mockTickets.filter(t => t.status === 'resolved').length;

  return (
    <ProtectedRoute pageId="tickets">
      <AdminLayout title="Support Tickets" currentPage="tickets">
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={styles.pageHeader}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Support Tickets</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  Manage and resolve user support requests
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.createButton, { backgroundColor: colors.primary }]}
                onPress={handleCreateNewTicket}
              >
                <Text style={styles.createButtonText}>+ New Ticket</Text>
              </TouchableOpacity>
            </View>

            {/* Ticket Stats */}
            <View style={styles.statsContainer}>
              <StatCard icon="📂" label="Open" value={openCount.toString()} color="#f59e0b" />
              <StatCard icon="⏳" label="In Progress" value={inProgressCount.toString()} color="#3b82f6" />
              <StatCard icon="✅" label="Resolved" value={resolvedCount.toString()} color="#10b981" />
              <StatCard icon="📊" label="Total" value={mockTickets.length.toString()} color="#8b5cf6" />
            </View>

            {/* Filters */}
            <View style={[styles.filtersCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
              <View style={styles.filterButtons}>
                <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
                <FilterButton label="Open" active={filter === 'open'} onPress={() => setFilter('open')} />
                <FilterButton label="In Progress" active={filter === 'in_progress'} onPress={() => setFilter('in_progress')} />
                <FilterButton label="Resolved" active={filter === 'resolved'} onPress={() => setFilter('resolved')} />
              </View>
            </View>

            {/* Tickets Table */}
            <View style={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={filteredTickets}
                emptyMessage="No tickets found"
              />
            </View>
          </View>
        </ScrollView>

      {/* Ticket Detail Modal */}
      <Modal visible={showTicketModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.large]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ticket Details</Text>
              
              {selectedTicket && (
                <View style={styles.ticketDetails}>
                  <DetailRow label="Ticket Number" value={selectedTicket.ticketNumber} />
                  <DetailRow label="User" value={selectedTicket.userName} />
                  <DetailRow label="Subject" value={selectedTicket.subject} />
                  <DetailRow label="Category" value={selectedTicket.category.replace('_', ' ')} />
                  <DetailRow label="Priority" value={selectedTicket.priority} />
                  <DetailRow label="Status" value={selectedTicket.status.replace('_', ' ')} />
                  <DetailRow label="Created" value={selectedTicket.createdDate} />
                  
                  <View style={styles.descriptionSection}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Description</Text>
                    <View style={[styles.descriptionBox, { backgroundColor: colors.lightGray }]}>
                      <Text style={[styles.descriptionText, { color: colors.text }]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </Text>
                    </View>
                  </View>

                  {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                    <View style={styles.resolutionSection}>
                      <Text style={[styles.sectionLabel, { color: colors.text }]}>Resolution</Text>
                      <TextInput
                        style={[styles.resolutionInput, { backgroundColor: colors.lightGray, color: colors.text, borderColor: colors.border }]}
                        placeholder="Enter resolution details..."
                        placeholderTextColor={colors.textSecondary}
                        value={resolution}
                        onChangeText={setResolution}
                        multiline
                        numberOfLines={4}
                      />
                    </View>
                  )}
                </View>
              )}

              <View style={styles.modalActions}>
                {selectedTicket?.status === 'open' && (
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#3b82f6' }]}
                    onPress={handleAssignToMe}
                  >
                    <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Assign to Me</Text>
                  </TouchableOpacity>
                )}
                {selectedTicket?.status !== 'resolved' && selectedTicket?.status !== 'closed' && (
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#10b981' }]}
                    onPress={handleResolveTicket}
                  >
                    <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>✓ Resolve</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTicketModal(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
      </AdminLayout>
    </ProtectedRoute>
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
  createButton: { paddingHorizontal: Spacing.large, paddingVertical: Spacing.medium, borderRadius: BorderRadius.medium },
  createButtonText: { color: '#FFFFFF', fontSize: FontSizes.small, fontWeight: '700' },
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
  ticketNumber: { fontSize: FontSizes.small, fontWeight: '700' },
  userCell: { flexDirection: 'row', alignItems: 'center', gap: Spacing.small },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSizes.tiny, fontWeight: '700' },
  userName: { fontSize: FontSizes.small, fontWeight: '600' },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.tiny, paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small, alignSelf: 'flex-start' },
  categoryIcon: { fontSize: FontSizes.tiny },
  categoryText: { fontSize: FontSizes.tiny, fontWeight: '700', textTransform: 'capitalize' },
  priorityBadge: { paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small, alignSelf: 'flex-start' },
  priorityText: { fontSize: FontSizes.tiny, fontWeight: '700', textTransform: 'uppercase' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: Spacing.tiny, paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small, alignSelf: 'flex-start' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSizes.tiny, fontWeight: '700', textTransform: 'capitalize' },
  actionButton: { paddingHorizontal: Spacing.small, paddingVertical: 4, borderRadius: BorderRadius.small },
  actionButtonText: { fontSize: FontSizes.tiny, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.large },
  modalContent: { width: '100%', maxWidth: 600, maxHeight: '90%', borderRadius: BorderRadius.large, padding: Spacing.extraLarge },
  modalTitle: { fontSize: FontSizes.extraLarge, fontWeight: '800', marginBottom: Spacing.large, textAlign: 'center' },
  ticketDetails: { gap: Spacing.medium, marginBottom: Spacing.large },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: FontSizes.small, fontWeight: '600' },
  detailValue: { fontSize: FontSizes.small, fontWeight: '700', textTransform: 'capitalize' },
  descriptionSection: { marginTop: Spacing.medium },
  sectionLabel: { fontSize: FontSizes.small, fontWeight: '700', marginBottom: Spacing.small },
  descriptionBox: { padding: Spacing.medium, borderRadius: BorderRadius.medium },
  descriptionText: { fontSize: FontSizes.small, lineHeight: FontSizes.small * 1.5 },
  resolutionSection: { marginTop: Spacing.medium },
  resolutionInput: { padding: Spacing.medium, borderRadius: BorderRadius.medium, borderWidth: 1, fontSize: FontSizes.small, textAlignVertical: 'top', minHeight: 100 },
  modalActions: { flexDirection: 'row', gap: Spacing.medium, marginBottom: Spacing.medium },
  modalButton: { flex: 1, padding: Spacing.medium, borderRadius: BorderRadius.medium, alignItems: 'center' },
  modalButtonText: { fontSize: FontSizes.small, fontWeight: '700' },
  closeButton: { alignItems: 'center', padding: Spacing.small },
  closeButtonText: { fontSize: FontSizes.small, fontWeight: '600' },
  // New Ticket Modal Styles
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.large, borderBottomWidth: 1 },
  modalCloseButton: { fontSize: FontSizes.extraLarge, fontWeight: '700', color: '#666' },
  inputLabel: { fontSize: FontSizes.small, fontWeight: '600', marginBottom: Spacing.tiny, marginTop: Spacing.small },
  input: { paddingHorizontal: Spacing.medium, paddingVertical: Spacing.small, borderRadius: BorderRadius.small, borderWidth: 1, fontSize: FontSizes.small },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.small, marginBottom: Spacing.small },
  pickerOption: { paddingHorizontal: Spacing.medium, paddingVertical: Spacing.small, borderRadius: BorderRadius.small, borderWidth: 1 },
  pickerOptionText: { fontSize: FontSizes.small, fontWeight: '600', textTransform: 'capitalize' },
  cancelButton: {},
  saveButton: {},
});

