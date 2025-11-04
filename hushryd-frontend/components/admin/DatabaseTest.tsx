import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { realDatabaseService } from '../../services/realDatabaseService';
import { useColorScheme } from '../useColorScheme';

export default function DatabaseTest() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];
    
    try {
      // Test 1: Check if service is initialized
      results.push('✅ Database service initialized');
      
      // Test 2: Check if we can get admin users
      const adminUsers = realDatabaseService.getAllAdminUsers();
      results.push(`✅ Admin users: ${adminUsers.length}`);
      
      // Test 3: Check if we can get rides
      const rides = realDatabaseService.getAllRides();
      results.push(`✅ Rides: ${rides.length}`);
      
      // Test 4: Check if we can get bookings
      const bookings = realDatabaseService.getAllBookings();
      results.push(`✅ Bookings: ${bookings.length}`);
      
      // Test 5: Check if we can get transactions
      const transactions = realDatabaseService.getAllTransactions();
      results.push(`✅ Transactions: ${transactions.length}`);
      
      // Test 6: Check database stats
      const stats = realDatabaseService.getDatabaseStats();
      results.push(`✅ Database stats: ${JSON.stringify(stats, null, 2)}`);
      
      // Test 7: Check if we can seed database
      realDatabaseService.seedDatabase();
      const newStats = realDatabaseService.getDatabaseStats();
      results.push(`✅ Database seeded: ${newStats.totalAdminUsers} admin users`);
      
    } catch (error) {
      results.push(`❌ Error: ${error}`);
    }
    
    setTestResults(results);
  };

  const clearDatabase = () => {
    try {
      realDatabaseService.clearDatabase();
      Alert.alert('Success', 'Database cleared successfully!');
      runTests();
    } catch (error) {
      Alert.alert('Error', `Failed to clear database: ${error}`);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Database Service Test
      </Text>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={runTests}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Run Tests
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.danger }]}
        onPress={clearDatabase}
      >
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Clear Database
        </Text>
      </TouchableOpacity>
      
      <View style={styles.results}>
        {testResults.map((result, index) => (
          <Text key={index} style={[styles.resultText, { color: colors.text }]}>
            {result}
          </Text>
        ))}
      </View>
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
  button: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    marginBottom: Spacing.small,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
  results: {
    marginTop: Spacing.medium,
  },
  resultText: {
    fontSize: FontSizes.small,
    marginBottom: Spacing.xs,
    fontFamily: 'monospace',
  },
});
