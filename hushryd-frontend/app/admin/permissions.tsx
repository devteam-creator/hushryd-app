import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { permissionsService } from '../../services/permissionsService';
import { PagePermission, RolePermissions } from '../../types/permissions';

export default function RolePermissionsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { admin } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<string>('support');
  const [permissions, setPermissions] = useState<RolePermissions[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Load permissions on component mount
  React.useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = () => {
    const allPermissions = permissionsService.getAllPermissions();
    setPermissions(allPermissions.roles);
  };

  const getRolePermissions = (role: string): PagePermission[] => {
    const rolePermissions = permissions.find(r => r.role === role);
    return rolePermissions ? rolePermissions.permissions : [];
  };

  const togglePermission = (role: string, pageId: string) => {
    const rolePermissions = getRolePermissions(role);
    const updatedPermissions = rolePermissions.map(permission => 
      permission.pageId === pageId 
        ? { ...permission, allowed: !permission.allowed }
        : permission
    );
    
    setPermissions(prev => 
      prev.map(r => 
        r.role === role 
          ? { ...r, permissions: updatedPermissions }
          : r
      )
    );
    
    setHasChanges(true);
  };

  const savePermissions = () => {
    if (!admin || !admin.name) return;
    
    const rolePermissions = getRolePermissions(selectedRole);
    permissionsService.updateRolePermissions(selectedRole, rolePermissions, admin.name);
    
    setHasChanges(false);
    Alert.alert('Success', `Permissions for ${selectedRole} role have been updated successfully!`);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Permissions',
      'Are you sure you want to reset all role permissions to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            permissionsService.resetToDefaults();
            loadPermissions();
            setHasChanges(false);
            Alert.alert('Success', 'All permissions have been reset to default values!');
          }
        },
      ]
    );
  };

  const availableRoles = permissionsService.getAvailableRoles();
  const currentRolePermissions = getRolePermissions(selectedRole);

  return (
    <ProtectedRoute requiredRole="superadmin" pageId="permissions">
      <AdminLayout title="Role Permissions" currentPage="permissions">
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Role Permissions</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Manage page access permissions for different user roles
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.lightGray }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Role Selector */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Role</Text>
            <View style={styles.roleSelector}>
              {availableRoles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    { backgroundColor: selectedRole === role ? colors.primary : colors.lightGray },
                    selectedRole === role && styles.selectedRoleButton,
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[
                    styles.roleButtonText,
                    { color: selectedRole === role ? '#FFFFFF' : colors.text }
                  ]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Permissions List */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Page Permissions for {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Role
            </Text>
            
            <View style={styles.permissionsList}>
              {currentRolePermissions.map((permission) => (
                <View key={permission.pageId} style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Text style={[styles.permissionName, { color: colors.text }]}>
                      {permission.pageName}
                    </Text>
                    <Text style={[styles.permissionId, { color: colors.textSecondary }]}>
                      {permission.pageId}
                    </Text>
                  </View>
                  <Switch
                    value={permission.allowed}
                    onValueChange={() => togglePermission(selectedRole, permission.pageId)}
                    trackColor={{ false: colors.mediumGray, true: colors.primary }}
                    thumbColor={permission.allowed ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton, { backgroundColor: colors.warning }]}
              onPress={resetToDefaults}
            >
              <Text style={styles.buttonText}>🔄 Reset to Defaults</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.saveButton, 
                { backgroundColor: hasChanges ? colors.primary : colors.mediumGray }
              ]}
              onPress={savePermissions}
              disabled={!hasChanges}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                💾 Save Changes
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: Spacing.xxxl }} />
        </ScrollView>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
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
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    opacity: 0.8,
  },
  backButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  roleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedRoleButton: {
    ...Shadows.small,
  },
  roleButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  permissionsList: {
    gap: Spacing.sm,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  permissionId: {
    fontSize: FontSizes.sm,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  resetButton: {},
  saveButton: {},
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
