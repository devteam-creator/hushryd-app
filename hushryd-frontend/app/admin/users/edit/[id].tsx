import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../../components/admin/AdminLayoutBasic';
import { BorderRadius, FontSizes, Spacing } from '../../../../constants/Design';
import { useAuth } from '../../../../contexts/AuthContext';
import { apiService } from '../../../../services/apiService';

export default function UserEditPage() {
  const { admin } = useAuth();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true,
    isVerified: false,
  });

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
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || 'user',
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          isVerified: userData.isVerified !== undefined ? userData.isVerified : false,
        });
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setSaving(true);
    
    try {
      // Get admin token
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
        isVerified: formData.isVerified
      };

      console.log('Updating user with data:', updateData);

      // Call the API
      const response = await apiService.updateUser(id as string, updateData, token);
      
      console.log('API response:', response);

      if (response.success) {
        Alert.alert(
          'Success',
          'User updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to update user. Please try again.');
      }
    } catch (error) {
      console.error('Update user error:', error);
      Alert.alert('Error', 'Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit User" currentPage="users">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading user details...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="Edit User" currentPage="users">
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
    <AdminLayout title="Edit User" currentPage="users">
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Users</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.title}>✏️ Edit User Information</Text>
          
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Enter first name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Enter last name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'user' && styles.roleOptionSelected
                  ]}
                  onPress={() => handleInputChange('role', 'user')}
                >
                  <Text style={[
                    styles.roleOptionText,
                    formData.role === 'user' && styles.roleOptionTextSelected
                  ]}>
                    👤 User
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    formData.role === 'driver' && styles.roleOptionSelected
                  ]}
                  onPress={() => handleInputChange('role', 'driver')}
                >
                  <Text style={[
                    styles.roleOptionText,
                    formData.role === 'driver' && styles.roleOptionTextSelected
                  ]}>
                    🚗 Driver
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <View style={styles.toggleGroup}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Active Status</Text>
                <TouchableOpacity
                  style={[
                    styles.toggle,
                    formData.isActive && styles.toggleActive
                  ]}
                  onPress={() => handleInputChange('isActive', !formData.isActive)}
                >
                  <Text style={[
                    styles.toggleText,
                    formData.isActive && styles.toggleTextActive
                  ]}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Verified Status</Text>
                <TouchableOpacity
                  style={[
                    styles.toggle,
                    formData.isVerified && styles.toggleActive
                  ]}
                  onPress={() => handleInputChange('isVerified', !formData.isVerified)}
                >
                  <Text style={[
                    styles.toggleText,
                    formData.isVerified && styles.toggleTextActive
                  ]}>
                    {formData.isVerified ? 'Verified' : 'Unverified'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.submitButton, saving && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
  formCard: {
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
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#374151',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleOption: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  roleOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  roleOptionText: {
    fontSize: FontSizes.md,
    color: '#6B7280',
  },
  roleOptionTextSelected: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  toggleGroup: {
    gap: Spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  toggleLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#374151',
  },
  toggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  toggleActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  toggleText: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  actionsSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#374151',
  },
});
