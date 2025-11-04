import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';

// Types
type DiscountType = 'percentage' | 'fixed';
type ApplicableTo = 'all' | 'new_users' | 'specific_users';

interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minAmount: number;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableTo: ApplicableTo;
  createdAt: string;
  updatedAt: string;
}

export default function OffersManagement() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user: adminUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as DiscountType,
    discountValue: '',
    minAmount: '',
    maxDiscount: '',
    maxUses: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
    applicableTo: 'all' as ApplicableTo,
  });

  // Load offers
  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const token = await apiService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await apiService.getOffers(token);
      if (response.success && response.data?.offers) {
        setOffers(response.data.offers);
      } else {
        throw new Error(response.message || 'Failed to load offers');
      }
    } catch (error) {
      console.error('Error loading offers:', error);
      Alert.alert('Error', 'Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  // Create offer
  const handleCreate = async () => {
    try {
      if (!formData.code || !formData.title || !formData.discountValue || !formData.validFrom || !formData.validUntil) {
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
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: formData.isActive,
        applicableTo: formData.applicableTo,
      };

      const response = await apiService.createOffer(offerData, token);
      if (response.success) {
        Alert.alert('Success', 'Offer created successfully!');
        setShowCreateModal(false);
        resetForm();
        loadOffers();
      } else {
        throw new Error(response.message || 'Failed to create offer');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      Alert.alert('Error', 'Failed to create offer. Please try again.');
    }
  };

  // Update offer
  const handleUpdate = async () => {
    try {
      if (!selectedOffer) return;

      const token = await apiService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const offerData = {
        title: formData.title,
        description: formData.description || '',
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minAmount: parseFloat(formData.minAmount) || 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: formData.isActive,
        applicableTo: formData.applicableTo,
      };

      const response = await apiService.updateOffer(selectedOffer.id, offerData, token);
      if (response.success) {
        Alert.alert('Success', 'Offer updated successfully!');
        setShowEditModal(false);
        setSelectedOffer(null);
        resetForm();
        loadOffers();
      } else {
        throw new Error(response.message || 'Failed to update offer');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      Alert.alert('Error', 'Failed to update offer. Please try again.');
    }
  };

  // Delete offer
  const handleDelete = (offer: Offer) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete offer "${offer.code}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await apiService.getToken();
              if (!token) {
                throw new Error('No authentication token');
              }

              const response = await apiService.deleteOffer(offer.id, token);
              if (response.success) {
                Alert.alert('Success', 'Offer deleted successfully!');
                loadOffers();
              } else {
                throw new Error(response.message || 'Failed to delete offer');
              }
            } catch (error) {
              console.error('Error deleting offer:', error);
              Alert.alert('Error', 'Failed to delete offer. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minAmount: '',
      maxDiscount: '',
      maxUses: '',
      validFrom: '',
      validUntil: '',
      isActive: true,
      applicableTo: 'all',
    });
  };

  // Open edit modal
  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setFormData({
      code: offer.code,
      title: offer.title,
      description: offer.description || '',
      discountType: offer.discountType,
      discountValue: offer.discountValue.toString(),
      minAmount: offer.minAmount.toString(),
      maxDiscount: offer.maxDiscount?.toString() || '',
      maxUses: offer.maxUses?.toString() || '',
      validFrom: offer.validFrom,
      validUntil: offer.validUntil,
      isActive: offer.isActive,
      applicableTo: offer.applicableTo,
    });
    setShowEditModal(true);
  };

  // Table columns
  const columns: TableColumn<Offer>[] = [
    {
      key: 'code',
      label: 'Code',
      render: (offer) => (
        <Text style={[styles.codeText, { color: colors.primary }]}>{offer.code}</Text>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (offer) => <Text style={{ color: colors.text }}>{offer.title}</Text>,
    },
    {
      key: 'discount',
      label: 'Discount',
      render: (offer) => (
        <Text style={{ color: colors.text }}>
          {offer.discountType === 'percentage' 
            ? `${offer.discountValue}%` 
            : `${CURRENCY_SYMBOL}${offer.discountValue}`
          }
        </Text>
      ),
    },
    {
      key: 'validFrom',
      label: 'Valid From',
      render: (offer) => <Text style={{ color: colors.text }}>{new Date(offer.validFrom).toLocaleDateString()}</Text>,
    },
    {
      key: 'validUntil',
      label: 'Valid Until',
      render: (offer) => <Text style={{ color: colors.text }}>{new Date(offer.validUntil).toLocaleDateString()}</Text>,
    },
    {
      key: 'usedCount',
      label: 'Usage',
      render: (offer) => (
        <Text style={{ color: colors.text }}>
          {offer.usedCount} {offer.maxUses ? `/ ${offer.maxUses}` : ''}
        </Text>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (offer) => (
        <View style={[styles.statusBadge, { backgroundColor: offer.isActive ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.statusText}>{offer.isActive ? 'Active' : 'Inactive'}</Text>
        </View>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (offer) => (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleEdit(offer)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
            onPress={() => handleDelete(offer)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Offers Management</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/admin/offers/new')}
            >
              <Text style={styles.addButtonText}>+ Create Offer</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ color: colors.text, marginTop: Spacing.md }}>Loading offers...</Text>
            </View>
          ) : offers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No offers found. Create your first offer to get started!
              </Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <DataTable data={offers} columns={columns} />
            </ScrollView>
          )}

          {/* Create Modal */}
          <Modal visible={showCreateModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Offer</Text>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Code *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      placeholder="e.g., WELCOME50"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.code}
                      onChangeText={(text) => setFormData({ ...formData, code: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      placeholder="e.g., Welcome Offer"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.title}
                      onChangeText={(text) => setFormData({ ...formData, title: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
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
                        style={[styles.radioButton, { borderColor: colors.border }]}
                        onPress={() => setFormData({ ...formData, discountType: 'percentage' })}
                      >
                        <View style={[styles.radioCircle, { backgroundColor: formData.discountType === 'percentage' ? colors.primary : 'transparent' }]} />
                        <Text style={{ color: colors.text }}>Percentage</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.radioButton, { borderColor: colors.border }]}
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
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
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
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
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
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
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
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      placeholder="Leave empty for unlimited"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      value={formData.maxUses}
                      onChangeText={(text) => setFormData({ ...formData, maxUses: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Valid From *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.validFrom}
                      onChangeText={(text) => setFormData({ ...formData, validFrom: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Valid Until *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                      value={formData.validUntil}
                      onChangeText={(text) => setFormData({ ...formData, validUntil: text })}
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

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.border }]}
                      onPress={() => {
                        setShowCreateModal(false);
                        resetForm();
                      }}
                    >
                      <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.primary }]}
                      onPress={handleCreate}
                    >
                      <Text style={styles.modalButtonText}>Create</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Edit Modal */}
          <Modal visible={showEditModal} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Offer</Text>

                  {/* Same form fields as create modal */}
                  {/* Code field is read-only for edit */}
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Code</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.border, color: colors.textSecondary, borderColor: colors.border }]}
                      value={formData.code}
                      editable={false}
                    />
                  </View>

                  {/* Rest of the form fields same as create modal */}
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      value={formData.title}
                      onChangeText={(text) => setFormData({ ...formData, title: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
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
                        style={[styles.radioButton, { borderColor: colors.border }]}
                        onPress={() => setFormData({ ...formData, discountType: 'percentage' })}
                      >
                        <View style={[styles.radioCircle, { backgroundColor: formData.discountType === 'percentage' ? colors.primary : 'transparent' }]} />
                        <Text style={{ color: colors.text }}>Percentage</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.radioButton, { borderColor: colors.border }]}
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
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={formData.discountValue}
                      onChangeText={(text) => setFormData({ ...formData, discountValue: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Minimum Amount (₹)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={formData.minAmount}
                      onChangeText={(text) => setFormData({ ...formData, minAmount: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Max Discount (₹)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={formData.maxDiscount}
                      onChangeText={(text) => setFormData({ ...formData, maxDiscount: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Max Uses</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      keyboardType="numeric"
                      value={formData.maxUses}
                      onChangeText={(text) => setFormData({ ...formData, maxUses: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Valid From *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      value={formData.validFrom}
                      onChangeText={(text) => setFormData({ ...formData, validFrom: text })}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Valid Until *</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                      value={formData.validUntil}
                      onChangeText={(text) => setFormData({ ...formData, validUntil: text })}
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

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.border }]}
                      onPress={() => {
                        setShowEditModal(false);
                        setSelectedOffer(null);
                        resetForm();
                      }}
                    >
                      <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.primary }]}
                      onPress={handleUpdate}
                    >
                      <Text style={styles.modalButtonText}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.lg,
    textAlign: 'center',
  },
  codeText: {
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSizes.xxl,
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
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
