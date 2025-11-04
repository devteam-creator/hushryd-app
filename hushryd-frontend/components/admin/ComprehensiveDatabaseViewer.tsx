import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { comprehensiveDatabaseService } from '../../services/comprehensiveDatabaseService';
import { useColorScheme } from '../useColorScheme';

export default function ComprehensiveDatabaseViewer() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('stats');

  const stats = comprehensiveDatabaseService.getDatabaseStats();

  const renderStats = () => (
    <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
      <Text style={[styles.tabTitle, { color: colors.text }]}>Database Statistics</Text>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalUsers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Users</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalDrivers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Drivers</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalRides}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Rides</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalBookings}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Bookings</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalTransactions}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Transactions</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>₹{stats.totalRevenue.toLocaleString()}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Revenue</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.activeUsers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Users</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.completedRides}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed Rides</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.totalReviews}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Reviews</Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.averageRating.toFixed(1)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Average Rating</Text>
        </View>
      </View>
    </View>
  );

  const renderUsers = () => {
    const users = comprehensiveDatabaseService.getAllUsers();
    return (
      <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Users ({users.length})</Text>
        {users.map(user => (
          <View key={user.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>{user.firstName} {user.lastName}</Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{user.email}</Text>
            <Text style={[styles.itemRole, { color: colors.primary }]}>{user.role.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRides = () => {
    const rides = comprehensiveDatabaseService.getAllRides();
    return (
      <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Rides ({rides.length})</Text>
        {rides.map(ride => (
          <View key={ride.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>
              {ride.fromLocation.city} → {ride.toLocation.city}
            </Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
              ₹{ride.price} • {ride.availableSeats} seats available
            </Text>
            <Text style={[styles.itemStatus, { color: colors.primary }]}>{ride.status.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderBookings = () => {
    const bookings = comprehensiveDatabaseService.getAllBookings();
    return (
      <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Bookings ({bookings.length})</Text>
        {bookings.map(booking => (
          <View key={booking.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>
              Booking #{booking.id.slice(-8)}
            </Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
              {booking.passengerCount} passengers • ₹{booking.totalPrice}
            </Text>
            <Text style={[styles.itemStatus, { color: colors.primary }]}>{booking.status.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTransactions = () => {
    const transactions = comprehensiveDatabaseService.getAllTransactions();
    return (
      <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Transactions ({transactions.length})</Text>
        {transactions.map(transaction => (
          <View key={transaction.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>
              {transaction.type.toUpperCase()} • ₹{transaction.amount}
            </Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
              {transaction.paymentMethod} • {transaction.description}
            </Text>
            <Text style={[styles.itemStatus, { color: colors.primary }]}>{transaction.status.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReviews = () => {
    const reviews = comprehensiveDatabaseService.getAllReviews();
    return (
      <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
        <Text style={[styles.tabTitle, { color: colors.text }]}>Reviews ({reviews.length})</Text>
        {reviews.map(review => (
          <View key={review.id} style={[styles.itemCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>
              ⭐ {review.rating}/5
            </Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
              {review.comment || 'No comment provided'}
            </Text>
            <Text style={[styles.itemStatus, { color: colors.primary }]}>{review.status.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    );
  };

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'rides', label: 'Rides', icon: '🚗' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
    { id: 'transactions', label: 'Transactions', icon: '💳' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats': return renderStats();
      case 'users': return renderUsers();
      case 'rides': return renderRides();
      case 'bookings': return renderBookings();
      case 'transactions': return renderTransactions();
      case 'reviews': return renderReviews();
      default: return renderStats();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Comprehensive Database Viewer</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        View and manage all database tables and their data
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === tab.id ? colors.primary : colors.card,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              { color: activeTab === tab.id ? '#FFFFFF' : colors.text }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
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
    marginBottom: Spacing.small,
  },
  description: {
    fontSize: FontSizes.medium,
    marginBottom: Spacing.medium,
  },
  tabContainer: {
    marginBottom: Spacing.medium,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    marginRight: Spacing.small,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
  },
  tabIcon: {
    fontSize: FontSizes.medium,
    marginRight: Spacing.xs,
  },
  tabLabel: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  content: {
    maxHeight: 400,
  },
  tabContent: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
  },
  tabTitle: {
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    marginBottom: Spacing.small,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.small,
    textAlign: 'center',
  },
  itemCard: {
    padding: Spacing.medium,
    borderRadius: BorderRadius.small,
    borderWidth: 1,
    marginBottom: Spacing.small,
  },
  itemTitle: {
    fontSize: FontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemSubtitle: {
    fontSize: FontSizes.small,
    marginBottom: Spacing.xs,
  },
  itemRole: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
  itemStatus: {
    fontSize: FontSizes.small,
    fontWeight: '600',
  },
});
