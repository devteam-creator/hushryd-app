import RideCard from '@/components/RideCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { mockRides } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function MyRidesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const isWeb = Platform.OS === 'web';

  // Get current user ID - use user from AuthContext or fallback to mock
  const currentUserId = user?.id || '1';
  const myRides = mockRides.filter((ride) => ride.publisherId === currentUserId);
  // Filter booked rides (rides where user is a passenger, not the publisher)
  // In a real app, this would come from bookings API
  const bookedRides = mockRides.filter((ride) => ride.publisherId !== currentUserId);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={!isWeb ? mobileStyles.content : undefined}
    >
      {!isWeb && (
        <LinearGradient
          colors={[colors.primary, '#FFCA28']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={mobileStyles.header}
        >
          <Text style={mobileStyles.headerTitle}>Your rides</Text>
          <Text style={mobileStyles.headerSubtitle}>
            Track every ride you publish or book with a Rapido-inspired overview.
          </Text>
          <View style={mobileStyles.headerStats}>
            <View style={[mobileStyles.statCard, { backgroundColor: '#fff8cc' }]}>
              <Text style={mobileStyles.statValue}>{myRides.length}</Text>
              <Text style={mobileStyles.statLabel}>Published</Text>
            </View>
            <View style={[mobileStyles.statCard, { backgroundColor: '#ffecb3' }]}>
              <Text style={mobileStyles.statValue}>{bookedRides.length}</Text>
              <Text style={mobileStyles.statLabel}>Bookings</Text>
            </View>
            <View style={[mobileStyles.statCard, { backgroundColor: '#ffe082' }]}>
              <Text style={mobileStyles.statValue}>{myRides.filter((r) => r.status === 'completed').length}</Text>
              <Text style={mobileStyles.statLabel}>Completed</Text>
            </View>
          </View>
        </LinearGradient>
      )}

      {/* As Driver */}
      <View
        style={[
          isWeb ? styles.section : mobileStyles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={isWeb ? undefined : mobileStyles.sectionHeader}>
          <Text style={[isWeb ? styles.sectionTitle : mobileStyles.sectionTitle, { color: colors.text }]}>
            🚗 My Published Rides
          </Text>
          {!isWeb && (
            <Text style={[mobileStyles.sectionSubtitle, { color: colors.textSecondary }]}>
              Manage journeys you share as a captain.
            </Text>
          )}
        </View>
        {myRides.length > 0 ? (
          myRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
        ) : (
          <View style={[styles.emptyState, !isWeb && mobileStyles.emptyStateCard, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You haven't published any rides yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap "Publish" to create your first ride
            </Text>
          </View>
        )}
      </View>

      {/* As Passenger */}
      <View
        style={[
          isWeb ? styles.section : mobileStyles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={isWeb ? undefined : mobileStyles.sectionHeader}>
          <Text style={[isWeb ? styles.sectionTitle : mobileStyles.sectionTitle, { color: colors.text }]}>
            🎫 My Bookings
          </Text>
          {!isWeb && (
            <Text style={[mobileStyles.sectionSubtitle, { color: colors.textSecondary }]}>
              Quickly rebook or rate your completed trips.
            </Text>
          )}
        </View>
        {bookedRides.length > 0 ? (
          bookedRides.map((ride) => (
            <RideCard 
              key={ride.id} 
              ride={ride} 
              isPassenger={true}
            />
          ))
        ) : (
          <View style={[styles.emptyState, !isWeb && mobileStyles.emptyStateCard, { backgroundColor: colors.card }]}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              You don't have any bookings
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Search and book your first ride
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

const mobileStyles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.huge,
  },
  header: {
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: '#3A3A3A',
    marginTop: Spacing.sm,
    maxWidth: 320,
    lineHeight: 20,
  },
  headerStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statLabel: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#424242',
  },
  sectionCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    marginTop: Spacing.xs,
  },
  emptyStateCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Shadows.small,
  },
});

