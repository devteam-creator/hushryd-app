import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../../components/useColorScheme';
import Colors from '../../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';
import { apiService } from '../../../services/apiService';
import { AdminRole } from '../../../types/models';

export default function AddAdminPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'support' as AdminRole,
  });

  const roles: AdminRole[] = ['super_admin', 'admin', 'support', 'finance'];

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = await apiService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await apiService.createAdminUser(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        token
      );

      if (response.success) {
        Alert.alert('Success', 'Admin created successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        throw new Error(response.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      Alert.alert('Error', 'Failed to create admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout title="Add New Admin" currentPage="admins">
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Details</Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>First Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter first name"
                placeholderTextColor={colors.textSecondary}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Last Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter last name"
                placeholderTextColor={colors.textSecondary}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Password *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Role *</Text>
              <View style={styles.roleContainer}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor: formData.role === role ? colors.primary : colors.background,
                        borderColor: formData.role === role ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setFormData({ ...formData, role })}
                  >
                    <Text
                      style={{
                        color: formData.role === role ? '#FFFFFF' : colors.text,
                        fontWeight: formData.role === role ? '600' : 'normal',
                      }}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: colors.border }]}
                onPress={() => router.back()}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Admin'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  roleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    // backgroundColor already set from colors
  },
  submitButton: {
    // backgroundColor already set from colors
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
