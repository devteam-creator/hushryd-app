import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatsCard from '../../components/admin/StatsCard';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { AdminRole } from '../../types/models';

const mockAdmin = {
  id: '1',
  name: 'Super Admin',
  email: 'superadmin@hushryd.com',
  role: 'superadmin' as AdminRole,
};

const mockTickets = [
  { id: 'TKT001', user: 'Amit Singh', subject: 'Payment Issue', priority: 'high', status: 'open', created: '2025-01-15' },
  { id: 'TKT002', user: 'Sneha Patel', subject: 'Driver Not Found', priority: 'medium', status: 'in-progress', created: '2025-01-15' },
  { id: 'TKT003', user: 'Rahul Verma', subject: 'App Crash', priority: 'high', status: 'open', created: '2025-01-14' },
  { id: 'TKT004', user: 'Priyanka Nair', subject: 'Booking Cancelled', priority: 'low', status: 'resolved', created: '2025-01-14' },
  { id: 'TKT005', user: 'Vikram Reddy', subject: 'Refund Request', priority: 'medium', status: 'in-progress', created: '2025-01-13' },
];

export default function AdminSupportScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');


  const filteredTickets = mockTickets.filter((ticket) => {
    return priorityFilter === 'all' || ticket.priority === priorityFilter;
  });

  const columns = [
    { key: 'id', label: 'Ticket ID', width: 100 },
    { key: 'user', label: 'User' },
    { key: 'subject', label: 'Subject' },
    { key: 'priority', label: 'Priority', render: (ticket: any) => (
      <View style={[
        styles.priorityBadge,
        { backgroundColor: 
          ticket.priority === 'high' ? '#ef4444' :
          ticket.priority === 'medium' ? '#f59e0b' : '#10b981'
        }
      ]}>
        <Text style={styles.badgeText}>{ticket.priority}</Text>
      </View>
    )},
    { key: 'status', label: 'Status', render: (ticket: any) => (
      <View style={[
        styles.statusBadge,
        { backgroundColor: 
          ticket.status === 'open' ? '#3b82f6' :
          ticket.status === 'in-progress' ? '#f59e0b' : '#10b981'
        }
      ]}>
        <Text style={styles.badgeText}>{ticket.status}</Text>
      </View>
    )},
    { key: 'created', label: 'Created' },
  ];

  return (
    <AdminLayout title="Support Management" currentPage="support">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Support Stats */}
        <View style={styles.statsGrid}>
          <StatsCard icon="🎫" title="Total Tickets" value="342" trend={{ value: '+8%', isPositive: false }} color="#3b82f6" />
          <StatsCard icon="🔥" title="Open Tickets" value="18" color="#ef4444" />
          <StatsCard icon="⏳" title="In Progress" value="24" color="#f59e0b" />
          <StatsCard icon="✅" title="Resolved Today" value="12" trend={{ value: '+15%', isPositive: true }} color="#10b981" />
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/admin/tickets')}
          >
            <Text style={styles.actionIcon}>🎫</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>All Tickets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => router.push('/admin/verifications')}
          >
            <Text style={styles.actionIcon}>✅</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Verifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Text style={styles.actionIcon}>⚖️</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Disputes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Text style={styles.actionIcon}>🚩</Text>
            <Text style={[styles.actionTitle, { color: colors.text }]}>Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={[styles.filtersCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Filter by Priority:</Text>
          <View style={styles.filterButtons}>
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.lightGray },
                  priorityFilter === priority && { backgroundColor: colors.primary },
                ]}
                onPress={() => setPriorityFilter(priority)}
              >
                <Text style={[
                  styles.filterButtonText,
                  { color: colors.text },
                  priorityFilter === priority && { color: '#FFFFFF' },
                ]}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Tickets */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Tickets</Text>
        <View style={[styles.tableCard, { backgroundColor: colors.card }]}>
          <DataTable
            columns={columns}
            data={filteredTickets}
            onRowPress={(ticket) => console.log('Ticket pressed:', ticket)}
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
  },
  filtersCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
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
});

