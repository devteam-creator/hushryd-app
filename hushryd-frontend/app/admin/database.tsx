import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayoutBasic';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';

// Mock database service for now
const mockDatabaseService = {
  seedDatabase: () => {
    console.log('🌱 Seeding database with sample data...');
    // Simulate seeding process
    return {
      totalUsers: 10,
      totalDrivers: 5,
      totalRides: 8,
      totalBookings: 12,
      totalTransactions: 15,
      totalRevenue: 25000
    };
  },
  
  clearDatabase: () => {
    console.log('🗑️ Clearing database...');
    // Simulate clearing process
    return true;
  },
  
  getDatabaseStats: () => {
    return {
      totalUsers: 10,
      totalDrivers: 5,
      totalRides: 8,
      totalBookings: 12,
      totalTransactions: 15,
      totalRevenue: 25000,
      activeUsers: 8,
      inactiveUsers: 2,
      pendingBookings: 3,
      completedRides: 5,
      totalReviews: 7,
      averageRating: 4.2
    };
  }
};

// Mock migration service
const mockMigrationService = {
  runInitialMigration: () => {
    console.log('🚀 Running database migrations...');
    return {
      success: true,
      message: 'Migration completed successfully!',
      usersCreated: 5
    };
  }
};

export default function DatabaseManagementScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { admin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            try {
              console.log('🚀 Starting database migration process...');
              
              // Run migration
              const migrationResult = mockMigrationService.runInitialMigration();
              
              if (migrationResult.success) {
                console.log('✅ Migration completed successfully!');
                console.log(`📈 Created ${migrationResult.usersCreated} users`);
                
                // Also seed database
                mockDatabaseService.seedDatabase();
                
                notificationService.showSuccess(`Database migrations completed successfully! Created ${migrationResult.usersCreated} users.`);
              } else {
                console.log('⚠️ Migration result:', migrationResult.message);
                notificationService.showError(migrationResult.message);
              }
              
            } catch (error) {
              console.error('❌ Migration failed:', error);
              notificationService.showError('Migration failed. Please check console for details.');
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  const handleSeedDatabase = async () => {
    Alert.alert(
      'Seed Database',
      'This will populate the database with sample data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed Database',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              console.log('🌱 Seeding database...');
              
              // Run seeding
              const seedingResult = mockDatabaseService.seedDatabase();
              
              // Get database stats after seeding
              const stats = mockDatabaseService.getDatabaseStats();
              
              console.log('✅ Database seeded successfully!');
              console.log('📊 Database Statistics:', stats);
              
              notificationService.showSuccess(`Database seeded successfully! Created ${stats.totalUsers} users, ${stats.totalRides} rides, and ${stats.totalBookings} bookings.`);
              
            } catch (error) {
              console.error('❌ Seeding failed:', error);
              notificationService.showError('Seeding failed. Please check console for details.');
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
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
            setIsLoading(true);
            try {
              console.log('🗑️ Clearing database...');
              
              // Run clearing
              mockDatabaseService.clearDatabase();
              
              console.log('✅ Database cleared successfully!');
              
              notificationService.showSuccess('Database cleared successfully!');
              
            } catch (error) {
              console.error('❌ Clearing failed:', error);
              notificationService.showError('Clearing failed. Please check console for details.');
            } finally {
              setIsLoading(false);
            }
          }
        },
      ]
    );
  };

  const handleGetStatus = () => {
    try {
      // Get database stats
      const stats = mockDatabaseService.getDatabaseStats();
      
      Alert.alert(
        'Database Status',
        `Database Statistics:\n\n` +
        `• Total Users: ${stats.totalUsers}\n` +
        `• Total Drivers: ${stats.totalDrivers}\n` +
        `• Total Rides: ${stats.totalRides}\n` +
        `• Total Bookings: ${stats.totalBookings}\n` +
        `• Total Transactions: ${stats.totalTransactions}\n` +
        `• Total Revenue: ₹${stats.totalRevenue.toLocaleString()}\n` +
        `• Active Users: ${stats.activeUsers}\n` +
        `• Inactive Users: ${stats.inactiveUsers}\n` +
        `• Pending Bookings: ${stats.pendingBookings}\n` +
        `• Completed Rides: ${stats.completedRides}\n` +
        `• Total Reviews: ${stats.totalReviews}\n` +
        `• Average Rating: ${stats.averageRating.toFixed(1)}`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('❌ Failed to get database status:', error);
      notificationService.showError('Failed to get database status.');
    }
  };

  return (
    <ProtectedRoute pageId="database" requiredRole="superadmin">
      <AdminLayout title="Database Management" currentPage="database">
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.container, { backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>Database Management</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Manage database migrations, seeding, and operations
            </Text>

            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: colors.primary,
                    opacity: isLoading ? 0.6 : 1,
                  }
                ]}
                onPress={handleRunMigrations}
                disabled={isLoading}
              >
                <Text style={styles.buttonIcon}>🚀</Text>
                <Text style={styles.buttonText}>Run Migrations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#10b981',
                    opacity: isLoading ? 0.6 : 1,
                  }
                ]}
                onPress={handleSeedDatabase}
                disabled={isLoading}
              >
                <Text style={styles.buttonIcon}>🌱</Text>
                <Text style={styles.buttonText}>Seed Database</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#3b82f6',
                    opacity: isLoading ? 0.6 : 1,
                  }
                ]}
                onPress={handleGetStatus}
                disabled={isLoading}
              >
                <Text style={styles.buttonIcon}>📊</Text>
                <Text style={styles.buttonText}>Get Status</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: '#ef4444',
                    opacity: isLoading ? 0.6 : 1,
                  }
                ]}
                onPress={handleClearDatabase}
                disabled={isLoading}
              >
                <Text style={styles.buttonIcon}>🗑️</Text>
                <Text style={styles.buttonText}>Clear Database</Text>
              </TouchableOpacity>
            </View>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.primary }]}>
                  Processing... Please wait
                </Text>
              </View>
            )}

            <View style={[styles.infoSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Database Information</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                This page allows you to manage your database operations including:
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Run database migrations to create tables
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Seed the database with sample data
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Check database status and statistics
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • Clear all database data
              </Text>
            </View>

            {/* Debug Information */}
            <View style={[styles.debugSection, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.debugTitle, { color: colors.text }]}>Debug Information</Text>
              <Text style={[styles.debugText, { color: colors.textSecondary }]}>
                User: {admin?.name || 'Unknown'} ({admin?.email || 'Unknown'})
              </Text>
              <Text style={[styles.debugText, { color: colors.textSecondary }]}>
                Role: {admin?.role || 'Unknown'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.medium,
  },
  container: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.medium,
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
    marginBottom: Spacing.medium,
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
  infoSection: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  infoText: {
    fontSize: FontSizes.small,
    marginBottom: Spacing.xs,
  },
  debugSection: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    marginTop: Spacing.medium,
  },
  debugTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  debugText: {
    fontSize: FontSizes.small,
    marginBottom: Spacing.xs,
  },
});