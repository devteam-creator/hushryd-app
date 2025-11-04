import { Stack } from 'expo-router';
import React from 'react';

export default function VehiclesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#00AFF5',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="add" 
        options={{
          title: 'Add Vehicle',
          headerBackTitle: 'Back',
        }} 
      />
      <Stack.Screen 
        name="manage" 
        options={{
          title: 'Manage Vehicles',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}
