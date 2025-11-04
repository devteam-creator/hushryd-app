import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../../components/useColorScheme';
import Colors from '../../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';

export default function NewTicketPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'other',
    priority: 'medium',
    description: '',
  });

  const categories = ['payment', 'verification', 'ride_issue', 'account', 'other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleSubmit = async () => {
    if (!formData.subject.trim()) {
      Alert.alert('Validation Error', 'Please enter a subject');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to create ticket
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert('Success', 'Ticket created successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating ticket:', error);
      Alert.alert('Error', 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return '💳';
      case 'verification': return '✅';
      case 'ride_issue': return '🚗';
      case 'account': return '👤';
      case 'other': return '📝';
      default: return '🎫';
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout title="Create New Ticket" currentPage="tickets">
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ticket Details</Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Subject *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter ticket subject"
                placeholderTextColor={colors.textSecondary}
                value={formData.subject}
                onChangeText={(text) => setFormData({ ...formData, subject: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.pickerContainer}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.pickerOption,
                      {
                        backgroundColor: formData.category === category ? colors.primary : colors.background,
                        borderColor: formData.category === category ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, category })}
                  >
                    <Text style={styles.pickerIcon}>{getCategoryIcon(category)}</Text>
                    <Text style={[
                      styles.pickerOptionText,
                      { color: formData.category === category ? '#FFFFFF' : colors.text }
                    ]}>
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
              <View style={styles.pickerContainer}>
                {priorities.map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.pickerOption,
                      {
                        backgroundColor: formData.priority === priority ? colors.primary : colors.background,
                        borderColor: formData.priority === priority ? colors.primary : colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, priority })}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      { color: formData.priority === priority ? '#FFFFFF' : colors.text }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter ticket description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={6}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
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
                <Text style={styles.buttonText}>
                  {loading ? 'Creating...' : 'Create Ticket'}
                </Text>
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
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  pickerIcon: {
    fontSize: FontSizes.md,
  },
  pickerOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
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
