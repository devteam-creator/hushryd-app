import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';
import { useAuth } from '../contexts/AuthContext';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'feature_request' | 'bug_report';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  lastUpdated: string;
  assignedTo?: string;
  messages: number;
}

export default function SupportTicketsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { admin, logout } = useAuth();
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'>('all');

  const mockTickets: SupportTicket[] = [
    {
      id: 'TICKET-001',
      title: 'App crashes on Android when booking rides',
      description: 'The app crashes every time I try to book a ride on my Android device. This happens consistently.',
      category: 'bug_report',
      status: 'in_progress',
      priority: 'high',
      submittedDate: '2025-01-15',
      lastUpdated: '2025-01-18',
      assignedTo: 'Technical Team',
      messages: 5,
    },
    {
      id: 'TICKET-002',
      title: 'Unable to add payment method',
      description: 'I cannot add my credit card as a payment method. The form keeps showing an error.',
      category: 'technical',
      status: 'assigned',
      priority: 'medium',
      submittedDate: '2025-01-16',
      lastUpdated: '2025-01-17',
      assignedTo: 'Payment Team',
      messages: 3,
    },
    {
      id: 'TICKET-003',
      title: 'Request for ride sharing feature',
      description: 'It would be great if users could share rides with friends or family members.',
      category: 'feature_request',
      status: 'open',
      priority: 'low',
      submittedDate: '2025-01-18',
      lastUpdated: '2025-01-18',
      messages: 1,
    },
    {
      id: 'TICKET-004',
      title: 'Billing discrepancy in monthly statement',
      description: 'My monthly statement shows charges that I don\'t recognize. Need clarification.',
      category: 'billing',
      status: 'resolved',
      priority: 'medium',
      submittedDate: '2025-01-10',
      lastUpdated: '2025-01-14',
      assignedTo: 'Billing Team',
      messages: 8,
    },
    {
      id: 'TICKET-005',
      title: 'General inquiry about driver requirements',
      description: 'What are the requirements to become a driver on your platform?',
      category: 'general',
      status: 'closed',
      priority: 'low',
      submittedDate: '2025-01-05',
      lastUpdated: '2025-01-08',
      assignedTo: 'Support Team',
      messages: 4,
    },
  ];

  const filteredTickets = mockTickets.filter(
    ticket => filter === 'all' || ticket.status === filter
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💰';
      case 'general': return '💬';
      case 'feature_request': return '💡';
      case 'bug_report': return '🐛';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'assigned': return '#F59E0B';
      case 'in_progress': return '#3B82F6';
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

  const openCount = mockTickets.filter(t => t.status === 'open').length;
  const inProgressCount = mockTickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = mockTickets.filter(t => t.status === 'resolved').length;

  return (
    <AdminLayout title="Support Tickets" currentPage="tickets">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>🔴</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Open</Text>
            <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>{openCount}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>🔵</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>In Progress</Text>
            <Text style={[styles.summaryAmount, { color: '#3B82F6' }]}>{inProgressCount}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>✅</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Resolved</Text>
            <Text style={[styles.summaryAmount, { color: '#10B981' }]}>{resolvedCount}</Text>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter Tickets</Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'All' },
              { key: 'open', label: 'Open' },
              { key: 'assigned', label: 'Assigned' },
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

        {/* Tickets List */}
        <View style={styles.ticketsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {filter === 'all' ? 'All Support Tickets' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tickets`}
          </Text>
          
          {filteredTickets.map((ticket) => (
            <View
              key={ticket.id}
              style={[styles.ticketCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.categoryIcon}>{getCategoryIcon(ticket.category)}</Text>
                  <View style={styles.ticketDetails}>
                    <Text style={[styles.ticketId, { color: colors.primary }]}>
                      {ticket.id}
                    </Text>
                    <Text style={[styles.ticketTitle, { color: colors.text }]}>
                      {ticket.title}
                    </Text>
                    <Text style={[styles.ticketDate, { color: colors.textSecondary }]}>
                      Submitted: {ticket.submittedDate} • Updated: {ticket.lastUpdated}
                    </Text>
                  </View>
                </View>
                <View style={styles.ticketStatus}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                      {ticket.status.replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(ticket.priority) + '20' }]}>
                    <Text style={styles.priorityIcon}>{getPriorityIcon(ticket.priority)}</Text>
                    <Text style={[styles.priorityText, { color: getPriorityColor(ticket.priority) }]}>
                      {ticket.priority}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.ticketDescription, { color: colors.textSecondary }]}>
                {ticket.description}
              </Text>

              {ticket.assignedTo && (
                <View style={[styles.assignmentSection, { backgroundColor: colors.lightGray }]}>
                  <Text style={[styles.assignmentTitle, { color: colors.text }]}>Assigned to:</Text>
                  <Text style={[styles.assignmentText, { color: colors.textSecondary }]}>
                    {ticket.assignedTo}
                  </Text>
                </View>
              )}

              <View style={styles.ticketFooter}>
                <View style={styles.messageCount}>
                  <Text style={styles.messageIcon}>💬</Text>
                  <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                    {ticket.messages} messages
                  </Text>
                </View>
                
                <View style={styles.ticketActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => {/* Handle view ticket */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>View Ticket</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.textSecondary + '20' }]}
                    onPress={() => {/* Handle add message */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>Add Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Create New Ticket Button */}
        <View style={styles.createSection}>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={() => {/* Handle create new ticket */}}
          >
            <LinearGradient
              colors={['#1DA1F2', '#1976D2']}
              style={styles.createButtonGradient}
            >
              <Text style={styles.createButtonText}>+ Create New Ticket</Text>
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
  ticketsSection: {
    paddingHorizontal: Spacing.lg,
  },
  ticketCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  ticketDetails: {
    flex: 1,
  },
  ticketId: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  ticketTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  ticketDate: {
    fontSize: FontSizes.sm,
  },
  ticketStatus: {
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
  ticketDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  assignmentSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  assignmentTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  assignmentText: {
    fontSize: FontSizes.sm,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    fontSize: FontSizes.sm,
    marginRight: Spacing.xs,
  },
  messageText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  createSection: {
    padding: Spacing.lg,
  },
  createButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  createButtonGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
