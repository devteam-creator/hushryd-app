import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { permissionsService } from '../../services/permissionsService';

const { width } = Dimensions.get('window');

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage?: string;
}

export default function AdminLayout({ children, title, currentPage = 'dashboard' }: AdminLayoutProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { admin } = useAuth();
  const [activeMenu, setActiveMenu] = useState(currentPage);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const getMenuItems = () => {
    const allMenuItems = [
      { id: 'dashboard', title: 'Dashboard', icon: '📊', route: '/admin/dashboard' },
      { id: 'users', title: 'Users', icon: '👥', route: '/admin/users' },
      { id: 'rides', title: 'Rides', icon: '🚗', route: '/admin/rides' },
      { id: 'bookings', title: 'Bookings', icon: '📋', route: '/admin/bookings' },
      { id: 'offers', title: 'Offers Management', icon: '🎁', route: '/admin/offers' },
      { id: 'analytics', title: 'Analytics', icon: '📈', route: '/admin/analytics' },
      { id: 'finance', title: 'Finance', icon: '💰', route: '/admin/finance' },
      { id: 'transactions', title: 'Transactions', icon: '💳', route: '/admin/transactions' },
      { id: 'payouts', title: 'Payouts', icon: '💸', route: '/admin/payouts' },
      { id: 'fares', title: 'Fare Management', icon: '🎫', route: '/admin/fares' },
      { id: 'admins', title: 'Admin Management', icon: '👨‍💼', route: '/admin/admins' },
      { id: 'verifications', title: 'Verifications', icon: '✅', route: '/admin/verifications' },
      { id: 'complaints', title: 'Complaints', icon: '😠', route: '/admin/complaints' },
      { id: 'tickets', title: 'Support Tickets', icon: '🎫', route: '/admin/tickets' },
      { id: 'support', title: 'Support', icon: '🆘', route: '/admin/support' },
      { id: 'sos', title: 'SOS Management', icon: '🚨', route: '/admin/sos' },
      { id: 'sessions', title: 'Session History', icon: '📱', route: '/admin/sessions' },
    { id: 'settings', title: 'Settings', icon: '⚙️', route: '/admin/settings' },
    { id: 'permissions', title: 'Role Permissions', icon: '🔐', route: '/admin/permissions' },
    { id: 'database', title: 'Database Management', icon: '🗄️', route: '/admin/database' },
    { id: 'migrations', title: 'Database Migrations', icon: '🔄', route: '/admin/migrations' },
    ];

    // Filter menu items based on user permissions
    if (!admin) return allMenuItems;
    
    return allMenuItems.filter(item => {
      // Super admin can see everything
      if (admin.role === 'superadmin') return true;
      
      // Check if user has permission for this page
      return permissionsService.hasPageAccess(admin.role, item.id);
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleSidebarHoverIn = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setSidebarHovered(true);
    setSidebarExpanded(true);
  };

  const handleSidebarHoverOut = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setSidebarHovered(false);
  };

  const handleSidebarPress = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setSidebarExpanded(!sidebarExpanded);
    setSidebarHovered(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Sidebar - Black Background */}
        <View 
          style={[
            styles.sidebar,
            sidebarExpanded && styles.sidebarExpanded,
            sidebarHovered && !sidebarExpanded && styles.sidebarHovered
          ]}
        >
          {/* Sidebar Toggle Button */}
          <TouchableOpacity 
            style={styles.sidebarToggle}
            onPress={handleSidebarPress}
            activeOpacity={0.8}
          >
            <Text style={styles.toggleIcon}>
              {sidebarExpanded ? '✕' : '☰'}
            </Text>
          </TouchableOpacity>
          
          <ScrollView style={styles.sidebarScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.sidebarContent}>
              <View style={styles.logoSection}>
                <Image 
                  source={require('../../assets/images/hushryd-logo-black-gradient.png')} 
                  style={[styles.logoImage, { tintColor: '#FFFFFF' }]}
                  resizeMode="contain"
                />
                {sidebarExpanded && <Text style={[styles.logoText, { color: colors.text }]}>Admin Dashboard</Text>}
              </View>
              
              <View style={styles.menuSection}>
                {sidebarExpanded && <Text style={styles.menuTitle}>Main Menu</Text>}
                {getMenuItems().map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      activeMenu === item.id && styles.activeMenuItem,
                      !sidebarExpanded && styles.menuItemCollapsed
                    ]}
                    onPress={() => {
                      console.log('Menu item clicked:', item.id, item.route);
                      if (hoverTimeout) {
                        clearTimeout(hoverTimeout);
                        setHoverTimeout(null);
                      }
                      setActiveMenu(item.id);
                      setSidebarExpanded(true);
                      if (item.route) {
                        console.log('Navigating to:', item.route);
                        router.push(item.route as any);
                      }
                    }}
                  >
                    <Text style={[
                      styles.menuIcon,
                      activeMenu === item.id && styles.activeMenuIcon,
                      !sidebarExpanded && styles.menuIconCollapsed
                    ]}>
                      {item.icon}
                    </Text>
                    {sidebarExpanded && (
                      <Text style={[
                        styles.menuText,
                        activeMenu === item.id && styles.activeMenuText
                      ]}>
                        {item.title}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Main Content Area - White Background */}
        <View style={styles.mainContentArea}>
          {/* Header - Beside Sidebar */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>{getGreeting()}, James!</Text>
                <Text style={styles.pageTitle}>{title}</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.notificationButton}>
                  <Text style={styles.notificationIcon}>🔔</Text>
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationCount}>24</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.profileSection}>
                  <View style={styles.profileAvatar}>
                    <Text style={styles.profileInitial}>W</Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>William Martin</Text>
                    <Text style={styles.profileRole}>Front End Developer</Text>
                  </View>
                </View>
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
    width: 60,
    backgroundColor: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#374151',
    position: 'relative',
  },
  sidebarExpanded: {
    width: 280,
  },
  sidebarHovered: {
    width: 80,
    backgroundColor: '#1a1a1a',
  },
  sidebarToggle: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sidebarScrollView: {
    flex: 1,
  },
  sidebarContent: {
    padding: Spacing.lg,
    paddingTop: 60, // Space for toggle button
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoImage: {
    width: 80,
    height: 30,
    marginBottom: Spacing.xs,
    minWidth: 60,
    minHeight: 20,
  },
  logoText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  menuSection: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md,
    minHeight: 48,
    justifyContent: 'flex-start',
    zIndex: 100,
    elevation: 5,
  },
  activeMenuItem: {
    backgroundColor: '#1F2937',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: Spacing.md,
    color: '#9CA3AF',
    width: 24,
    textAlign: 'center',
  },
  activeMenuIcon: {
    color: '#3B82F6',
  },
  menuText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  activeMenuText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  menuItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  menuIconCollapsed: {
    marginRight: 0,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
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
    fontSize: FontSizes.lg,
    color: '#374151',
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: Spacing.lg,
    padding: Spacing.sm,
  },
  notificationIcon: {
    fontSize: 20,
    color: '#6B7280',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  profileInitial: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'flex-start',
  },
  profileName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
  },
  profileRole: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
  },
  pageContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
});
