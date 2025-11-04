import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import NotificationDemo from '../../components/NotificationDemo';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboardScreen() {
  const { admin, logout } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showNotificationDemo, setShowNotificationDemo] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(tabs)/' as any);
  };

  const dashboardCards = [
    {
      title: 'Support Tickets',
      description: 'Manage user support requests',
      icon: '🎫',
      route: '/admin/tickets',
      color: '#3b82f6',
    },
    {
      title: 'Transactions',
      description: 'View financial transactions',
      icon: '💰',
      route: '/admin/transactions',
      color: '#10b981',
    },
    {
      title: 'Payouts',
      description: 'Process driver payouts',
      icon: '💳',
      route: '/admin/payouts',
      color: '#f59e0b',
    },
    {
      title: 'Verifications',
      description: 'Review user verifications',
      icon: '✅',
      route: '/admin/verifications',
      color: '#8b5cf6',
    },
    {
      title: 'Complaints',
      description: 'Handle customer complaints',
      icon: '📝',
      route: '/admin/complaints',
      color: '#ef4444',
    },
    {
      title: 'Fare Management',
      description: 'Manage fare rules',
      icon: '📊',
      route: '/admin/fares',
      color: '#06b6d4',
    },
    {
      title: 'Support',
      description: 'General support management',
      icon: '🆘',
      route: '/admin/support',
      color: '#84cc16',
    },
    {
      title: 'Settings',
      description: 'System and account settings',
      icon: '⚙️',
      route: '/admin/settings',
      color: '#6b7280',
    },
    {
      title: 'Notifications',
      description: 'Test push notifications',
      icon: '🔔',
      route: 'demo',
      color: '#8b5cf6',
    },
  ];

  const quickStats = [
    { label: 'Open Tickets', value: '24', color: '#f59e0b' },
    { label: 'Pending Payouts', value: '₹45,000', color: '#10b981' },
    { label: 'Verifications', value: '12', color: '#8b5cf6' },
    { label: 'Complaints', value: '8', color: '#ef4444' },
  ];

  return (
    <ProtectedRoute pageId="dashboard">
      <AdminLayout title="Dashboard" currentPage="dashboard">
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Welcome Section */}
            <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.medium]}>
              <View style={styles.welcomeContent}>
                <View>
                  <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                    Welcome back, {admin?.name}!
                  </Text>
                  <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                    Here's what's happening in your admin dashboard
                  </Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.roleText}>{admin?.role?.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
              <View style={styles.statsGrid}>
                {quickStats.map((stat, index) => (
                  <View key={index} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
                    <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Dashboard Cards */}
            <View style={styles.cardsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
              <View style={styles.cardsGrid}>
                {dashboardCards.map((card, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dashboardCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}
                    onPress={() => {
                      if (card.route === 'demo') {
                        setShowNotificationDemo(true);
                      } else {
                        router.push(card.route as any);
                      }
                    }}
                  >
                    <View style={[styles.cardIcon, { backgroundColor: card.color + '20' }]}>
                      <Text style={styles.cardIconText}>{card.icon}</Text>
                    </View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{card.title}</Text>
                    <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{card.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <TouchableOpacity
                style={[styles.logoutButton, { backgroundColor: colors.error }]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>🚪 Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Notification Demo Modal */}
        <Modal
          visible={showNotificationDemo}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <NotificationDemo />
          <TouchableOpacity
            style={[styles.closeModalButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowNotificationDemo(false)}
          >
            <Text style={styles.closeModalButtonText}>Close Demo</Text>
          </TouchableOpacity>
        </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.large,
  },
  welcomeCard: {
    padding: Spacing.large,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.tiny,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.medium,
  },
  roleBadge: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.medium,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  statsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.medium,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.tiny,
  },
  statLabel: {
    fontSize: FontSizes.small,
    textAlign: 'center',
  },
  cardsSection: {
    marginBottom: Spacing.xl,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.medium,
  },
  dashboardCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.medium,
  },
  cardIconText: {
    fontSize: FontSizes.xl,
  },
  cardTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.tiny,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: FontSizes.small,
    textAlign: 'center',
  },
  logoutSection: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  logoutButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
    ...Shadows.small,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  closeModalButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});