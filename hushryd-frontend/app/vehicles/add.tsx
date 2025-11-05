import Button from '@/components/Button';
import Input from '@/components/Input';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AddVehicleScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState<'sedan' | 'suv' | 'van' | 'luxury' | 'economy'>('sedan');

  const vehicleTypes = [
    { value: 'economy', label: 'Economy', icon: '🚗' },
    { value: 'sedan', label: 'Sedan', icon: '🚙' },
    { value: 'suv', label: 'SUV', icon: '🚐' },
    { value: 'van', label: 'Van', icon: '🚚' },
    { value: 'luxury', label: 'Luxury', icon: '🚘' },
  ];

  const handleAddVehicle = () => {
    if (!make || !model || !year || !color || !licensePlate || !registrationNumber || !capacity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    Alert.alert('Success', 'Vehicle added successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Vehicle', headerShown: true }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Add New Vehicle</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your vehicle details for verification
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Type *</Text>
          <View style={styles.typeSelector}>
            {vehicleTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeOption,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  vehicleType === type.value && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setVehicleType(type.value as any)}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    { color: colors.text },
                    vehicleType === type.value && { color: '#fff' },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

          <Input
            label="Make *"
            placeholder="e.g., Toyota, Honda, Ford"
            value={make}
            onChangeText={setMake}
            icon={<Text style={styles.inputIcon}>🚗</Text>}
          />

          <Input
            label="Model *"
            placeholder="e.g., Camry, Civic, Focus"
            value={model}
            onChangeText={setModel}
            icon={<Text style={styles.inputIcon}>🚗</Text>}
          />

          <Input
            label="Year *"
            placeholder="e.g., 2020"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            icon={<Text style={styles.inputIcon}>📅</Text>}
          />

          <Input
            label="Color *"
            placeholder="e.g., Silver, Black, Blue"
            value={color}
            onChangeText={setColor}
            icon={<Text style={styles.inputIcon}>🎨</Text>}
          />

          <Input
            label="Seating Capacity *"
            placeholder="e.g., 4, 7, 8"
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="numeric"
            icon={<Text style={styles.inputIcon}>💺</Text>}
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Registration Details</Text>

          <Input
            label="License Plate *"
            placeholder="e.g., ABC 123"
            value={licensePlate}
            onChangeText={setLicensePlate}
            autoCapitalize="characters"
            icon={<Text style={styles.inputIcon}>🔢</Text>}
          />

          <Input
            label="Registration Number *"
            placeholder="Vehicle registration number"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            icon={<Text style={styles.inputIcon}>📋</Text>}
          />

          <View style={[styles.warningBox, { backgroundColor: colors.card, borderColor: colors.warning }]}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              Your vehicle will be reviewed by our team. You'll be able to use it once it's verified
              (usually within 24 hours).
            </Text>
          </View>

          <Button title="Add Vehicle" onPress={handleAddVehicle} size="large" style={styles.addButton} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeOption: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputIcon: {
    fontSize: 18,
  },
  warningBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    marginBottom: 24,
  },
});

