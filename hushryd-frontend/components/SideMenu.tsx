import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';
import { useAuth } from '../contexts/AuthContext';
import HushRydLogoImage from './HushRydLogoImage';
import { useColorScheme } from './useColorScheme';

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  slot?: 'top' | 'middle' | 'bottom';
}

export default function SideMenu({ isVisible, onClose }: SideMenuProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    // Top Section - Main Navigation
    { id: 'profile', title: 'My Profile', icon: '👤', route: '/(tabs)/profile', slot: 'top' },
    { id: 'help', title: 'Help', icon: '❓', route: '/help', slot: 'top' },
    { id: 'payment', title: 'Payment', icon: '💳', route: '/payment', slot: 'top' },
    { id: 'rides', title: 'My Rides', icon: '🚗', route: '/my-rides', slot: 'top' },
    { id: 'safety', title: 'Safety', icon: '🛡️', route: '/safety', slot: 'top' },
    
    // Middle Section - Rewards & Wallet
    { id: 'refer', title: 'Refer and Earn', icon: '🎁', route: '/refer', slot: 'middle' },
    { id: 'rewards', title: 'My Rewards', icon: '🏆', route: '/rewards', slot: 'middle' },
    { id: 'wallet', title: 'My Wallet', icon: '💰', route: '/wallet', slot: 'middle' },
    { id: 'notifications', title: 'Notifications', icon: '🔔', route: '/notifications', slot: 'middle' },
    { id: 'claims', title: 'Claims', icon: '📄', route: '/claims', slot: 'middle' },
    
    // Bottom Section - Settings
    { id: 'settings', title: 'Settings', icon: '⚙️', route: '/settings', slot: 'bottom' },
    { id: 'logout', title: 'Logout', icon: '🚪', route: '/logout', slot: 'bottom' },
  ];

  const handleMenuItemPress = (route: string, id: string) => {
    onClose();
    
    // Handle logout specially
    if (id === 'logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                console.log('🔴 Starting logout process from SideMenu...');
                await logout();
                console.log('✅ Logout successful from SideMenu');
                // Redirect to login
                router.replace('/login' as any);
              } catch (error) {
                console.error('Logout error from SideMenu:', error);
                // Still redirect to login even if there's an error
                router.replace('/login' as any);
              }
            },
          },
        ]
      );
      return;
    }
    
    router.push(route as any);
  };

  const renderMenuSection = (items: MenuItem[], sectionTitle: string) => (
    <View style={styles.menuSection}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{sectionTitle}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => handleMenuItemPress(item.route, item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={[styles.menuText, { color: colors.text }]}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sideMenu, { backgroundColor: colors.background }]}>
        {/* Header */}
        <LinearGradient
          colors={['#32CD32', '#228B22', '#1E7A1E']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {/* HushRyd Logo */}
            <View style={styles.logoContainer}>
              <HushRydLogoImage 
                size="small" 
                darkBackground={true} 
              />
            </View>
            <Text style={styles.headerSubtitle}>Navigation Menu</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Menu Content */}
        <ScrollView 
          style={styles.menuContent}
          contentContainerStyle={styles.menuContentContainer}
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          {renderMenuSection(
            menuItems.filter(item => item.slot === 'top'),
            'Main'
          )}
          
          {renderMenuSection(
            menuItems.filter(item => item.slot === 'middle'),
            'Support & Rewards'
          )}
          
          {renderMenuSection(
            menuItems.filter(item => item.slot === 'bottom'),
            'Settings'
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            HushRyd v1.0.0
          </Text>
        </View>
      </View>
    </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sideMenu: {
    width: 280,
    height: '100%',
    ...Shadows.large,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FontSizes.lg,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuContent: {
    flex: 1,
  },
  menuContentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  menuSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    ...Shadows.small,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  menuIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.md,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});
