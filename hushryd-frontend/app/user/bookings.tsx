import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { apiService } from '@/services/apiService';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Booking {
  id: string;
  userId: string;
  rideId: string;
  passengerCount: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserBookingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Please login to view your bookings');
        router.replace('/login');
        return;
      }

      const response = await apiService.getUserBookings(token);
      if (response.success && response.data) {
        setBookings(response.data.bookings || []);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, [loadBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'completed':
        return 'checkmark-done-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading bookings...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.text }]}>{bookings.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {bookings.filter(b => b.status === 'confirmed').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Confirmed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Ionicons name="checkmark-done-circle" size={24} color="#6b7280" />
          <Text style={[styles.statValue, { color: colors.text }]}>
            {bookings.filter(b => b.status === 'completed').length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
        </View>
      </View>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No bookings yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
            Start booking rides to see them here
          </Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <TouchableOpacity
            key={booking.id}
            style={[styles.bookingCard, { backgroundColor: colors.card }]}
            activeOpacity={0.7}
          >
            <View style={styles.bookingHeader}>
              <View style={styles.bookingInfo}>
                <Text style={[styles.bookingId, { color: colors.text }]}>
                  Booking #{booking.id.slice(0, 8)}
                </Text>
                <Text style={[styles.bookingDate, { color: colors.textSecondary }]}>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + '20' },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(booking.status)}
                  size={16}
                  color={getStatusColor(booking.status)}
                />
                <Text
                  style={[styles.statusText, { color: getStatusColor(booking.status) }]}
                >
                  {booking.status}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="people" size={20} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  {booking.passengerCount} {booking.passengerCount === 1 ? 'seat' : 'seats'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="wallet" size={20} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  {CURRENCY_SYMBOL}{booking.totalPrice}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="card" size={20} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.text }]}>
                  {booking.paymentStatus}
                </Text>
              </View>
            </View>

            {booking.specialRequests && (
              <View style={styles.specialRequests}>
                <Text style={[styles.specialRequestsLabel, { color: colors.textSecondary }]}>
                  Special Requests:
                </Text>
                <Text style={[styles.specialRequestsText, { color: colors.text }]}>
                  {booking.specialRequests}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: FontSizes.md,
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },
  bookingCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingId: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  bookingDate: {
    fontSize: FontSizes.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bookingDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: FontSizes.md,
  },
  specialRequests: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  specialRequestsLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  specialRequestsText: {
    fontSize: FontSizes.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
});
