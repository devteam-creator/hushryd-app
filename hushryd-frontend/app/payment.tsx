import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'cash';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

export default function PaymentScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      // Load payment methods and transaction history
      const token = await apiService.getToken();
      if (token) {
        const [methodsResponse, transactionsResponse] = await Promise.all([
          apiService.getPaymentMethods(token),
          apiService.getTransactionHistory(token)
        ]);
        
        if (methodsResponse.success) {
          setPaymentMethods(methodsResponse.data || []);
        }
        
        if (transactionsResponse.success) {
          setTransactions(transactionsResponse.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    setLoading(true);
    try {
      const token = await apiService.getToken();
      if (token) {
        const response = await apiService.addPaymentMethod(token, {
          type: 'card',
          cardNumber: newCard.number,
          expiryDate: newCard.expiry,
          cvv: newCard.cvv,
          cardholderName: newCard.name
        });

        if (response.success) {
          Alert.alert('Success', 'Card added successfully!');
          setShowAddCard(false);
          setNewCard({ number: '', expiry: '', cvv: '', name: '' });
          loadPaymentData();
        } else {
          Alert.alert('Error', response.message || 'Failed to add card');
        }
      }
    } catch (error) {
      console.error('Error adding card:', error);
      Alert.alert('Error', 'Failed to add card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      const token = await apiService.getToken();
      if (token) {
        const response = await apiService.setDefaultPaymentMethod(token, methodId);
        if (response.success) {
          loadPaymentData();
        }
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await apiService.getToken();
              if (token) {
                const response = await apiService.removePaymentMethod(token, methodId);
                if (response.success) {
                  loadPaymentData();
                }
              }
            } catch (error) {
              console.error('Error removing payment method:', error);
            }
          }
        }
      ]
    );
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Payment Methods */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Methods</Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddCard(true)}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {paymentMethods.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💳</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No payment methods added yet
                </Text>
              </View>
            ) : (
              paymentMethods.map(method => (
                <View key={method.id} style={[styles.paymentMethod, { borderColor: colors.border }]}>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodIcon}>{method.icon}</Text>
                    <View style={styles.methodDetails}>
                      <Text style={[styles.methodName, { color: colors.text }]}>{method.name}</Text>
                      <Text style={[styles.methodDetail, { color: colors.textSecondary }]}>
                        {method.details}
                      </Text>
                      {method.isDefault && (
                        <Text style={[styles.defaultBadge, { color: colors.primary }]}>Default</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.methodActions}>
                    {!method.isDefault && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.lightGray }]}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Text style={[styles.actionButtonText, { color: colors.text }]}>
                          Set Default
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                      onPress={() => handleRemoveMethod(method.id)}
                    >
                      <Text style={styles.actionButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Transaction History */}
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No transactions yet
                </Text>
              </View>
            ) : (
              transactions.slice(0, 10).map(transaction => (
                <View key={transaction.id} style={[styles.transaction, { borderColor: colors.border }]}>
                  <View style={styles.transactionInfo}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.type === 'credit' ? '#10B981' : '#EF4444' }
                    ]}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </Text>
                    <Text style={[styles.transactionDescription, { color: colors.text }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.paymentMethod}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(transaction.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Add Card Modal */}
        <Modal
          visible={showAddCard}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddCard(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Card</Text>
                <TouchableOpacity onPress={() => setShowAddCard(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Card Number"
                  placeholderTextColor={colors.textSecondary}
                  value={newCard.number}
                  onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                  keyboardType="numeric"
                  maxLength={16}
                />

                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textSecondary}
                    value={newCard.expiry}
                    onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                    maxLength={5}
                  />
                  
                  <TextInput
                    style={[styles.input, styles.halfInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                    placeholder="CVV"
                    placeholderTextColor={colors.textSecondary}
                    value={newCard.cvv}
                    onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>

                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Cardholder Name"
                  placeholderTextColor={colors.textSecondary}
                  value={newCard.name}
                  onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                />

                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddCard}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>
                    {loading ? 'Adding...' : 'Add Card'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  addButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  methodDetail: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  defaultBadge: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  methodActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  transactionDescription: {
    fontSize: FontSizes.md,
    marginTop: 2,
  },
  transactionDate: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: Spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
});
