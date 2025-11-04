import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from '../../../components/DatePicker';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../../components/useColorScheme';
import Colors from '../../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/apiService';

type DiscountType = 'percentage' | 'fixed';
type ApplicableTo = 'all' | 'new_users' | 'specific_users';

export default function NewOfferPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user: adminUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as DiscountType,
    discountValue: '',
    minAmount: '',
    maxDiscount: '',
    maxUses: '',
    isActive: true,
    applicableTo: 'all' as ApplicableTo,
  });

  const [validFrom, setValidFrom] = useState(new Date());
  const [validUntil, setValidUntil] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now

  const handleSubmit = async () => {
    try {
      if (!formData.code || !formData.title || !formData.discountValue) {
        Alert.alert('Validation Error', 'Please fill in all required fields');
        return;
      }

      const token = await apiService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const offerData = {
        code: formData.code.toUpperCase(),
        title: formData.title,
        description: formData.description || '',
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minAmount: parseFloat(formData.minAmount) || 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        validFrom: validFrom.toISOString().split('T')[0],
        validUntil: validUntil.toISOString().split('T')[0],
        isActive: formData.isActive,
        applicableTo: formData.applicableTo,
      };

      const response = await apiService.createOffer(offerData, token);
      if (response.success) {
        Alert.alert('Success', 'Offer created successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        throw new Error(response.message || 'Failed to create offer');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      Alert.alert('Error', 'Failed to create offer. Please try again.');
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout title="Create New Offer" currentPage="offers">
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Offer Details</Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Code *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g., WELCOME50"
                placeholderTextColor={colors.textSecondary}
                value={formData.code}
                onChangeText={(text) => setFormData({ ...formData, code: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g., Welcome Offer"
                placeholderTextColor={colors.textSecondary}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Offer description"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Discount Type *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioButton, { borderColor: formData.discountType === 'percentage' ? colors.primary : colors.border }]}
                  onPress={() => setFormData({ ...formData, discountType: 'percentage' })}
                >
                  <View style={[styles.radioCircle, { backgroundColor: formData.discountType === 'percentage' ? colors.primary : 'transparent' }]} />
                  <Text style={{ color: colors.text }}>Percentage</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, { borderColor: formData.discountType === 'fixed' ? colors.primary : colors.border }]}
                  onPress={() => setFormData({ ...formData, discountType: 'fixed' })}
                >
                  <View style={[styles.radioCircle, { backgroundColor: formData.discountType === 'fixed' ? colors.primary : 'transparent' }]} />
                  <Text style={{ color: colors.text }}>Fixed Amount</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Discount Value *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="e.g., 50 for 50% or ₹50"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={formData.discountValue}
                onChangeText={(text) => setFormData({ ...formData, discountValue: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Minimum Amount (₹)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={formData.minAmount}
                onChangeText={(text) => setFormData({ ...formData, minAmount: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Max Discount (₹)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Leave empty for no limit"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={formData.maxDiscount}
                onChangeText={(text) => setFormData({ ...formData, maxDiscount: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Max Uses</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="Leave empty for unlimited"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={formData.maxUses}
                onChangeText={(text) => setFormData({ ...formData, maxUses: text })}
              />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.xl }]}>Validity Period</Text>

            <View style={styles.formGroup}>
              <DatePicker
                label="Valid From *"
                value={validFrom}
                onChange={(date) => setValidFrom(date)}
                minimumDate={new Date()}
                placeholder="Select start date"
              />
            </View>

            <View style={styles.formGroup}>
              <DatePicker
                label="Valid Until *"
                value={validUntil}
                onChange={(date) => setValidUntil(date)}
                minimumDate={validFrom}
                placeholder="Select end date"
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={[styles.label, { color: colors.text }]}>Active</Text>
                <TouchableOpacity
                  style={[styles.switch, { backgroundColor: formData.isActive ? colors.primary : colors.border }]}
                  onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
                >
                  <View style={[styles.switchThumb, { backgroundColor: '#FFFFFF', left: formData.isActive ? 20 : 2 }]} />
                </TouchableOpacity>
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
                <Text style={styles.buttonText}>
                  {loading ? 'Creating...' : 'Create Offer'}
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
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: Spacing.xs,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
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
