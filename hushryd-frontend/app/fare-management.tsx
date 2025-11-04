import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../components/admin/AdminLayout';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../constants/Design';

interface FareRule {
  id: string;
  route: string;
  baseFare: number;
  perKmRate: number;
  peakHourMultiplier: number;
  vehicleType: 'economy' | 'sedan' | 'suv' | 'luxury';
  isActive: boolean;
}

export default function FareManagementScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const mockFareRules: FareRule[] = [
    {
      id: '1',
      route: 'Hyderabad - Vijayawada',
      baseFare: 200,
      perKmRate: 12,
      peakHourMultiplier: 1.5,
      vehicleType: 'economy',
      isActive: true,
    },
    {
      id: '2',
      route: 'Hyderabad - Vijayawada',
      baseFare: 250,
      perKmRate: 15,
      peakHourMultiplier: 1.5,
      vehicleType: 'sedan',
      isActive: true,
    },
    {
      id: '3',
      route: 'Hyderabad - Bangalore',
      baseFare: 300,
      perKmRate: 18,
      peakHourMultiplier: 1.3,
      vehicleType: 'economy',
      isActive: true,
    },
    {
      id: '4',
      route: 'Hyderabad - Visakhapatnam',
      baseFare: 350,
      perKmRate: 20,
      peakHourMultiplier: 1.4,
      vehicleType: 'suv',
      isActive: true,
    },
  ];

  const routes = ['all', ...Array.from(new Set(mockFareRules.map(rule => rule.route)))];
  const filteredRules = selectedRoute === 'all' 
    ? mockFareRules 
    : mockFareRules.filter(rule => rule.route === selectedRoute);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'economy': return '🚗';
      case 'sedan': return '🚙';
      case 'suv': return '🚐';
      case 'luxury': return '🚗';
      default: return '🚗';
    }
  };

  const calculateSampleFare = (rule: FareRule, distance: number = 275) => {
    const baseFare = rule.baseFare;
    const distanceFare = distance * rule.perKmRate;
    const totalFare = baseFare + distanceFare;
    const peakHourFare = totalFare * rule.peakHourMultiplier;
    
    return {
      normal: Math.round(totalFare),
      peakHour: Math.round(peakHourFare),
    };
  };

  return (
    <AdminLayout title="Fare Management" currentPage="fares">
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>📊</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Active Routes</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>
              {mockFareRules.length}
            </Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.summaryIcon}>💰</Text>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Avg. Base Fare</Text>
            <Text style={[styles.summaryAmount, { color: colors.primary }]}>
              ₹{Math.round(mockFareRules.reduce((sum, rule) => sum + rule.baseFare, 0) / mockFareRules.length)}
            </Text>
          </View>
        </View>

        {/* Route Filter */}
        <View style={styles.filterSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Filter by Route</Text>
          <View style={styles.filterButtons}>
            {routes.map((route) => (
              <TouchableOpacity
                key={route}
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.lightGray, borderColor: colors.border },
                  selectedRoute === route && [styles.filterButtonActive, { backgroundColor: colors.primary }],
                ]}
                onPress={() => setSelectedRoute(route)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: colors.text },
                    selectedRoute === route && { color: '#FFFFFF' },
                  ]}
                >
                  {route === 'all' ? 'All Routes' : route}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fare Rules List */}
        <View style={styles.rulesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedRoute === 'all' ? 'All Fare Rules' : `${selectedRoute} Fare Rules`}
          </Text>
          
          {filteredRules.map((rule) => {
            const sampleFare = calculateSampleFare(rule);
            return (
              <View
                key={rule.id}
                style={[styles.ruleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.ruleHeader}>
                  <View style={styles.ruleInfo}>
                    <Text style={styles.vehicleIcon}>{getVehicleIcon(rule.vehicleType)}</Text>
                    <View style={styles.ruleDetails}>
                      <Text style={[styles.routeName, { color: colors.text }]}>
                        {rule.route}
                      </Text>
                      <Text style={[styles.vehicleType, { color: colors.textSecondary }]}>
                        {rule.vehicleType.charAt(0).toUpperCase() + rule.vehicleType.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: rule.isActive ? '#10B981' + '20' : '#EF4444' + '20' }]}>
                    <Text style={[styles.statusText, { color: rule.isActive ? '#10B981' : '#EF4444' }]}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>

                <View style={styles.fareDetails}>
                  <View style={styles.fareItem}>
                    <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Base Fare</Text>
                    <Text style={[styles.fareValue, { color: colors.text }]}>₹{rule.baseFare}</Text>
                  </View>
                  <View style={styles.fareItem}>
                    <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Per KM Rate</Text>
                    <Text style={[styles.fareValue, { color: colors.text }]}>₹{rule.perKmRate}</Text>
                  </View>
                  <View style={styles.fareItem}>
                    <Text style={[styles.fareLabel, { color: colors.textSecondary }]}>Peak Hour Multiplier</Text>
                    <Text style={[styles.fareValue, { color: colors.text }]}>{rule.peakHourMultiplier}x</Text>
                  </View>
                </View>

                <View style={styles.sampleFare}>
                  <Text style={[styles.sampleFareTitle, { color: colors.text }]}>Sample Fare (275km):</Text>
                  <View style={styles.sampleFareValues}>
                    <View style={styles.sampleFareItem}>
                      <Text style={[styles.sampleFareLabel, { color: colors.textSecondary }]}>Normal</Text>
                      <Text style={[styles.sampleFareValue, { color: colors.primary }]}>₹{sampleFare.normal}</Text>
                    </View>
                    <View style={styles.sampleFareItem}>
                      <Text style={[styles.sampleFareLabel, { color: colors.textSecondary }]}>Peak Hour</Text>
                      <Text style={[styles.sampleFareValue, { color: '#F59E0B' }]}>₹{sampleFare.peakHour}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.ruleActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => {/* Handle edit */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.textSecondary + '20' }]}
                    onPress={() => {/* Handle toggle active */}}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>
                      {rule.isActive ? 'Deactivate' : 'Activate'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Add New Rule Button */}
        <View style={styles.addSection}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => {/* Handle add new rule */}}
          >
            <LinearGradient
              colors={['#1DA1F2', '#1976D2']}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>+ Add New Fare Rule</Text>
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
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
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
  rulesSection: {
    paddingHorizontal: Spacing.lg,
  },
  ruleCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  ruleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  ruleDetails: {
    flex: 1,
  },
  routeName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  vehicleType: {
    fontSize: FontSizes.sm,
    textTransform: 'capitalize',
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
  fareDetails: {
    marginBottom: Spacing.md,
  },
  fareItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  fareLabel: {
    fontSize: FontSizes.sm,
  },
  fareValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  sampleFare: {
    backgroundColor: '#F8F9FA',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  sampleFareTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  sampleFareValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sampleFareItem: {
    alignItems: 'center',
  },
  sampleFareLabel: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xs,
  },
  sampleFareValue: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  ruleActions: {
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
