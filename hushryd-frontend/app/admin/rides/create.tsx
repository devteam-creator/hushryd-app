import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../components/admin/AdminLayout';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';

export default function CreateRidePage() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    price: '',
    driverName: '',
    driverPhone: '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    capacity: '',
    description: '',
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
    if (!formData.from || !formData.to || !formData.date || !formData.time || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Ride created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Create New Ride" currentPage="rides">
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Rides</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.title}>🚗 Create New Ride</Text>
          
          {/* Route Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>From *</Text>
              <TextInput
                style={styles.input}
                value={formData.from}
                onChangeText={(value) => handleInputChange('from', value)}
                placeholder="Enter departure city"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>To *</Text>
              <TextInput
                style={styles.input}
                value={formData.to}
                onChangeText={(value) => handleInputChange('to', value)}
                placeholder="Enter destination city"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={(value) => handleInputChange('date', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Time *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.time}
                  onChangeText={(value) => handleInputChange('time', value)}
                  placeholder="HH:MM"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(value) => handleInputChange('price', value)}
                placeholder="Enter price per seat"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Driver Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Driver Information</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Driver Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.driverName}
                  onChangeText={(value) => handleInputChange('driverName', value)}
                  placeholder="Enter driver name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Driver Phone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.driverPhone}
                  onChangeText={(value) => handleInputChange('driverPhone', value)}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Vehicle Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Make</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleMake}
                  onChangeText={(value) => handleInputChange('vehicleMake', value)}
                  placeholder="e.g., Toyota"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleModel}
                  onChangeText={(value) => handleInputChange('vehicleModel', value)}
                  placeholder="e.g., Innova"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>License Plate</Text>
                <TextInput
                  style={styles.input}
                  value={formData.licensePlate}
                  onChangeText={(value) => handleInputChange('licensePlate', value)}
                  placeholder="e.g., TS09AB1234"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Capacity</Text>
                <TextInput
                  style={styles.input}
                  value={formData.capacity}
                  onChangeText={(value) => handleInputChange('capacity', value)}
                  placeholder="Number of seats"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Additional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholder="Enter ride description or special notes"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
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
                {loading ? 'Creating Ride...' : '🚗 Create Ride'}
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
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputGroup: {
    flex: 1,
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
