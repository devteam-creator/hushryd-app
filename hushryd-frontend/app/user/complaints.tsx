import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { apiService } from '@/services/apiService';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Complaint {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  type: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export default function UserComplaintsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    description: '',
    type: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const loadComplaints = useCallback(async () => {
    try {
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Please login to view your complaints');
        router.replace('/login');
        return;
      }

      const response = await apiService.getUserComplaints(token);
      if (response.success && response.data) {
        setComplaints(response.data.complaints || []);
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
      Alert.alert('Error', 'Failed to load complaints');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints();
  }, [loadComplaints]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'closed':
        return '#6b7280';
      default:
        return '#f59e0b';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  const handleAddComplaint = async () => {
    if (!newComplaint.subject || !newComplaint.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Please login to submit a complaint');
        return;
      }

      const response = await apiService.createComplaint(newComplaint, token);
      if (response.success) {
        Alert.alert('Success', 'Complaint submitted successfully');
        setShowAddModal(false);
        setNewComplaint({ subject: '', description: '', type: 'general', priority: 'medium' });
        loadComplaints();
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
      Alert.alert('Error', 'Failed to submit complaint');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading complaints...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>My Complaints</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="warning" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{complaints.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="time" size={24} color="#f59e0b" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {complaints.filter(c => c.status === 'pending').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {complaints.filter(c => c.status === 'resolved').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
          </View>
        </View>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No complaints yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              All good! You haven't submitted any complaints
            </Text>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.submitButtonText}>Submit a Complaint</Text>
            </TouchableOpacity>
          </View>
        ) : (
          complaints.map((complaint) => (
            <TouchableOpacity
              key={complaint.id}
              style={[styles.complaintCard, { backgroundColor: colors.card }]}
              activeOpacity={0.7}
            >
              <View style={styles.complaintHeader}>
                <View style={styles.complaintInfo}>
                  <Text style={[styles.complaintSubject, { color: colors.text }]}>
                    {complaint.subject}
                  </Text>
                  <Text style={[styles.complaintDate, { color: colors.textSecondary }]}>
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(complaint.status) + '20' },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                    {complaint.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <Text style={[styles.complaintDescription, { color: colors.textSecondary }]}>
                {complaint.description}
              </Text>

              <View style={styles.complaintFooter}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: colors.lightGray },
                  ]}
                >
                  <Text style={[styles.typeText, { color: colors.text }]}>
                    {complaint.type}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(complaint.priority) + '20' },
                  ]}
                >
                  <Text
                    style={[styles.priorityText, { color: getPriorityColor(complaint.priority) }]}
                  >
                    {complaint.priority}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Complaint Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Submit Complaint</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="Enter subject"
              placeholderTextColor={colors.textSecondary}
              value={newComplaint.subject}
              onChangeText={(text) => setNewComplaint({ ...newComplaint, subject: text })}
            />

            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: colors.card, color: colors.text },
              ]}
              placeholder="Describe your complaint in detail"
              placeholderTextColor={colors.textSecondary}
              value={newComplaint.description}
              onChangeText={(text) => setNewComplaint({ ...newComplaint, description: text })}
              multiline
              numberOfLines={6}
            />

            <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
            <View style={styles.priorityButtons}>
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    {
                      backgroundColor:
                        newComplaint.priority === priority ? colors.primary : colors.card,
                    },
                  ]}
                  onPress={() => setNewComplaint({ ...newComplaint, priority })}
                >
                  <Text
                    style={{
                      color: newComplaint.priority === priority ? '#FFFFFF' : colors.text,
                      fontWeight: '600',
                    }}
                  >
                    {priority.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleAddComplaint}
            >
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
  },
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  complaintCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  complaintInfo: {
    flex: 1,
  },
  complaintSubject: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  complaintDate: {
    fontSize: FontSizes.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  complaintDescription: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  complaintFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  typeText: {
    fontSize: FontSizes.xs,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  priorityText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  submitButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.md,
  },
  textArea: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    fontSize: FontSizes.md,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
});
