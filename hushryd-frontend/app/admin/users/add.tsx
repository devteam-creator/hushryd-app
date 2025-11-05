import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../components/admin/AdminLayoutBasic';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/apiService';

export default function AddUserPage() {
  const { admin } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    address: '',
    emergencyContact: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Get admin token
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      // Prepare user data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isVerified: false,
        isActive: true
      };

      console.log('Creating user with data:', userData);

      // Call the API
      const response = await apiService.createUser(userData, token);
      
      console.log('API response:', response);

      if (response.success) {
        // Reset form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'user',
          address: '',
          emergencyContact: '',
        });
        
        Alert.alert(
          'Success',
          'User added successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to add user. Please try again.');
      }
    } catch (error) {
      console.error('Create user error:', error);
      Alert.alert('Error', 'Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add New User" currentPage="users">
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Users</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.title}>👤 User Information</Text>
          
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
              <Text style={styles.label}>Phone Number *</Text>
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

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter full address"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Contact</Text>
              <TextInput
                style={styles.input}
                value={formData.emergencyContact}
                onChangeText={(value) => handleInputChange('emergencyContact', value)}
                placeholder="Enter emergency contact number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Adding User...' : '➕ Add User'}
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
  textArea: {
    height: 80,
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
