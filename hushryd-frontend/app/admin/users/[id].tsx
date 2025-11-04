import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../components/admin/AdminLayoutBasic';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/apiService';

export default function UserViewPage() {
  const { admin } = useAuth();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from API
  const loadUser = async () => {
    try {
      setLoading(true);
      const token = await apiService.getToken();
      
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      const response = await apiService.getUserById(id as string, token);
      
      if (response.success) {
        setUser(response.data.user);
      } else {
        Alert.alert('Error', response.message || 'Failed to load user details');
        router.back();
      }

    } catch (error) {
      console.error('Error loading user:', error);
      Alert.alert('Error', 'Failed to load user details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const formatUserName = (user: any) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#10B981' : '#6B7280';
  };

  const getRoleColor = (role: string) => {
    return role === 'driver' ? '#3B82F6' : '#8B5CF6';
  };

  const handleEditUser = () => {
    router.push(`/admin/users/edit/${id}` as any);
  };

  if (loading) {
    return (
      <AdminLayout title="User Details" currentPage="users">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading user details...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Details" currentPage="users">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back to Users</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Details" currentPage="users">
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Users</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.userCard}>
          <Text style={styles.title}>👤 User Information</Text>
          
          {/* User Avatar and Basic Info */}
          <View style={styles.userHeader}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.role === 'driver' ? '🚗' : '👤'}
              </Text>
            </View>
            <View style={styles.userBasicInfo}>
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
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>First Name:</Text>
              <Text style={styles.infoValue}>{user.firstName || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Name:</Text>
              <Text style={styles.infoValue}>{user.lastName || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user.phone || 'Not provided'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>
                {user.role === 'driver' ? 'Driver' : 'User'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Verified:</Text>
              <Text style={styles.infoValue}>
                {user.isVerified ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {/* Account Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue}>{user.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>{formatDate(user.updatedAt)}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditUser}>
              <Text style={styles.editButtonText}>✏️ Edit User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  backButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.lg,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  userAvatarText: {
    fontSize: 32,
  },
  userBasicInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.md,
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
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: '#111827',
    flex: 2,
    textAlign: 'right',
  },
  actionsSection: {
    marginTop: Spacing.xl,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});