import RideCard from '@/components/RideCard';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { mockRides } from '@/services/mockData';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function MyRidesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  // Get current user ID - use user from AuthContext or fallback to mock
  const currentUserId = user?.id || '1';
  const myRides = mockRides.filter((ride) => ride.publisherId === currentUserId);
  // Filter booked rides (rides where user is a passenger, not the publisher)
  // In a real app, this would come from bookings API
  const bookedRides = mockRides.filter((ride) => ride.publisherId !== currentUserId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* As Driver */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🚗 My Published Rides</Text>
        {myRides.length > 0 ? (
          myRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
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
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>🎫 My Bookings</Text>
        {bookedRides.length > 0 ? (
          bookedRides.map((ride) => (
            <RideCard 
              key={ride.id} 
              ride={ride} 
              isPassenger={true}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
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

