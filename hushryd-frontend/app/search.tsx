import SearchBar from '@/components/SearchBar';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/Design';
import { searchRides } from '@/services/mockData';
import { Ride, SearchParams } from '@/types/models';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SearchResultsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();

  const [results, setResults] = useState<Ride[]>([]);
  const [showSearchEdit, setShowSearchEdit] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('price');
  const [selectedService, setSelectedService] = useState<string>('');

  useEffect(() => {
    const { from, to, date, passengers, type, timeslot } = params;
    
    if (from && to && date) {
      console.log('=== SEARCH DIAGNOSTICS ===');
      console.log('Search params:', params);
      console.log('From:', from);
      console.log('To:', to);
      console.log('Date:', date);
      console.log('Passengers:', Number(passengers) || 1);
      console.log('Type:', type);
      console.log('Timeslot:', timeslot);
      
      const rides = searchRides(
        from as string,
        to as string,
        date as string,
        Number(passengers) || 1,
        type as 'carpool' | 'private' | 'all',
        timeslot as 'any' | 'early-morning' | 'morning' | 'late-morning' | 'afternoon' | 'evening' | 'late-evening' | 'night'
      );
      console.log('Search results count:', rides.length);
      console.log('Search results:', rides);
      console.log('=========================');
      setResults(rides);
    } else {
      console.log('=== SEARCH VALIDATION FAILED ===');
      console.log('Missing required fields:', {
        from: from || 'MISSING',
        to: to || 'MISSING',
        date: date || 'MISSING',
      });
      console.log('================================');
    }
  }, [params.from, params.to, params.date, params.passengers, params.type, params.timeslot]);

  const handleNewSearch = (searchParams: SearchParams) => {
    router.setParams({ ...searchParams });
    setShowSearchEdit(false);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'time') return a.time.localeCompare(b.time);
    if (sortBy === 'rating') return b.publisher.rating - a.publisher.rating;
    return 0;
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header with Edit Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Select Service</Text>
          <TouchableOpacity 
            onPress={() => setShowSearchEdit(!showSearchEdit)}
            style={styles.editButton}
          >
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Search Bar */}
        {showSearchEdit && (
          <View style={[styles.searchBarContainer, { backgroundColor: colors.card }]}>
            <SearchBar
              onSearch={handleNewSearch}
              initialValues={{
                from: params.from as string,
                to: params.to as string,
                date: params.date as string,
                passengers: Number(params.passengers) || 1,
                timeslot: params.timeslot as 'any' | 'early-morning' | 'morning' | 'late-morning' | 'afternoon' | 'evening' | 'late-evening' | 'night',
              }}
              compact
            />
          </View>
        )}
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
        {/* Route Card */}
        <View style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Pickup Location */}
          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: '#10B981' }]}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={2}>
                {params.from || 'Pickup location'}
              </Text>
            </View>
          </View>
          
          {/* Route Line */}
          <View style={styles.routeLineContainer}>
            <View style={[styles.routeLine, { borderColor: '#D1D5DB' }]} />
          </View>
          
          {/* Dropoff Location */}
          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: '#EF4444' }]}>
              <Text style={styles.iconText}>🎯</Text>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={[styles.locationText, { color: colors.text }]} numberOfLines={3}>
                {params.to || 'Dropoff location'}
              </Text>
            </View>
          </View>
        </View>

        {/* Service Selection */}
        <View style={[styles.servicesContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select service</Text>
          
          {/* Cab Non AC */}
          <TouchableOpacity 
            style={[
              styles.serviceCard, 
              { 
                backgroundColor: selectedService === 'non-ac' ? colors.primary + '20' : colors.card, 
                borderColor: selectedService === 'non-ac' ? colors.primary : colors.border 
              }
            ]}
            activeOpacity={0.7}
            onPress={() => setSelectedService('non-ac')}
          >
            <View style={styles.serviceIcon}>🚗</View>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Cab Non AC</Text>
            </View>
            <Text style={[styles.servicePrice, { color: colors.primary }]}>₹ 119 - ₹ 146</Text>
          </TouchableOpacity>

          {/* Cab Premium */}
          <TouchableOpacity 
            style={[
              styles.serviceCard, 
              { 
                backgroundColor: selectedService === 'premium' ? colors.primary + '20' : colors.card, 
                borderColor: selectedService === 'premium' ? colors.primary : colors.border 
              }
            ]}
            activeOpacity={0.7}
            onPress={() => setSelectedService('premium')}
          >
            <View style={styles.serviceIcon}>🚗</View>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Cab Premium</Text>
            </View>
            <Text style={[styles.servicePrice, { color: colors.primary }]}>₹ 157 - ₹ 192</Text>
          </TouchableOpacity>

          {/* Cab XL */}
          <TouchableOpacity 
            style={[
              styles.serviceCard, 
              { 
                backgroundColor: selectedService === 'xl' ? colors.primary + '20' : colors.card, 
                borderColor: selectedService === 'xl' ? colors.primary : colors.border 
              }
            ]}
            activeOpacity={0.7}
            onPress={() => setSelectedService('xl')}
          >
            <View style={styles.serviceIcon}>🚙</View>
            <View style={styles.serviceInfo}>
              <Text style={[styles.serviceName, { color: colors.text }]}>Cab XL</Text>
            </View>
            <Text style={[styles.servicePrice, { color: colors.primary }]}>₹ 179 - ₹ 218</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={[styles.paymentContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.paymentMethod}>
            <View style={styles.paymentIcon}>💳</View>
            <Text style={[styles.paymentText, { color: colors.text }]}>Cash</Text>
          </View>
        </View>

        {/* Continue Booking Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            { 
              backgroundColor: selectedService ? '#FFEB3B' : '#E0E0E0',
              opacity: selectedService ? 1 : 0.5
            }
          ]}
          activeOpacity={0.8}
          disabled={!selectedService}
          onPress={() => {
            if (selectedService) {
              // Navigate to guest booking registration first
              router.push({
                pathname: '/guest-booking',
                params: {
                  service: selectedService,
                  from: params.from,
                  to: params.to,
                  date: params.date,
                  passengers: params.passengers,
                }
              });
            }
          }}
        >
          <Text style={styles.continueButtonText}>
            {selectedService ? 'Continue Booking' : 'Select a Service'}
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header Styles
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
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  editButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  // ScrollView Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  searchSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.small,
  },
  searchInfo: {
    flex: 1,
  },
  searchRoute: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  searchDetails: {
    fontSize: FontSizes.sm,
  },
  searchToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.small,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  resultsCount: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  largeGroupNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  largeGroupIcon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.sm,
  },
  largeGroupText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    flex: 1,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sortButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  sortButtonActive: {
    borderWidth: 0,
  },
  sortText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  emptyState: {
    padding: Spacing.huge,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
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
  },
  // Route Card Styles
  routeCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    ...Shadows.small,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 16,
  },
  locationTextContainer: {
    flex: 1,
    paddingTop: 4,
  },
  locationText: {
    fontSize: FontSizes.md,
    lineHeight: 20,
  },
  routeLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
    paddingLeft: 16,
  },
  routeLine: {
    width: 2,
    height: 32,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  // Service Selection Styles
  servicesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  serviceIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  // Payment Method Styles
  paymentContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  paymentText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  // Continue Booking Button Styles
  continueButton: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  continueButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: '#000000',
  },
});
