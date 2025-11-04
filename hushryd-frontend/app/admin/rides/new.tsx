import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from '../../../components/DatePicker';
import AdminLayout from '../../../components/admin/AdminLayoutBasic';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/apiService';

export default function NewRidePage() {
  const { admin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    pickupDate: '',
    pickupTime: '',
    timeslot: '',
    fare: '',
    distance: '',
    duration: '',
    notes: '',
  });

  const [pickupDateValue, setPickupDateValue] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Available time slots
  const timeSlots = [
    { id: 'morning', label: 'Morning (6:00 AM - 12:00 PM)', value: 'morning' },
    { id: 'afternoon', label: 'Afternoon (12:00 PM - 6:00 PM)', value: 'afternoon' },
    { id: 'evening', label: 'Evening (6:00 PM - 12:00 AM)', value: 'evening' },
    { id: 'night', label: 'Night (12:00 AM - 6:00 AM)', value: 'night' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      pickupDate: dateString
    }));
    setPickupDateValue(date);
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      pickupTime: time
    }));
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.fromLocation || !formData.toLocation || !formData.pickupDate || 
        !formData.pickupTime || !formData.timeslot || !formData.fare) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Fare validation
    const fare = parseFloat(formData.fare);
    if (isNaN(fare) || fare <= 0) {
      Alert.alert('Error', 'Please enter a valid fare amount');
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

      // Prepare ride data
      // Convert string locations to objects if they're not already objects
      const fromLoc = typeof formData.fromLocation === 'string' 
        ? formData.fromLocation 
        : formData.fromLocation;
      const toLoc = typeof formData.toLocation === 'string'
        ? formData.toLocation
        : formData.toLocation;
      
      const rideData = {
        fromLocation: fromLoc,
        toLocation: toLoc,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        timeslot: formData.timeslot,
        fare: fare,
        distance: formData.distance ? parseFloat(formData.distance) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        notes: formData.notes || null
      };

      console.log('Creating ride with data:', rideData);

      // Call the API
      const response = await apiService.createRide(rideData, token);
      
      console.log('API response:', response);

      if (response.success) {
        // Reset form fields
        setFormData({
          fromLocation: '',
          toLocation: '',
          pickupDate: '',
          pickupTime: '',
          timeslot: '',
          fare: '',
          distance: '',
          duration: '',
          notes: '',
        });
        
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
      } else {
        Alert.alert('Error', response.message || 'Failed to create ride. Please try again.');
      }
    } catch (error) {
      console.error('Create ride error:', error);
      Alert.alert('Error', 'Failed to create ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
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
          
          {/* Location Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>From Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.fromLocation}
                onChangeText={(value) => handleInputChange('fromLocation', value)}
                placeholder="Enter pickup location"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>To Location *</Text>
              <TextInput
                style={styles.input}
                value={formData.toLocation}
                onChangeText={(value) => handleInputChange('toLocation', value)}
                placeholder="Enter destination"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Date and Time Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time Information</Text>
            
            <View style={styles.inputGroup}>
              <DatePicker
                label="Pickup Date *"
                value={pickupDateValue || new Date()}
                onChange={handleDateChange}
                minimumDate={new Date()}
                placeholder="Select pickup date"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pickup Time *</Text>
              <TouchableOpacity 
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {formData.pickupTime || 'Select Time'}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <View style={styles.dateTimePicker}>
                  <TextInput
                    style={styles.input}
                    value={formData.pickupTime}
                    onChangeText={(value) => handleTimeChange(value)}
                    placeholder="HH:MM"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity 
                    style={styles.pickerButton}
                    onPress={() => handleTimeChange(getCurrentTime())}
                  >
                    <Text style={styles.pickerButtonText}>Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time Slot *</Text>
              <View style={styles.timeSlotContainer}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.timeSlotOption,
                      formData.timeslot === slot.value && styles.timeSlotOptionSelected
                    ]}
                    onPress={() => handleInputChange('timeslot', slot.value)}
                  >
                    <Text style={[
                      styles.timeSlotOptionText,
                      formData.timeslot === slot.value && styles.timeSlotOptionTextSelected
                    ]}>
                      {slot.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Fare and Additional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fare & Additional Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fare Amount *</Text>
              <TextInput
                style={styles.input}
                value={formData.fare}
                onChangeText={(value) => handleInputChange('fare', value)}
                placeholder="Enter fare amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Distance (km)</Text>
              <TextInput
                style={styles.input}
                value={formData.distance}
                onChangeText={(value) => handleInputChange('distance', value)}
                placeholder="Enter distance in kilometers"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (hours)</Text>
              <TextInput
                style={styles.input}
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                placeholder="Enter duration in hours"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                placeholder="Enter any additional notes"
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
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: '#FFFFFF',
  },
  dateTimeButtonText: {
    fontSize: FontSizes.md,
    color: '#9CA3AF',
  },
  dateTimePicker: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pickerButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  pickerButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  timeSlotContainer: {
    gap: Spacing.sm,
  },
  timeSlotOption: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  timeSlotOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF8FF',
  },
  timeSlotOptionText: {
    fontSize: FontSizes.md,
    color: '#6B7280',
  },
  timeSlotOptionTextSelected: {
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
