import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useColorScheme } from '../useColorScheme';

export default function ApiEndpoints() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'POST',
      path: '/admin-users',
      description: 'Create a new admin user',
      parameters: {
        name: 'string (required)',
        email: 'string (required)',
        role: 'string (required)',
        status: 'string (optional)',
        department: 'string (optional)',
        permissions: 'array (optional)',
      },
    },
    {
      method: 'PUT',
      path: '/admin-users/:id',
      description: 'Update an existing admin user',
      parameters: {
        name: 'string (optional)',
        email: 'string (optional)',
        role: 'string (optional)',
        status: 'string (optional)',
        department: 'string (optional)',
        permissions: 'array (optional)',
      },
    },
    {
      method: 'DELETE',
      path: '/admin-users/:id',
      description: 'Delete an admin user',
      parameters: {},
    },
    {
      method: 'GET',
      path: '/admin-users',
      description: 'Get all admin users',
      parameters: {},
    },
    {
      method: 'POST',
      path: '/rides',
      description: 'Create a new ride',
      parameters: {
        driverId: 'string (required)',
        passengerId: 'string (required)',
        from: 'string (required)',
        to: 'string (required)',
        distance: 'number (required)',
        fare: 'number (required)',
        status: 'string (optional)',
      },
    },
    {
      method: 'POST',
      path: '/bookings',
      description: 'Create a new booking',
      parameters: {
        userId: 'string (required)',
        rideId: 'string (required)',
        bookingDate: 'string (required)',
        status: 'string (optional)',
        paymentStatus: 'string (optional)',
        amount: 'number (required)',
      },
    },
    {
      method: 'POST',
      path: '/transactions',
      description: 'Create a new transaction',
      parameters: {
        userId: 'string (required)',
        type: 'string (required)',
        amount: 'number (required)',
        status: 'string (optional)',
        description: 'string (required)',
      },
    },
    {
      method: 'POST',
      path: '/database/seed',
      description: 'Seed the database with sample data',
      parameters: {},
    },
    {
      method: 'DELETE',
      path: '/database/clear',
      description: 'Clear all data from the database',
      parameters: {},
    },
    {
      method: 'GET',
      path: '/database/stats',
      description: 'Get database statistics',
      parameters: {},
    },
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#10b981';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return colors.text;
    }
  };

  const toggleEndpoint = (path: string) => {
    setExpandedEndpoint(expandedEndpoint === path ? null : path);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, Shadows.medium]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Available API Endpoints
      </Text>
      
      <ScrollView style={styles.endpointsList} showsVerticalScrollIndicator={false}>
        {endpoints.map((endpoint, index) => (
          <View key={index} style={[styles.endpointItem, { backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={styles.endpointHeader}
              onPress={() => toggleEndpoint(endpoint.path)}
            >
              <View style={styles.methodContainer}>
                <Text style={[styles.method, { color: getMethodColor(endpoint.method) }]}>
                  {endpoint.method}
                </Text>
              </View>
              
              <Text style={[styles.path, { color: colors.text }]}>
                {endpoint.path}
              </Text>
              
              <Text style={[styles.expandIcon, { color: colors.textSecondary }]}>
                {expandedEndpoint === endpoint.path ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {endpoint.description}
            </Text>
            
            {expandedEndpoint === endpoint.path && (
              <View style={[styles.parametersContainer, { backgroundColor: colors.lightGray }]}>
                <Text style={[styles.parametersTitle, { color: colors.text }]}>
                  Parameters:
                </Text>
                {Object.keys(endpoint.parameters).length > 0 ? (
                  Object.entries(endpoint.parameters).map(([key, value]) => (
                    <View key={key} style={styles.parameterRow}>
                      <Text style={[styles.parameterKey, { color: colors.text }]}>
                        {key}:
                      </Text>
                      <Text style={[styles.parameterValue, { color: colors.textSecondary }]}>
                        {value}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.noParameters, { color: colors.textSecondary }]}>
                    No parameters required
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    margin: Spacing.medium,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  endpointsList: {
    maxHeight: 400,
  },
  endpointItem: {
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.small,
    padding: Spacing.small,
  },
  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  methodContainer: {
    minWidth: 60,
    alignItems: 'center',
  },
  method: {
    fontSize: FontSizes.small,
    fontWeight: 'bold',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  path: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    flex: 1,
    marginLeft: Spacing.small,
  },
  expandIcon: {
    fontSize: FontSizes.small,
    fontWeight: 'bold',
  },
  description: {
    fontSize: FontSizes.small,
    marginLeft: Spacing.small,
  },
  parametersContainer: {
    marginTop: Spacing.small,
    padding: Spacing.small,
    borderRadius: BorderRadius.xs,
  },
  parametersTitle: {
    fontSize: FontSizes.small,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  parameterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  parameterKey: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    minWidth: 100,
  },
  parameterValue: {
    fontSize: FontSizes.small,
    flex: 1,
  },
  noParameters: {
    fontSize: FontSizes.small,
    fontStyle: 'italic',
  },
});
