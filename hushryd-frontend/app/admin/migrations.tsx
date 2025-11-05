import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayoutBasic';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { MigrationResult, migrationService } from '../../utils/migrations';

export default function MigrationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { admin } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<MigrationResult | null>(null);

  const handleRunInitialMigration = () => {
    Alert.alert(
      'Run Initial Migration',
      'This will create users with different roles (support, admin, finance, manager) if the database is empty. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Run Migration', 
          onPress: async () => {
            setIsRunning(true);
            const result = migrationService.runInitialMigration();
            setLastResult(result);
            setIsRunning(false);
            
            Alert.alert(
              result.success ? 'Migration Successful' : 'Migration Skipped',
              result.message
            );
          }
        },
      ]
    );
  };

  const handleForceReseed = () => {
    Alert.alert(
      'Force Re-seed Database',
      'This will clear all existing users and create new ones. This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Force Re-seed', 
          style: 'destructive',
          onPress: async () => {
            setIsRunning(true);
            const result = migrationService.forceReseed();
            setLastResult(result);
            setIsRunning(false);
            
            Alert.alert(
              result.success ? 'Re-seed Successful' : 'Re-seed Failed',
              result.message
            );
          }
        },
      ]
    );
  };

  const handleCheckStatus = () => {
    const result = migrationService.getMigrationStatus();
    setLastResult(result);
    
    Alert.alert(
      'Migration Status',
      result.message
    );
  };

  return (
    <ProtectedRoute requiredRole="superadmin" pageId="migrations">
      <AdminLayout title="Database Migrations" currentPage="migrations">
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Database Migrations</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Run database migrations to populate users with different roles
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.lightGray }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
            </TouchableOpacity>
          </View>

          {/* Migration Actions */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Migration Actions</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  { backgroundColor: isRunning ? colors.mediumGray : colors.primary }
                ]}
                onPress={handleRunInitialMigration}
                disabled={isRunning}
              >
                <Text style={styles.actionButtonText}>
                  {isRunning ? '🔄 Running...' : '🌱 Run Initial Migration'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  { backgroundColor: isRunning ? colors.mediumGray : '#f59e0b' }
                ]}
                onPress={handleForceReseed}
                disabled={isRunning}
              >
                <Text style={styles.actionButtonText}>
                  {isRunning ? '🔄 Running...' : '🔄 Force Re-seed'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  { backgroundColor: colors.secondary }
                ]}
                onPress={handleCheckStatus}
              >
                <Text style={styles.actionButtonText}>📊 Check Status</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Migration Information */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Migration Information</Text>
            
            <View style={styles.infoContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Initial Migration</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Creates users with different roles if the database is empty:
              </Text>
              <View style={styles.roleList}>
                <Text style={[styles.roleItem, { color: colors.textSecondary }]}>👑 Super Admin (1 user)</Text>
                <Text style={[styles.roleItem, { color: colors.textSecondary }]}>👨‍💼 Admin (3 users)</Text>
                <Text style={[styles.roleItem, { color: colors.textSecondary }]}>📊 Manager (2 users)</Text>
                <Text style={[styles.roleItem, { color: colors.textSecondary }]}>💰 Finance (4 users)</Text>
                <Text style={[styles.roleItem, { color: colors.textSecondary }]}>🎧 Support (4 users)</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Force Re-seed</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Clears all existing users and creates fresh data. Use with caution!
              </Text>
            </View>
          </View>

          {/* Last Result */}
          {lastResult && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Last Migration Result</Text>
              
              <View style={[
                styles.resultContainer,
                { backgroundColor: lastResult.success ? '#10b981' + '20' : '#ef4444' + '20' }
              ]}>
                <Text style={[
                  styles.resultText, 
                  { color: lastResult.success ? '#10b981' : '#ef4444' }
                ]}>
                  {lastResult.success ? '✅' : '❌'} {lastResult.message}
                </Text>
                
                {lastResult.stats && (
                  <View style={styles.statsContainer}>
                    <Text style={[styles.statText, { color: colors.text }]}>
                      Total Users: {lastResult.stats.totalUsers}
                    </Text>
                    <Text style={[styles.statText, { color: colors.text }]}>
                      Active: {lastResult.stats.activeUsers} | Inactive: {lastResult.stats.inactiveUsers}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={{ height: Spacing.xxxl }} />
        </ScrollView>
      </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    opacity: 0.8,
  },
  backButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  backButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  actionButtons: {
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.small,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  infoContainer: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
    marginBottom: Spacing.sm,
  },
  roleList: {
    marginTop: Spacing.sm,
  },
  roleItem: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
  resultContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  resultText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  statsContainer: {
    marginTop: Spacing.sm,
  },
  statText: {
    fontSize: FontSizes.sm,
    marginBottom: Spacing.xs,
  },
});
