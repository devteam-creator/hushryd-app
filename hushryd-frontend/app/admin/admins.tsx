import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { apiService } from '../../services/apiService';
import { notificationService } from '../../services/notificationService';
import { permissionsService } from '../../services/permissionsService';
import { AdminUser, realDatabaseService } from '../../services/realDatabaseService';
import { AdminRole } from '../../types/models';
import { PagePermission } from '../../types/permissions';


export default function AdminsManagement() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'support' as AdminRole });
  const [editAdmin, setEditAdmin] = useState({ name: '', email: '', role: 'support' as AdminRole });
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [editPermissions, setEditPermissions] = useState<PagePermission[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const token = await apiService.getToken();
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await apiService.getAdminUsers(token);
      if (response.success && response.data && response.data.admins) {
        // Transform backend admin data to match frontend AdminUser interface
        const transformedAdmins = response.data.admins.map((admin: any) => ({
          id: admin.id,
          name: `${admin.firstName} ${admin.lastName}`,
          email: admin.email,
          role: admin.role,
          status: admin.isActive ? 'active' : 'inactive',
          department: 'General',
          permissions: admin.permissions || [],
          createdAt: admin.createdAt || new Date().toISOString(),
          lastLogin: admin.lastLogin || 'Never',
        }));
        setAdmins(transformedAdmins);
      } else {
        console.error('Failed to load admins:', response.message);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      // Fall back to local database service if API fails
      const allAdminUsers = realDatabaseService.getAllAdminUsers();
      setAdmins(allAdminUsers);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => router.replace('/(tabs)/' as any) },
    ]);
  };

  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setEditAdmin({
      name: admin.name,
      email: admin.email,
      role: admin.role as AdminRole,
    });
    setShowEditModal(true);
  };

  const handleEditPermissions = (admin: any) => {
    setSelectedAdmin(admin);
    // Load current permissions for this role
    let currentPermissions = permissionsService.getRolePermissions(admin.role);
    
    // If no permissions found (e.g., new role or localStorage cleared), 
    // generate default permissions with all pages set to false
    if (!currentPermissions || currentPermissions.length === 0) {
      console.log('No permissions found for role:', admin.role, '- creating default permissions');
      // Import ADMIN_PAGES dynamically to avoid issues
      const { ADMIN_PAGES } = require('../../types/permissions');
      currentPermissions = ADMIN_PAGES.map((page: any) => ({
        pageId: page.id,
        pageName: page.name,
        allowed: false, // Start with all pages disabled
      }));
    }
    
    console.log('Loaded permissions for', admin.role, ':', currentPermissions.length, 'pages');
    setEditPermissions(currentPermissions);
    setShowPermissionsModal(true);
  };

  const handleTogglePermission = (pageId: string) => {
    setEditPermissions(prev => 
      prev.map(permission => 
        permission.pageId === pageId 
          ? { ...permission, allowed: !permission.allowed }
          : permission
      )
    );
  };

  const handleSaveAdmin = async () => {
    if (!selectedAdmin || !editAdmin.name || !editAdmin.email) {
      notificationService.showError('Please fill in all fields');
      return;
    }

    try {
      const token = await apiService.getToken();
      if (!token) {
        notificationService.showError('Authentication required. Please log in again.');
        return;
      }

      // Split name into firstName and lastName
      const nameParts = editAdmin.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Update the admin user via API
      const userData: any = {
        firstName,
        lastName,
        email: editAdmin.email,
        role: editAdmin.role,
        isActive: true,
        permissions: [],
      };

      const response = await apiService.updateAdminUser(selectedAdmin.id, userData, token);
      
      if (response.success) {
        // Reload admins list
        await loadAdmins();
        
        // Show success notification
        notificationService.showSuccess(`Admin "${editAdmin.name}" has been updated successfully!`);
        
        // Reset form and close modal
        setShowEditModal(false);
        setSelectedAdmin(null);
      } else {
        notificationService.showError(response.message || 'Failed to update admin');
      }
    } catch (error) {
      notificationService.showError('Failed to update admin. Please try again.');
      console.error('Error updating admin:', error);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;
    
    try {
      // Update local storage
      permissionsService.updateRolePermissions(
        selectedAdmin.role, 
        editPermissions, 
        'Admin Management'
      );
      
      // Update backend API
      const token = await apiService.getToken();
      if (token) {
        // Create the permissions update payload
        const permissionsData = {
          permissions: editPermissions.map(p => ({
            pageId: p.pageId,
            pageName: p.pageName,
            allowed: p.allowed
          }))
        };
        
        // Use the updateAdminUser API to save permissions
        const response = await apiService.updateAdminUser(
          selectedAdmin.id, 
          { permissions: permissionsData.permissions as any }, 
          token
        );
        
        if (response.success) {
          notificationService.showSuccess(`Permissions for ${selectedAdmin.name} have been updated successfully!`);
        } else {
          console.error('Failed to save permissions to backend:', response.message);
          // Still show success for local storage update
          Alert.alert('Success', `Permissions for ${selectedAdmin.name} have been updated locally!`);
        }
      }
      
      setShowPermissionsModal(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error saving permissions:', error);
      notificationService.showError('Failed to save permissions. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedAdmin(null);
    setEditAdmin({ name: '', email: '', role: 'support' as AdminRole });
  };

  const handleCancelPermissions = () => {
    setShowPermissionsModal(false);
    setSelectedAdmin(null);
    setEditPermissions([]);
  };

  const handleDeleteAdmin = (admin: AdminUser) => {
    Alert.alert(
      'Delete Admin',
      `Are you sure you want to delete ${admin.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await apiService.getToken();
              if (!token) {
                notificationService.showError('Authentication required. Please log in again.');
                return;
              }
              
              const response = await apiService.deleteAdminUser(admin.id, token);
              
              if (response.success) {
                await loadAdmins();
                notificationService.showSuccess(`${admin.name} has been deleted successfully!`);
              } else {
                notificationService.showError(response.message || 'Failed to delete admin');
              }
            } catch (error) {
              notificationService.showError('Failed to delete admin. Please try again.');
              console.error('Error deleting admin:', error);
            }
          },
        },
      ]
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return '👑';
      case 'admin': return '👨‍💼';
      case 'manager': return '📊';
      case 'finance': return '💰';
      case 'support': return '🎧';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return '#8b5cf6';
      case 'admin': return '#3b82f6';
      case 'manager': return '#f59e0b';
      case 'finance': return '#10b981';
      case 'support': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'suspended': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email) {
      notificationService.showError('Please fill in all fields');
      return;
    }

    try {
      const token = await apiService.getToken();
      if (!token) {
        notificationService.showError('Authentication required. Please log in again.');
        return;
      }

      // Split name into firstName and lastName
      const nameParts = newAdmin.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create new admin user via API
      const userData: any = {
        firstName,
        lastName,
        email: newAdmin.email,
        role: newAdmin.role,
        isActive: true,
        permissions: [],
      };

      const response = await apiService.createAdminUser(userData, token);
      
      if (response.success) {
        // Reload admins list
        await loadAdmins();
        
        // Show success notification
        notificationService.showSuccess(`Admin "${newAdmin.name}" has been created successfully!`);
        
        // Reset form
        setNewAdmin({ name: '', email: '', role: 'support' as AdminRole });
        setShowAddModal(false);
      } else {
        notificationService.showError(response.message || 'Failed to create admin');
      }
    } catch (error) {
      notificationService.showError('Failed to create admin. Please try again.');
      console.error('Error creating admin:', error);
    }
  };

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Admin',
      width: 200,
      render: (value, row) => (
        <View style={styles.adminCell}>
          <View style={[styles.avatar, { backgroundColor: getRoleColor(row.role) + '20' }]}>
            <Text style={styles.avatarIcon}>{getRoleIcon(row.role)}</Text>
          </View>
          <View>
            <Text style={[styles.adminName, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.adminEmail, { color: colors.textSecondary }]}>{row.email}</Text>
          </View>
        </View>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      width: 150,
      render: (value) => (
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(value) + '20' }]}>
          <Text style={styles.roleBadgeIcon}>{getRoleIcon(value)}</Text>
          <Text style={[styles.roleBadgeText, { color: getRoleColor(value) }]}>
            {value === 'superadmin' ? 'Super Admin' : value.charAt(0).toUpperCase() + value.slice(1)}
          </Text>
        </View>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 100,
      render: (value) => (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(value) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(value) }]}>{value}</Text>
        </View>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      width: 150,
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: 120,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 250,
      render: (_, row) => (
        <View style={styles.actionsCell}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => handleEditAdmin(row)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#f59e0b' + '20' }]}
            onPress={() => handleEditPermissions(row)}
          >
            <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Permissions</Text>
          </TouchableOpacity>
          {row.role !== 'superadmin' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#ef4444' + '20' }]}
              onPress={() => handleDeleteAdmin(row)}
            >
              <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole="superadmin" pageId="admins">
      <AdminLayout title="Admin Management" currentPage="admins">
      <View style={styles.content}>
        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={styles.mainContent}>
            <View style={styles.pageHeader}>
              <View>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Admin Management</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
                  Manage admin users and their permissions
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={[styles.refreshButton, { backgroundColor: colors.secondary }]}
                  onPress={loadAdmins}
                >
                  <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/admin/admins/add')}
                >
                  <Text style={styles.addButtonText}>+ Add Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <StatCard icon="🛡️" label="Total Admins" value={admins.length.toString()} color="#8b5cf6" />
              <StatCard icon="👑" label="Super Admins" value={admins.filter(a => a.role === 'superadmin').length.toString()} color="#8b5cf6" />
              <StatCard icon="👨‍💼" label="Admins" value={admins.filter(a => a.role === 'admin').length.toString()} color="#3b82f6" />
              <StatCard icon="📊" label="Managers" value={admins.filter(a => a.role === 'manager').length.toString()} color="#f59e0b" />
              <StatCard icon="💰" label="Finance Team" value={admins.filter(a => a.role === 'finance').length.toString()} color="#10b981" />
              <StatCard icon="🎧" label="Support Team" value={admins.filter(a => a.role === 'support').length.toString()} color="#ef4444" />
            </View>

            {/* Admins Table */}
            <View style={styles.tableContainer}>
              <DataTable
                columns={columns}
                data={admins}
                onRowPress={(row) => console.log('Admin clicked:', row)}
                emptyMessage="No admins found"
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Add Admin Modal */}
      <Modal visible={showAddModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.large]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Admin</Text>

            <View style={styles.modalForm}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.lightGray, color: colors.text }]}
                  placeholder="Enter name"
                  placeholderTextColor={colors.textSecondary}
                  value={newAdmin.name}
                  onChangeText={(text) => setNewAdmin(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.lightGray, color: colors.text }]}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  value={newAdmin.email}
                  onChangeText={(text) => setNewAdmin(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Role</Text>
                <View style={styles.roleSelector}>
                  {['superadmin', 'admin', 'manager', 'finance', 'support'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        { backgroundColor: newAdmin.role === role ? colors.primary : colors.lightGray }
                      ]}
                      onPress={() => setNewAdmin(prev => ({ ...prev, role: role as AdminRole }))}
                    >
                      <Text style={styles.roleOptionIcon}>{getRoleIcon(role)}</Text>
                      <Text style={[styles.roleOptionText, { color: newAdmin.role === role ? '#FFFFFF' : colors.text }]}>
                        {role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.lightGray }]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddAdmin}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Create Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal visible={showEditModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }, Shadows.large]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Admin</Text>

            <View style={styles.modalForm}>
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.lightGray, color: colors.text }]}
                  placeholder="Enter name"
                  placeholderTextColor={colors.textSecondary}
                  value={editAdmin.name}
                  onChangeText={(text) => setEditAdmin(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.lightGray, color: colors.text }]}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  value={editAdmin.email}
                  onChangeText={(text) => setEditAdmin(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Role</Text>
                <View style={styles.roleSelector}>
                  {['superadmin', 'admin', 'manager', 'finance', 'support'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        { backgroundColor: editAdmin.role === role ? colors.primary : colors.lightGray }
                      ]}
                      onPress={() => setEditAdmin(prev => ({ ...prev, role: role as AdminRole }))}
                    >
                      <Text style={styles.roleOptionIcon}>{getRoleIcon(role)}</Text>
                      <Text style={[styles.roleOptionText, { color: editAdmin.role === role ? '#FFFFFF' : colors.text }]}>
                        {role === 'superadmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.lightGray }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  onPress={handleSaveAdmin}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal
        visible={showPermissionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelPermissions}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Permissions - {selectedAdmin?.name}
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Role: {selectedAdmin?.role} | Email: {selectedAdmin?.email}
              </Text>
            </View>

            <ScrollView style={styles.permissionsContainer} showsVerticalScrollIndicator={false}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Select pages that {selectedAdmin?.role} role can access:
              </Text>
              
              {editPermissions.map((permission) => (
                <View key={permission.pageId} style={styles.permissionItem}>
                  <View style={styles.permissionInfo}>
                    <Text style={[styles.permissionName, { color: colors.text }]}>
                      {permission.pageName}
                    </Text>
                    <Text style={[styles.permissionId, { color: colors.textSecondary }]}>
                      {permission.pageId}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      { 
                        backgroundColor: permission.allowed ? colors.primary : colors.lightGray,
                        borderColor: permission.allowed ? colors.primary : colors.mediumGray
                      }
                    ]}
                    onPress={() => handleTogglePermission(permission.pageId)}
                  >
                    {permission.allowed && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.lightGray }]}
                onPress={handleCancelPermissions}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSavePermissions}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save Permissions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </AdminLayout>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }, Shadows.small]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIconText}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
    padding: Spacing.medium,
  },
  backIcon: {
    fontSize: FontSizes.large,
  },
  backText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
  main: {
    flex: 1,
  },
  mainContent: {
    padding: Spacing.large,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  pageTitle: {
    fontSize: FontSizes.extraLarge * 1.2,
    fontWeight: '800',
  },
  pageSubtitle: {
    fontSize: FontSizes.medium,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.small,
  },
  refreshButton: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  addButton: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderRadius: BorderRadius.medium,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginBottom: Spacing.large,
  },
  statCard: {
    flex: 1,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.small,
  },
  statIconText: {
    fontSize: FontSizes.large,
  },
  statValue: {
    fontSize: FontSizes.large,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: FontSizes.tiny,
  },
  tableContainer: {
    marginBottom: Spacing.large,
  },
  adminCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: FontSizes.medium,
  },
  adminName: {
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  adminEmail: {
    fontSize: FontSizes.tiny,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.tiny,
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  roleBadgeIcon: {
    fontSize: FontSizes.tiny,
  },
  roleBadgeText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actionsCell: {
    flexDirection: 'row',
    gap: Spacing.tiny,
  },
  actionButton: {
    paddingHorizontal: Spacing.small,
    paddingVertical: 4,
    borderRadius: BorderRadius.small,
  },
  actionButtonText: {
    fontSize: FontSizes.tiny,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: BorderRadius.large,
    padding: Spacing.extraLarge,
  },
  modalTitle: {
    fontSize: FontSizes.extraLarge,
    fontWeight: '800',
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  modalForm: {
    gap: Spacing.medium,
  },
  inputWrapper: {
    gap: Spacing.tiny,
  },
  inputLabel: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  input: {
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    fontSize: FontSizes.medium,
  },
  roleSelector: {
    gap: Spacing.small,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.small,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
  },
  roleOptionIcon: {
    fontSize: FontSizes.medium,
  },
  roleOptionText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginTop: Spacing.medium,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: FontSizes.small,
    fontWeight: '700',
  },
  // Edit Modal Styles
  permissionsContainer: {
    maxHeight: 400,
    marginVertical: Spacing.medium,
  },
  sectionTitle: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
    borderRadius: BorderRadius.medium,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: Spacing.small,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionName: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  permissionId: {
    fontSize: FontSizes.small,
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.small,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  modalHeader: {
    marginBottom: Spacing.medium,
  },
  modalSubtitle: {
    fontSize: FontSizes.small,
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
});

