import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from '../components/useColorScheme';
import Colors from '../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../constants/Design';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  fare: number;
  distance: string;
  duration: string;
  driver: {
    name: string;
    phone: string;
    rating: number;
    vehicle: {
      make: string;
      model: string;
      number: string;
    };
  };
  bookingId: string;
}

export default function MyRidesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    setLoading(true);
    try {
      const token = await apiService.getToken();
      if (token) {
        const response = await apiService.getUserRides(token);
        if (response.success) {
          setRides(response.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRides();
    setRefreshing(false);
  };

  const handleCancelRide = async (rideId: string) => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride? Cancellation charges may apply.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await apiService.getToken();
              if (token) {
                const response = await apiService.cancelRide(token, rideId);
                if (response.success) {
                  Alert.alert('Success', 'Ride cancelled successfully');
                  loadRides();
                } else {
                  Alert.alert('Error', response.message || 'Failed to cancel ride');
                }
              }
            } catch (error) {
              console.error('Error cancelling ride:', error);
              Alert.alert('Error', 'Failed to cancel ride. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleTrackRide = (rideId: string) => {
    router.push(`/ride-tracking/${rideId}`);
  };

  const handleRateRide = (rideId: string) => {
    router.push(`/rate-ride/${rideId}`);
  };

  const handleRebookRide = (ride: Ride) => {
    router.push({
      pathname: '/search',
      params: {
        from: ride.from,
        to: ride.to,
        date: new Date().toISOString().split('T')[0],
        passengers: '1'
      }
    });
  };

  const filteredRides = rides.filter(ride => 
    filter === 'all' || ride.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#F59E0B';
      case 'ongoing': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return '🕒';
      case 'ongoing': return '🚗';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>My Rides</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map(filterItem => (
            <TouchableOpacity
              key={filterItem.key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: filter === filterItem.key ? colors.primary : colors.card,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setFilter(filterItem.key as any)}
            >
              <Text style={[
                styles.filterText,
                { color: filter === filterItem.key ? '#FFFFFF' : colors.text }
              ]}>
                {filterItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Rides List */}
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredRides.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🚗</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No rides found</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {filter === 'all' 
                  ? 'You haven\'t booked any rides yet'
                  : `No ${filter} rides found`
                }
              </Text>
              
              {filter === 'all' && (
                <TouchableOpacity
                  style={[styles.bookRideButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push('/(tabs)/')}
                >
                  <Text style={styles.bookRideText}>Book Your First Ride</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredRides.map(ride => (
              <View key={ride.id} style={[styles.rideCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {/* Status and Date */}
                <View style={styles.rideHeader}>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusIcon}>{getStatusIcon(ride.status)}</Text>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(ride.status) }
                    ]}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </Text>
                  </View>
                  
                  <Text style={[styles.rideDate, { color: colors.textSecondary }]}>
                    {new Date(ride.date).toLocaleDateString()} • {ride.time}
                  </Text>
                </View>

                {/* Route */}
                <View style={styles.routeContainer}>
                  <View style={styles.routeIndicators}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                  </View>
                  
                  <View style={styles.locations}>
                    <Text style={[styles.location, { color: colors.text }]}>{ride.from}</Text>
                    <View style={styles.routeInfo}>
                      <Text style={[styles.routeDetail, { color: colors.textSecondary }]}>
                        {ride.distance} • {ride.duration}
                      </Text>
                    </View>
                    <Text style={[styles.location, { color: colors.text }]}>{ride.to}</Text>
                  </View>
                </View>

                {/* Driver Info (for upcoming/ongoing rides) */}
                {(ride.status === 'upcoming' || ride.status === 'ongoing') && (
                  <View style={styles.driverInfo}>
                    <View style={styles.driverDetails}>
                      <Text style={[styles.driverName, { color: colors.text }]}>
                        {ride.driver.name}
                      </Text>
                      <Text style={[styles.vehicleInfo, { color: colors.textSecondary }]}>
                        {ride.driver.vehicle.make} {ride.driver.vehicle.model} • {ride.driver.vehicle.number}
                      </Text>
                      <View style={styles.rating}>
                        <Text style={styles.star}>⭐</Text>
                        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                          {ride.driver.rating.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Fare and Actions */}
                <View style={styles.rideFooter}>
                  <Text style={[styles.fare, { color: colors.primary }]}>
                    ₹{ride.fare.toFixed(2)}
                  </Text>
                  
                  <View style={styles.actions}>
                    {ride.status === 'upcoming' && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                          onPress={() => handleCancelRide(ride.id)}
                        >
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: colors.primary }]}
                          onPress={() => handleTrackRide(ride.id)}
                        >
                          <Text style={styles.actionButtonText}>Track</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    
                    {ride.status === 'ongoing' && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleTrackRide(ride.id)}
                      >
                        <Text style={styles.actionButtonText}>Track Live</Text>
                      </TouchableOpacity>
                    )}
                    
                    {ride.status === 'completed' && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: colors.lightGray }]}
                          onPress={() => handleRebookRide(ride)}
                        >
                          <Text style={[styles.actionButtonText, { color: colors.text }]}>
                            Rebook
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                          onPress={() => handleRateRide(ride.id)}
                        >
                          <Text style={styles.actionButtonText}>Rate</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    
                    {ride.status === 'cancelled' && (
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleRebookRide(ride)}
                      >
                        <Text style={styles.actionButtonText}>Rebook</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  filtersContainer: {
    paddingVertical: Spacing.md,
  },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  bookRideButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  bookRideText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  rideCard: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  rideDate: {
    fontSize: FontSizes.sm,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  routeIndicators: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    height: 24,
    marginVertical: 4,
  },
  locations: {
    flex: 1,
  },
  location: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  routeInfo: {
    paddingVertical: Spacing.xs,
  },
  routeDetail: {
    fontSize: FontSizes.sm,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  vehicleInfo: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: FontSizes.sm,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fare: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
