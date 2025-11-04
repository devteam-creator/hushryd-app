import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatsCard from '../../components/admin/StatsCard';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { AdminRole } from '../../types/models';

const mockAdmin = {
  id: '1',
  name: 'Support Agent',
  email: 'support@hushryd.com',
  role: 'support' as AdminRole,
};

const mockComplaints = [
  { 
    id: 'CMP001', 
    user: 'Amit Singh', 
    subject: 'Driver was rude', 
    category: 'behavior',
    ride: 'Hyderabad → Vijayawada',
    description: 'Driver was unprofessional and rude during the journey.',
    priority: 'high', 
    status: 'open', 
    created: '2025-01-15',
    assignedTo: 'Support Team'
  },
  { 
    id: 'CMP002', 
    user: 'Sneha Patel', 
    subject: 'Vehicle condition poor', 
    category: 'vehicle',
    ride: 'Vijayawada → Hyderabad',
    description: 'Vehicle was not clean and AC was not working properly.',
    priority: 'medium', 
    status: 'in-progress', 
    created: '2025-01-15',
    assignedTo: 'John Doe'
  },
  { 
    id: 'CMP003', 
    user: 'Rahul Verma', 
    subject: 'Driver cancelled at last minute', 
    category: 'cancellation',
    ride: 'Hyderabad → Bangalore',
    description: 'Driver cancelled the ride 10 minutes before departure without proper notice.',
    priority: 'high', 
    status: 'open', 
    created: '2025-01-14',
    assignedTo: 'Support Team'
  },
  { 
    id: 'CMP004', 
    user: 'Priyanka Nair', 
    subject: 'Wrong pickup location', 
    category: 'service',
    ride: 'Hyderabad → Vijayawada',
    description: 'Driver picked me up from wrong location, caused 30 min delay.',
    priority: 'low', 
    status: 'resolved', 
    created: '2025-01-14',
    assignedTo: 'Sarah Wilson'
  },
  { 
    id: 'CMP005', 
    user: 'Vikram Reddy', 
    subject: 'Overcharging issue', 
    category: 'payment',
    ride: 'Vijayawada → Hyderabad',
    description: 'Was charged extra ₹200 without explanation.',
    priority: 'high', 
    status: 'in-progress', 
    created: '2025-01-13',
    assignedTo: 'John Doe'
  },
  { 
    id: 'CMP006', 
    user: 'Anjali Gupta', 
    subject: 'Safety concern during ride', 
    category: 'safety',
    ride: 'Hyderabad → Vijayawada',
    description: 'Driver was driving recklessly and using phone while driving.',
    priority: 'high', 
    status: 'escalated', 
    created: '2025-01-12',
    assignedTo: 'Manager Review'
  },
];

export default function AdminComplaintsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'behavior' | 'vehicle' | 'cancellation' | 'service' | 'payment' | 'safety'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'escalated'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);


  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch = complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleComplaintAction = (complaint: any, action: string) => {
    setShowComplaintModal(false);
    Alert.alert(
      'Action Confirmed',
      `Complaint ${complaint.id} has been ${action}.`,
      [{ text: 'OK' }]
    );
  };

  const columns = [
    { key: 'id', label: 'ID', width: 100 },
    { key: 'user', label: 'Customer' },
    { key: 'subject', label: 'Subject' },
    { key: 'category', label: 'Category', render: (complaint: any) => (
      <View style={[styles.categoryBadge, { 
        backgroundColor: 
          complaint.category === 'safety' ? '#ef4444' :
          complaint.category === 'payment' ? '#f59e0b' :
          complaint.category === 'behavior' ? '#ec4899' :
          complaint.category === 'vehicle' ? '#8b5cf6' : '#3b82f6'
      }]}>
        <Text style={styles.badgeText}>{complaint.category}</Text>
      </View>
    )},
    { key: 'priority', label: 'Priority', render: (complaint: any) => (
      <View style={[
        styles.priorityBadge,
        { backgroundColor: 
          complaint.priority === 'high' ? '#ef4444' :
          complaint.priority === 'medium' ? '#f59e0b' : '#10b981'
        }
      ]}>
        <Text style={styles.badgeText}>{complaint.priority}</Text>
      </View>
    )},
    { key: 'status', label: 'Status', render: (complaint: any) => (
      <View style={[
        styles.statusBadge,
        { backgroundColor: 
          complaint.status === 'open' ? '#3b82f6' :
          complaint.status === 'in-progress' ? '#f59e0b' :
          complaint.status === 'escalated' ? '#ef4444' : '#10b981'
        }
      ]}>
        <Text style={styles.badgeText}>{complaint.status}</Text>
      </View>
    )},
    { key: 'created', label: 'Date' },
  ];

  return (
    <AdminLayout title="Customer Complaints" currentPage="complaints">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Customer Complaints</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Handle and resolve customer issues</Text>
          </View>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.lightGray }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatsCard icon="📝" title="Total Complaints" value={mockComplaints.length.toString()} color="#3b82f6" />
          <StatsCard icon="🔥" title="High Priority" value={mockComplaints.filter(c => c.priority === 'high').length.toString()} color="#ef4444" />
          <StatsCard icon="⏳" title="In Progress" value={mockComplaints.filter(c => c.status === 'in-progress').length.toString()} color="#f59e0b" />
          <StatsCard icon="✅" title="Resolved" value={mockComplaints.filter(c => c.status === 'resolved').length.toString()} color="#10b981" />
        </View>

        {/* Filters */}
        <View style={[styles.filtersCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>Filters</Text>
          
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by ID, customer, or subject..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Category:</Text>
            <View style={styles.filterButtons}>
              {(['all', 'behavior', 'vehicle', 'cancellation', 'service', 'payment', 'safety'] as const).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    { backgroundColor: colors.lightGray },
                    categoryFilter === category && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setCategoryFilter(category)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { color: colors.text },
                    categoryFilter === category && { color: '#FFFFFF' },
                  ]}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Status:</Text>
            <View style={styles.filterButtons}>
              {(['all', 'open', 'in-progress', 'resolved', 'escalated'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    { backgroundColor: colors.lightGray },
                    statusFilter === status && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { color: colors.text },
                    statusFilter === status && { color: '#FFFFFF' },
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Complaints Table */}
        <View style={[styles.tableCard, { backgroundColor: colors.card }]}>
          <DataTable
            columns={columns}
            data={filteredComplaints}
            onRowPress={(complaint) => {
              setSelectedComplaint(complaint);
              setShowComplaintModal(true);
            }}
          />
        </View>
      </ScrollView>

      {/* Complaint Detail Modal */}
      <Modal
        visible={showComplaintModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComplaintModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Complaint Details - {selectedComplaint?.id}
              </Text>
              <TouchableOpacity onPress={() => setShowComplaintModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Customer:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedComplaint?.user}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Subject:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedComplaint?.subject}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Ride:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedComplaint?.ride}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Description:</Text>
                <Text style={[styles.detailDescription, { color: colors.text }]}>{selectedComplaint?.description}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category:</Text>
                  <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{selectedComplaint?.category}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Priority:</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: selectedComplaint?.priority === 'high' ? '#ef4444' : '#f59e0b' }]}>
                    <Text style={styles.badgeText}>{selectedComplaint?.priority}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Assigned To:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedComplaint?.assignedTo}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Created:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedComplaint?.created}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#10b981' }]}
                  onPress={() => handleComplaintAction(selectedComplaint, 'resolved')}
                >
                  <Text style={styles.actionButtonText}>✅ Mark Resolved</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
                  onPress={() => handleComplaintAction(selectedComplaint, 'assigned to me')}
                >
                  <Text style={styles.actionButtonText}>👤 Assign to Me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                  onPress={() => handleComplaintAction(selectedComplaint, 'escalated')}
                >
                  <Text style={styles.actionButtonText}>🚨 Escalate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
                  onPress={() => handleComplaintAction(selectedComplaint, 'contacted')}
                >
                  <Text style={styles.actionButtonText}>📞 Contact Customer</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  filtersCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  filtersTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
  },
  filterSection: {
    marginTop: Spacing.md,
  },
  filterLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  tableCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '80%',
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: FontSizes.xxxl,
    fontWeight: '300',
  },
  modalBody: {
    padding: Spacing.lg,
  },
  detailSection: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: FontSizes.md,
  },
  detailDescription: {
    fontSize: FontSizes.md,
    lineHeight: FontSizes.xl,
  },
  actionButtons: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});

