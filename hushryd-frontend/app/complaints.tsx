import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'driver' | 'vehicle' | 'payment' | 'service' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  rideId?: string;
  response?: string;
  resolutionDate?: string;
}

export default function ComplaintsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');

  const mockComplaints: Complaint[] = [
    {
      id: '1',
      title: 'Driver was rude and unprofessional',
      description: 'The driver was very rude and used inappropriate language during the journey.',
      category: 'driver',
      status: 'resolved',
      priority: 'high',
      submittedDate: '2025-01-10',
      rideId: 'ride_1',
      response: 'We apologize for the inconvenience. The driver has been warned and will undergo additional training.',
      resolutionDate: '2025-01-12',
    },
    {
      id: '2',
      title: 'Vehicle was not clean',
      description: 'The car was dirty and had unpleasant odor.',
      category: 'vehicle',
      status: 'in_progress',
      priority: 'medium',
      submittedDate: '2025-01-15',
      rideId: 'ride_2',
      response: 'We are investigating this complaint and will take appropriate action.',
    },
    {
      id: '3',
      title: 'Payment issue - charged extra',
      description: 'I was charged ₹100 extra than the quoted fare.',
      category: 'payment',
      status: 'open',
      priority: 'high',
      submittedDate: '2025-01-18',
      rideId: 'ride_3',
    },
    {
      id: '4',
      title: 'Late pickup - driver was 30 minutes late',
      description: 'Driver arrived 30 minutes late and didn\'t inform about the delay.',
      category: 'service',
      status: 'resolved',
      priority: 'medium',
      submittedDate: '2025-01-08',
      rideId: 'ride_4',
      response: 'We have credited ₹50 to your account as compensation for the delay.',
      resolutionDate: '2025-01-10',
    },
    {
      id: '5',
      title: 'App crashed during booking',
      description: 'The app crashed multiple times while trying to book a ride.',
      category: 'other',
      status: 'closed',
      priority: 'low',
      submittedDate: '2025-01-05',
      response: 'This was a known issue that has been fixed in the latest app update.',
      resolutionDate: '2025-01-07',
    },
  ];

  const filteredComplaints = mockComplaints.filter(
    complaint => filter === 'all' || complaint.status === filter
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'driver': return '👨‍💼';
      case 'vehicle': return '🚗';
      case 'payment': return '💰';
      case 'service': return '🛠️';
      case 'other': return '📝';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'in_progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🔵';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const openCount = mockComplaints.filter(c => c.status === 'open').length;
  const inProgressCount = mockComplaints.filter(c => c.status === 'in_progress').length;
  const resolvedCount = mockComplaints.filter(c => c.status === 'resolved').length;

  return (
    <AdminLayout title="Complaints" currentPage="complaints">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>🔴</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Open</Text>
            <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>{openCount}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>🟠</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>In Progress</Text>
            <Text style={[styles.summaryAmount, { color: '#F59E0B' }]}>{inProgressCount}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>✅</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Resolved</Text>
            <Text style={[styles.summaryAmount, { color: '#10B981' }]}>{resolvedCount}</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter Complaints</Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'All' },
              { key: 'open', label: 'Open' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'resolved', label: 'Resolved' },
              { key: 'closed', label: 'Closed' },
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

        {/* Complaints List */}
        <View style={styles.complaintsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {filter === 'all' ? 'All Complaints' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Complaints`}
          </Text>
          
          {filteredComplaints.map((complaint) => (
            <View
              key={complaint.id}
              style={[styles.complaintCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.complaintHeader}>
                <View style={styles.complaintInfo}>
                  <Text style={styles.categoryIcon}>{getCategoryIcon(complaint.category)}</Text>
                  <View style={styles.complaintDetails}>
                    <Text style={[styles.complaintTitle, { color: colors.text }]}>
                      {complaint.title}
                    </Text>
                    <Text style={[styles.complaintDate, { color: colors.textSecondary }]}>
                      Submitted: {complaint.submittedDate}
                    </Text>
                    {complaint.resolutionDate && (
                      <Text style={[styles.complaintResolutionDate, { color: colors.textSecondary }]}>
                        Resolved: {complaint.resolutionDate}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.complaintStatus}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                      {complaint.status.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(complaint.priority) + '20' }]}>
                    <Text style={styles.priorityIcon}>{getPriorityIcon(complaint.priority)}</Text>
                    <Text style={[styles.priorityText, { color: getPriorityColor(complaint.priority) }]}>
                      {complaint.priority}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.complaintDescription, { color: colors.textSecondary }]}>
                {complaint.description}
              </Text>

              {complaint.response && (
                <View style={[styles.responseSection, { backgroundColor: colors.lightGray }]}>
                  <Text style={[styles.responseTitle, { color: colors.text }]}>Response:</Text>
                  <Text style={[styles.responseText, { color: colors.textSecondary }]}>
                    {complaint.response}
                  </Text>
                </View>
              )}

              <View style={styles.complaintActions}>
                {complaint.rideId && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => router.push(`/ride/${complaint.rideId}` as any)}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>View Ride</Text>
                  </TouchableOpacity>
                )}
                
                {complaint.status === 'open' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.textSecondary + '20' }]}
                    onPress={() => {/* Handle follow up */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Follow Up</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.textSecondary + '20' }]}
                  onPress={() => {/* Handle view details */}}
                >
                  <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Submit New Complaint Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={() => {/* Handle submit new complaint */}}
          >
            <LinearGradient
              colors={['#1DA1F2', '#1976D2']}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>+ Submit New Complaint</Text>
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
  complaintsSection: {
    paddingHorizontal: Spacing.lg,
  },
  complaintCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  complaintInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  complaintDetails: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  complaintDate: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  complaintResolutionDate: {
    fontSize: FontSizes.sm,
  },
  complaintStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  priorityIcon: {
    fontSize: FontSizes.xs,
    marginRight: Spacing.xs,
  },
  priorityText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  complaintDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  responseSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  responseTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  responseText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  complaintActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  submitSection: {
    padding: Spacing.lg,
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  submitButtonGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
