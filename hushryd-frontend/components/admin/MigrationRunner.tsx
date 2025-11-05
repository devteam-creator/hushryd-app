import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { comprehensiveDatabaseService } from '../../services/comprehensiveDatabaseService';
import { notificationService } from '../../services/notificationService';
import { migrationService } from '../../utils/migrations';
import { useColorScheme } from '../useColorScheme';

export default function MigrationRunner() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isRunning, setIsRunning] = useState(false);

  const handleRunMigrations = async () => {
    Alert.alert(
      'Run Database Migrations',
      'This will create all database tables and seed them with sample data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Run Migrations',
          style: 'default',
          onPress: async () => {
            setIsRunning(true);
            try {
              console.log('🚀 Starting database migration process...');
              
              // Clear existing data first
              console.log('🧹 Clearing existing database...');
              comprehensiveDatabaseService.clearDatabase();
              
              // Run initial migration
              console.log('📊 Running initial migration...');
              const migrationResult = migrationService.runInitialMigration();
              
              if (migrationResult.success) {
                console.log('✅ Initial migration completed successfully!');
                console.log(`📈 Created ${migrationResult.usersCreated} users`);
              }
              
              // Seed comprehensive database
              console.log('🌱 Seeding comprehensive database...');
              comprehensiveDatabaseService.seedDatabase();
              
              // Get final statistics
              const stats = comprehensiveDatabaseService.getDatabaseStats();
              console.log('📊 Final Database Statistics:', stats);
              
              notificationService.showSuccess('Database migrations completed successfully!');
              
            } catch (error) {
              console.error('❌ Migration failed:', error);
              notificationService.showError('Migration failed. Please check console for details.');
            } finally {
              setIsRunning(false);
            }
          }
        },
      ]
    );
  };

  const handleForceReseed = async () => {
    Alert.alert(
      'Force Re-seed Database',
      'This will clear all existing data and re-seed the database. This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Force Re-seed',
          style: 'destructive',
          onPress: async () => {
            setIsRunning(true);
            try {
              console.log('🔄 Force re-seeding database...');
              
              // Clear existing data
              comprehensiveDatabaseService.clearDatabase();
              
              // Force re-seed
              const reseedResult = migrationService.forceReseed();
              
              if (reseedResult.success) {
                console.log('✅ Force re-seed completed successfully!');
                console.log(`📈 Created ${reseedResult.usersCreated} users`);
              }
              
              // Seed comprehensive database
              comprehensiveDatabaseService.seedDatabase();
              
              notificationService.showSuccess('Database force re-seed completed successfully!');
              
            } catch (error) {
              console.error('❌ Force re-seed failed:', error);
              notificationService.showError('Force re-seed failed. Please check console for details.');
            } finally {
              setIsRunning(false);
            }
          }
        },
      ]
    );
  };

  const handleGetStatus = async () => {
    try {
      const status = migrationService.getMigrationStatus();
      const stats = comprehensiveDatabaseService.getDatabaseStats();
      
      Alert.alert(
        'Migration Status',
        `Migration Status: ${status.message}\n\n` +
        `Database Statistics:\n` +
        `• Total Users: ${stats.totalUsers}\n` +
        `• Total Drivers: ${stats.totalDrivers}\n` +
        `• Total Rides: ${stats.totalRides}\n` +
        `• Total Bookings: ${stats.totalBookings}\n` +
        `• Total Transactions: ${stats.totalTransactions}\n` +
        `• Total Revenue: ₹${stats.totalRevenue.toLocaleString()}\n` +
        `• Total Reviews: ${stats.totalReviews}\n` +
        `• Average Rating: ${stats.averageRating.toFixed(1)}`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('❌ Failed to get migration status:', error);
      notificationService.showError('Failed to get migration status.');
    }
  };

  const handleClearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      'This will remove all data from the database. This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Database',
          style: 'destructive',
          onPress: async () => {
            try {
              comprehensiveDatabaseService.clearDatabase();
              notificationService.showSuccess('Database cleared successfully!');
            } catch (error) {
              console.error('❌ Failed to clear database:', error);
              notificationService.showError('Failed to clear database.');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Database Migration Runner</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Manage database migrations and seeding
      </Text>

      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: isRunning ? 0.6 : 1,
            }
          ]}
          onPress={handleRunMigrations}
          disabled={isRunning}
        >
          <Text style={styles.buttonIcon}>🚀</Text>
          <Text style={styles.buttonText}>Run Migrations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#f59e0b',
              opacity: isRunning ? 0.6 : 1,
            }
          ]}
          onPress={handleForceReseed}
          disabled={isRunning}
        >
          <Text style={styles.buttonIcon}>🔄</Text>
          <Text style={styles.buttonText}>Force Re-seed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#10b981',
              opacity: isRunning ? 0.6 : 1,
            }
          ]}
          onPress={handleGetStatus}
          disabled={isRunning}
        >
          <Text style={styles.buttonIcon}>📊</Text>
          <Text style={styles.buttonText}>Get Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: '#ef4444',
              opacity: isRunning ? 0.6 : 1,
            }
          ]}
          onPress={handleClearDatabase}
          disabled={isRunning}
        >
          <Text style={styles.buttonIcon}>🗑️</Text>
          <Text style={styles.buttonText}>Clear Database</Text>
        </TouchableOpacity>
      </View>

      {isRunning && (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.primary }]}>
            Running migrations... Please wait
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    margin: Spacing.medium,
    ...Shadows.medium,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  description: {
    fontSize: FontSizes.medium,
    marginBottom: Spacing.medium,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  buttonIcon: {
    fontSize: FontSizes.large,
    marginBottom: Spacing.xs,
  },
  buttonText: {
    fontSize: FontSizes.small,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: Spacing.medium,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
  },
});
