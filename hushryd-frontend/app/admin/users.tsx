import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayoutBasic';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';

const { width } = Dimensions.get('window');

export default function AdminUsersPage() {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDrivers: 0,
    newThisMonth: 0
  });

  // Load users data from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Check if admin is logged in
      if (!admin) {
        Alert.alert('Error', 'Please log in to view users');
        return;
      }

      // Get token from AuthContext
      const token = await apiService.getToken();
      
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      console.log('Loading users with token:', token.substring(0, 20) + '...');

      // Fetch users
      const usersResponse = await apiService.getUsers(token);
      console.log('Users API response:', usersResponse);
      
      if (usersResponse.success) {
        setUsers(usersResponse.data.users || []);
        console.log('Users loaded:', usersResponse.data.users?.length || 0);
      } else {
        console.error('Failed to load users:', usersResponse.message);
        setUsers([]);
      }

      // Fetch user stats
      const statsResponse = await apiService.getUserStats(token);
      console.log('Stats API response:', statsResponse);
      
      if (statsResponse.success) {
        setStats({
          totalUsers: statsResponse.data.stats.totalUsers || 0,
          activeUsers: statsResponse.data.stats.activeUsers || 0,
          totalDrivers: statsResponse.data.stats.totalDrivers || 0,
          newThisMonth: statsResponse.data.stats.newThisMonth || 0
        });
      }

    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users data');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#10B981' : '#6B7280';
  };

  const getRoleColor = (role: string) => {
    return role === 'driver' ? '#3B82F6' : '#8B5CF6';
  };

  const formatUserName = (user: any) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
  };

  const formatJoinDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleViewUser = (userId: string) => {
    console.log('Viewing user:', userId);
    // Navigate to user details page
    router.push(`/admin/users/${userId}` as any);
  };

  const handleEditUser = (userId: string) => {
    console.log('Editing user:', userId);
    // Navigate to edit user page
    router.push(`/admin/users/edit/${userId}` as any);
  };

  const handleAddUser = () => {
    console.log('Adding new user');
    // Navigate to add user page
    router.push('/admin/users/add' as any);
  };

  return (
    <ProtectedRoute pageId="users">
      <AdminLayout title="User Management" currentPage="users">
      {/* User Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>User Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalDrivers}</Text>
            <Text style={styles.statLabel}>Active Drivers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.newThisMonth}</Text>
            <Text style={styles.statLabel}>New This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>Active Rate</Text>
          </View>
        </View>
      </View>

      {/* User List */}
      <View style={styles.usersSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Users</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.refreshButton} onPress={loadUsers}>
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
              <Text style={styles.addButtonText}>+ Add User</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            {users.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No users found</Text>
                <Text style={styles.emptyStateSubtext}>Add your first user to get started</Text>
              </View>
            ) : (
              users.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {user.role === 'driver' ? '🚗' : '👤'}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{formatUserName(user)}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.userMeta}>
                      <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                        <Text style={styles.roleText}>
                          {user.role === 'driver' ? 'Driver' : 'User'}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.isActive) }]}>
                        <Text style={styles.statusText}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.userActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleEditUser(user.id)}>
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleViewUser(user.id)}>
                      <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.small,
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    textAlign: 'center',
  },
  usersSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  refreshButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#374151',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  usersList: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  userAvatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    marginBottom: Spacing.sm,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  roleText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F3F4F6',
    marginLeft: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#374151',
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginTop: Spacing.md,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    textAlign: 'center',
  },
});