import { Stack } from 'expo-router';
import React from 'react';

export default function RideLayout() {
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
        name="[id]" 
        options={{
          title: 'Ride Details',
          headerBackTitle: 'Back',
        }} 
      />
    </Stack>
  );
}
