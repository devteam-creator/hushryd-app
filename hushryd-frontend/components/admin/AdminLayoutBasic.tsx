import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage?: string;
}

export default function AdminLayout({ children, title, currentPage = 'dashboard' }: AdminLayoutProps) {
  const getMenuItems = () => [
    { id: 'dashboard', title: 'Dashboard', icon: '📊', route: '/admin/dashboard' },
    { id: 'users', title: 'Users', icon: '👥', route: '/admin/users' },
    { id: 'rides', title: 'Rides', icon: '🚗', route: '/admin/rides' },
    { id: 'bookings', title: 'Bookings', icon: '📋', route: '/admin/bookings' },
    { id: 'finance', title: 'Finance', icon: '💰', route: '/admin/finance' },
    { id: 'transactions', title: 'Transactions', icon: '💳', route: '/admin/transactions' },
    { id: 'payouts', title: 'Payouts', icon: '💸', route: '/admin/payouts' },
    { id: 'fares', title: 'Fare Management', icon: '🎫', route: '/admin/fares' },
    { id: 'admins', title: 'Admin Management', icon: '👨‍💼', route: '/admin/admins' },
    { id: 'verifications', title: 'Verifications', icon: '✅', route: '/admin/verifications' },
    { id: 'complaints', title: 'Complaints', icon: '😠', route: '/admin/complaints' },
    { id: 'tickets', title: 'Support Tickets', icon: '🎫', route: '/admin/tickets' },
    { id: 'support', title: 'Support', icon: '🆘', route: '/admin/support' },
    { id: 'settings', title: 'Settings', icon: '⚙️', route: '/admin/settings' },
    { id: 'database', title: 'Database Management', icon: '🗄️', route: '/admin/database' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <ScrollView style={styles.sidebarScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.sidebarContent}>
              <View style={styles.logoSection}>
                <Text style={styles.logoText}>HushRyd</Text>
                <Text style={styles.logoSubtext}>Admin Dashboard</Text>
              </View>
              
              <View style={styles.menuSection}>
                <Text style={styles.menuTitle}>Main Menu</Text>
                {getMenuItems().map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      currentPage === item.id && styles.activeMenuItem
                    ]}
                    onPress={() => {
                      if (item.route) {
                        router.push(item.route as any);
                      }
                    }}
                  >
                    <Text style={[
                      styles.menuIcon,
                      currentPage === item.id && styles.activeMenuIcon
                    ]}>
                      {item.icon}
                    </Text>
                    <Text style={[
                      styles.menuText,
                      currentPage === item.id && styles.activeMenuText
                    ]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContentArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>{getGreeting()}, Admin!</Text>
                <Text style={styles.pageTitle}>{title}</Text>
              </View>
            </View>
          </View>

          {/* Page Content */}
          <ScrollView style={styles.pageContent} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  sidebarScrollView: {
    flex: 1,
  },
  sidebarContent: {
    padding: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  logoSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
  menuSection: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 8,
    minHeight: 48,
  },
  activeMenuItem: {
    backgroundColor: '#1F2937',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#9CA3AF',
    width: 24,
    textAlign: 'center',
  },
  activeMenuIcon: {
    color: '#3B82F6',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  pageContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
