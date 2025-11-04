import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface Verification {
  id: string;
  type: 'driver' | 'vehicle' | 'document' | 'identity';
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  submittedDate: string;
  expiryDate?: string;
  description: string;
  documents?: string[];
}

export default function VerificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'expired'>('all');

  const mockVerifications: Verification[] = [
    {
      id: '1',
      type: 'driver',
      title: 'Driver License Verification',
      status: 'approved',
      submittedDate: '2025-01-10',
      expiryDate: '2026-01-10',
      description: 'Valid driving license for commercial vehicles',
      documents: ['license_front.jpg', 'license_back.jpg'],
    },
    {
      id: '2',
      type: 'vehicle',
      title: 'Vehicle Registration',
      status: 'approved',
      submittedDate: '2025-01-08',
      expiryDate: '2025-12-31',
      description: 'Vehicle registration certificate and insurance',
      documents: ['rc_front.jpg', 'insurance.pdf'],
    },
    {
      id: '3',
      type: 'identity',
      title: 'Aadhaar Verification',
      status: 'approved',
      submittedDate: '2025-01-05',
      description: 'Government issued identity verification',
      documents: ['aadhaar_front.jpg', 'aadhaar_back.jpg'],
    },
    {
      id: '4',
      type: 'document',
      title: 'Background Check',
      status: 'pending',
      submittedDate: '2025-01-15',
      description: 'Police verification and background check',
      documents: ['background_check.pdf'],
    },
    {
      id: '5',
      type: 'vehicle',
      title: 'Vehicle Fitness Certificate',
      status: 'expired',
      submittedDate: '2024-12-01',
      expiryDate: '2025-01-01',
      description: 'Vehicle fitness certificate expired',
      documents: ['fitness_cert.pdf'],
    },
  ];

  const filteredVerifications = mockVerifications.filter(
    verification => filter === 'all' || verification.status === filter
  );

  const getVerificationIcon = (type: string) => {
    switch (type) {
      case 'driver': return '👨‍💼';
      case 'vehicle': return '🚗';
      case 'document': return '📄';
      case 'identity': return '🆔';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      case 'expired': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      case 'expired': return '⏰';
      default: return '❓';
    }
  };

  const approvedCount = mockVerifications.filter(v => v.status === 'approved').length;
  const pendingCount = mockVerifications.filter(v => v.status === 'pending').length;
  const expiredCount = mockVerifications.filter(v => v.status === 'expired').length;

  return (
    <AdminLayout title="Verifications" currentPage="verifications">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>✅</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Approved</Text>
            <Text style={[styles.summaryAmount, { color: '#10B981' }]}>{approvedCount}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>⏳</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Pending</Text>
            <Text style={[styles.summaryAmount, { color: '#F59E0B' }]}>{pendingCount}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>⏰</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Expired</Text>
            <Text style={[styles.summaryAmount, { color: '#6B7280' }]}>{expiredCount}</Text>
          </View>
        </View>

        {/* Verification Status Overview */}
        <View style={[styles.overviewSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Verification Status</Text>
          <View style={styles.statusOverview}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statusLabel, { color: colors.text }]}>Approved ({approvedCount})</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.statusLabel, { color: colors.text }]}>Pending ({pendingCount})</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.statusLabel, { color: colors.text }]}>Rejected (0)</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, { backgroundColor: '#6B7280' }]} />
              <Text style={[styles.statusLabel, { color: colors.text }]}>Expired ({expiredCount})</Text>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter Verifications</Text>
          <View style={styles.filterButtons}>
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
              { key: 'expired', label: 'Expired' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.lightGray, borderColor: colors.border },
                  filter === item.key && [styles.filterButtonActive, { backgroundColor: colors.primary }],
                ]}
                onPress={() => setFilter(item.key as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: colors.text },
                    filter === item.key && { color: '#FFFFFF' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Verifications List */}
        <View style={styles.verificationsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {filter === 'all' ? 'All Verifications' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Verifications`}
          </Text>
          
          {filteredVerifications.map((verification) => (
            <View
              key={verification.id}
              style={[styles.verificationCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.verificationHeader}>
                <View style={styles.verificationInfo}>
                  <Text style={styles.verificationIcon}>{getVerificationIcon(verification.type)}</Text>
                  <View style={styles.verificationDetails}>
                    <Text style={[styles.verificationTitle, { color: colors.text }]}>
                      {verification.title}
                    </Text>
                    <Text style={[styles.verificationDate, { color: colors.textSecondary }]}>
                      Submitted: {verification.submittedDate}
                    </Text>
                    {verification.expiryDate && (
                      <Text style={[styles.verificationExpiry, { color: colors.textSecondary }]}>
                        Expires: {verification.expiryDate}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(verification.status) + '20' }]}>
                  <Text style={styles.statusIcon}>{getStatusIcon(verification.status)}</Text>
                  <Text style={[styles.statusText, { color: getStatusColor(verification.status) }]}>
                    {verification.status}
                  </Text>
                </View>
              </View>

              <Text style={[styles.verificationDescription, { color: colors.textSecondary }]}>
                {verification.description}
              </Text>

              {verification.documents && verification.documents.length > 0 && (
                <View style={styles.documentsSection}>
                  <Text style={[styles.documentsTitle, { color: colors.text }]}>Documents:</Text>
                  <View style={styles.documentsList}>
                    {verification.documents.map((doc, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.documentItem, { backgroundColor: colors.lightGray }]}
                        onPress={() => {/* Handle document view */}}
                      >
                        <Text style={styles.documentIcon}>📄</Text>
                        <Text style={[styles.documentName, { color: colors.text }]}>{doc}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {verification.status === 'pending' && (
                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => {/* Handle resubmit */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>Resubmit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.textSecondary + '20' }]}
                    onPress={() => {/* Handle view details */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>View Details</Text>
                  </TouchableOpacity>
                </View>
              )}

              {verification.status === 'expired' && (
                <View style={styles.expiredActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#EF4444' + '20' }]}
                    onPress={() => {/* Handle renew */}}
                  >
                    <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Renew Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Add New Verification Button */}
        <View style={styles.addSection}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => {/* Handle add new verification */}}
          >
            <LinearGradient
              colors={['#1DA1F2', '#1976D2']}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>+ Submit New Verification</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summarySection: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...Shadows.small,
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  overviewSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  statusOverview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  statusLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  filterButtonActive: {
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  verificationsSection: {
    paddingHorizontal: Spacing.lg,
  },
  verificationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  verificationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  verificationIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  verificationDetails: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  verificationDate: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  verificationExpiry: {
    fontSize: FontSizes.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusIcon: {
    fontSize: FontSizes.sm,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  verificationDescription: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  documentsSection: {
    marginBottom: Spacing.md,
  },
  documentsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  documentsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  documentIcon: {
    fontSize: FontSizes.sm,
    marginRight: Spacing.xs,
  },
  documentName: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  expiredActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  addSection: {
    padding: Spacing.lg,
  },
  addButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  addButtonGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: Spacing.xxxl,
  },
});
