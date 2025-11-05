import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { FontSizes, Spacing } from '../../constants/Design';
import { AdminRole } from '../../types/models';
import HushRydLogo from '../HushRydLogo';
import { useColorScheme } from '../useColorScheme';

interface AdminHeaderProps {
  adminName: string;
  adminRole: AdminRole;
  onLogout: () => void;
}

export default function AdminHeader({ adminName, adminRole, onLogout }: AdminHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getRoleIcon = () => {
    switch (adminRole) {
      case 'superadmin': return '👑';
      case 'finance': return '💰';
      case 'support': return '🎧';
      default: return '👤';
    }
  };

  const getRoleName = () => {
    switch (adminRole) {
      case 'superadmin': return 'Super Admin';
      case 'finance': return 'Finance';
      case 'support': return 'Support';
      default: return adminRole;
    }
  };

  const handleLogoutClick = () => {
    console.log('Logout button clicked');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('Logout cancelled')
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('Logging out, redirecting to homepage');
            router.replace('/(tabs)/');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        <HushRydLogo 
          size="small" 
          variant="horizontal" 
          color={colors.primary}
          showBackground={false}
          darkBackground={false}
        />
        <View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Admin Dashboard</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.adminInfo}>
          <Text style={[styles.roleIcon]}>{getRoleIcon()}</Text>
          <View>
            <Text style={[styles.adminName, { color: colors.text }]}>{adminName}</Text>
            <Text style={[styles.roleName, { color: colors.textSecondary }]}>{getRoleName()}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: '#ef4444' }]} 
          onPress={handleLogoutClick}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.medium,
  },
  subtitle: {
    fontSize: FontSizes.tiny,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.medium,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  roleIcon: {
    fontSize: FontSizes.large,
  },
  adminName: {
    fontSize: FontSizes.small,
    fontWeight: '700',
    textAlign: 'right',
  },
  roleName: {
    fontSize: FontSizes.tiny,
    textAlign: 'right',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.tiny,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 20,
  },
  logoutIcon: {
    fontSize: FontSizes.medium,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
});

