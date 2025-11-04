import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users" />
      <Stack.Screen name="admins" />
      <Stack.Screen name="rides" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="finance" />
      <Stack.Screen name="support" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="payouts" />
      <Stack.Screen name="verifications" />
      <Stack.Screen name="tickets" />
      <Stack.Screen name="complaints" />
      <Stack.Screen name="fares" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="database" />
      <Stack.Screen name="migrations" />
    </Stack>
  );
}

