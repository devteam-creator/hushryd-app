import Button from '@/components/Button';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { getCurrentUser, getVehiclesForUser } from '@/services/mockData';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ManageVehiclesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const currentUser = getCurrentUser();
  const userVehicles = getVehiclesForUser(currentUser.id);

  const handleAddVehicle = () => {
    router.push('/vehicles/add');
  };

  const handleEditVehicle = (vehicleId: string) => {
    Alert.alert('Edit Vehicle', `Edit vehicle ${vehicleId}`);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert('Delete Vehicle', 'Are you sure you want to remove this vehicle?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Success', 'Vehicle removed') },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'My Vehicles', headerShown: true }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>My Vehicles</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage your registered vehicles
          </Text>

          {userVehicles.map((vehicle) => (
            <View
              key={vehicle.id}
              style={[styles.vehicleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.vehicleHeader}>
                <Text style={styles.vehicleIcon}>🚗</Text>
                <View style={styles.vehicleInfo}>
                  <Text style={[styles.vehicleName, { color: colors.text }]}>
                    {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={[styles.vehicleDetails, { color: colors.textSecondary }]}>
                    {vehicle.color} • {vehicle.year} • {vehicle.licensePlate}
                  </Text>
                  <Text style={[styles.vehicleDetails, { color: colors.textSecondary }]}>
                    {vehicle.capacity} seats • {vehicle.vehicleType}
                  </Text>
                </View>
                {vehicle.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.vehicleActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleEditVehicle(vehicle.id)}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.error }]}
                  onPress={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {userVehicles.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={styles.emptyIcon}>🚗</Text>
              <Text style={[styles.emptyText, { color: colors.text }]}>No vehicles added yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Add your first vehicle to start offering rides
              </Text>
            </View>
          )}

          <Button title="+ Add New Vehicle" onPress={handleAddVehicle} size="large" />

          <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={styles.infoIcon}>📋</Text>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Required Documents</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Vehicle Registration Certificate{'\n'}
                • Valid Insurance Documents{'\n'}
                • Driver's License{'\n'}
                • Vehicle Inspection Report
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  vehicleCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vehicleIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  verifiedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
});

