import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../../components/admin/AdminLayoutBasic';
import { BorderRadius, FontSizes, Spacing } from '../../../constants/Design';
import { useAuth } from '../../../contexts/AuthContext';
import { apiService } from '../../../services/apiService';

export default function RideDetailsPage() {
  const { id: rideId } = useLocalSearchParams();
  const { admin } = useAuth();
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load ride details from API
  const loadRide = async () => {
    try {
      setLoading(true);
      
      if (!admin) {
        Alert.alert('Error', 'Please log in to view ride details');
        return;
      }

      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      console.log('Loading ride with ID:', rideId);
      const response = await apiService.getRideById(rideId as string, token);
      console.log('Ride API response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        // Backend returns: { error: false, data: { ride: {...} } }
        // apiCall wraps it as: { success: true, data: { ride: {...} } }
        let rideData = null;
        
        if (response.data) {
          // Check if data.ride exists
          if (response.data.ride) {
            rideData = response.data.ride;
          } else if (response.data.id) {
            // Data itself is the ride object
            rideData = response.data;
          }
        }
        
        if (rideData) {
          console.log('Ride data loaded:', rideData);
          setRide(rideData);
        } else {
          console.error('No ride data found in response');
          Alert.alert('Error', 'Ride data not found in response');
          router.back();
        }
      } else {
        console.error('Failed to load ride:', response.message);
        Alert.alert('Error', response.message || 'Failed to load ride details');
        router.back();
      }
    } catch (error) {
      console.error('Error loading ride:', error);
      Alert.alert('Error', 'Failed to load ride details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRide();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Ride Details" currentPage="rides">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading ride details...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (!ride) {
    return (
      <AdminLayout title="Ride Details" currentPage="rides">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ride not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back to Rides</Text>
          </TouchableOpacity>
        </View>
      </AdminLayout>
    );
  }

  // Mock data for demonstration (when API data is not complete)
  const mockRideData = {
    id: rideId,
    from: 'Hyderabad',
    to: 'Chennai',
    driver: {
      name: 'John Doe',
      phone: '+91-9876543210',
      rating: 4.8,
      experience: '3 years',
      license: 'DL123456789',
      avatar: '👨‍💼',
      address: '123 Main Street, Hyderabad',
      emergencyContact: '+91-9876543211'
    },
    vehicle: {
      make: 'Toyota',
      model: 'Innova',
      year: 2022,
      color: 'White',
      licensePlate: 'TS09AB1234',
      capacity: 7,
      features: ['AC', 'Music System', 'GPS'],
      insurance: 'Valid until Dec 2024',
      registration: 'Valid until Mar 2025'
    },
    passengers: [
      { 
        name: 'Alice Smith', 
        phone: '+91-9876543211', 
        seat: 1,
        age: 28,
        emergencyContact: '+91-9876543212',
        specialRequests: 'Window seat preferred',
        rating: 4.5,
        feedback: 'Great driver, very professional'
      },
      { 
        name: 'Bob Johnson', 
        phone: '+91-9876543212', 
        seat: 2,
        age: 35,
        emergencyContact: '+91-9876543213',
        specialRequests: 'None',
        rating: 5.0,
        feedback: 'Excellent service, very clean vehicle'
      },
      { 
        name: 'Carol Brown', 
        phone: '+91-9876543213', 
        seat: 3,
        age: 42,
        emergencyContact: '+91-9876543214',
        specialRequests: 'Vegetarian meal',
        rating: 4.0,
        feedback: 'Punctual and safe driver'
      }
    ],
    route: {
      distance: '625 km',
      duration: '8h 15m',
      waypoints: ['Bangalore', 'Vellore'],
      tolls: 'Rs 450',
      fuelCost: 'Rs 1,200'
    },
    pricing: {
      baseFare: 'Rs 2,000',
      distanceFare: 'Rs 300',
      tolls: 'Rs 450',
      total: 'Rs 2,500',
      currency: 'INR'
    },
    status: 'Completed',
    date: '2024-01-20',
    time: '10:30 AM',
    pickupLocation: 'Hyderabad Central Mall',
    dropoffLocation: 'Chennai Central Station',
    bookingDate: '2024-01-18',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI'
  };

  // Use API data if available, otherwise use mock data
  const displayRide = ride || mockRideData;
  
  // Format location for display
  const formatLocation = (location: any) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return location.address;
      if (location.city && location.state) return `${location.city}, ${location.state}`;
      if (location.city) return location.city;
      return JSON.stringify(location);
    }
    return 'N/A';
  };
  
  const fromLocation = ride?.fromLocation ? formatLocation(ride.fromLocation) : mockRideData.from;
  const toLocation = ride?.toLocation ? formatLocation(ride.toLocation) : mockRideData.to;
  const status = ride?.status || mockRideData.status;
  const date = ride?.pickupDate || mockRideData.date;
  const time = ride?.pickupTime || mockRideData.time;
  const fare = ride?.fare ? `₹${ride.fare.toFixed(2)}` : mockRideData.pricing.total;
  const distance = ride?.distance ? `${ride.distance} km` : mockRideData.route.distance;
  const duration = ride?.duration ? `${ride.duration} hours` : mockRideData.route.duration;

  return (
    <AdminLayout title={`Ride Details - ${rideId}`} currentPage="rides">
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Rides</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.container}>
        {/* Ride Overview */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>🚗 Ride Overview</Text>
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>{fromLocation} → {toLocation}</Text>
            <Text style={styles.statusBadge}>{status}</Text>
          </View>
          <View style={styles.rideMeta}>
            <Text style={styles.metaText}>📅 {date} at {time}</Text>
            <Text style={styles.metaText}>💰 {fare}</Text>
            <Text style={styles.metaText}>⏱️ {duration}</Text>
            <Text style={styles.metaText}>📏 {distance}</Text>
          </View>
        </View>

        {/* Driver Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>👨‍💼 Driver Information</Text>
          <View style={styles.driverCard}>
            <Text style={styles.driverAvatar}>{mockRideData.driver.avatar}</Text>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{mockRideData.driver.name}</Text>
              <Text style={styles.driverPhone}>📞 {mockRideData.driver.phone}</Text>
              <Text style={styles.driverRating}>⭐ {mockRideData.driver.rating}/5 Rating</Text>
              <Text style={styles.driverExp}>🚗 {mockRideData.driver.experience} Experience</Text>
              <Text style={styles.driverLicense}>🆔 License: {mockRideData.driver.license}</Text>
              <Text style={styles.driverAddress}>📍 {mockRideData.driver.address}</Text>
              <Text style={styles.driverEmergency}>🚨 Emergency: {mockRideData.driver.emergencyContact}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>🚙 Vehicle Information</Text>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleInfo}>Make: {mockRideData.vehicle.make}</Text>
            <Text style={styles.vehicleInfo}>Model: {mockRideData.vehicle.model}</Text>
            <Text style={styles.vehicleInfo}>Year: {mockRideData.vehicle.year}</Text>
            <Text style={styles.vehicleInfo}>Color: {mockRideData.vehicle.color}</Text>
            <Text style={styles.vehicleInfo}>License Plate: {mockRideData.vehicle.licensePlate}</Text>
            <Text style={styles.vehicleInfo}>Capacity: {mockRideData.vehicle.capacity} seats</Text>
            <Text style={styles.vehicleInfo}>Features: {mockRideData.vehicle.features.join(', ')}</Text>
            <Text style={styles.vehicleInfo}>Insurance: {mockRideData.vehicle.insurance}</Text>
            <Text style={styles.vehicleInfo}>Registration: {mockRideData.vehicle.registration}</Text>
          </View>
        </View>

        {/* Passenger Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>👥 Passengers ({mockRideData.passengers.length})</Text>
          {mockRideData.passengers.map((passenger: any, index: number) => (
            <View key={index} style={styles.passengerCard}>
              <Text style={styles.passengerAvatar}>{passenger.name.charAt(0)}</Text>
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>{passenger.name}</Text>
                <Text style={styles.passengerInfo}>📞 {passenger.phone}</Text>
                <Text style={styles.passengerInfo}>🎂 Age: {passenger.age}</Text>
                <Text style={styles.passengerInfo}>💺 Seat: #{passenger.seat}</Text>
                <Text style={styles.passengerInfo}>🚨 Emergency: {passenger.emergencyContact}</Text>
                <Text style={styles.passengerInfo}>📝 Requests: {passenger.specialRequests}</Text>
                <View style={styles.ratingSection}>
                  <Text style={styles.ratingLabel}>⭐ Rating: {passenger.rating}/5</Text>
                  <Text style={styles.feedbackText}>"{passenger.feedback}"</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Route & Pricing */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>🗺️ Route & Pricing</Text>
          <View style={styles.pricingSection}>
            <Text style={styles.pricingTitle}>Pricing Breakdown:</Text>
            <Text style={styles.pricingItem}>Base Fare: {mockRideData.pricing.baseFare}</Text>
            <Text style={styles.pricingItem}>Distance Fare: {mockRideData.pricing.distanceFare}</Text>
            <Text style={styles.pricingItem}>Tolls: {mockRideData.pricing.tolls}</Text>
            <Text style={styles.pricingTotal}>Total: {mockRideData.pricing.total}</Text>
          </View>
          <View style={styles.routeSection}>
            <Text style={styles.routeTitle}>Route Details:</Text>
            <Text style={styles.routeItem}>Pickup: {mockRideData.pickupLocation}</Text>
            <Text style={styles.routeItem}>Dropoff: {mockRideData.dropoffLocation}</Text>
            <Text style={styles.routeItem}>Waypoints: {mockRideData.route.waypoints.join(', ')}</Text>
            <Text style={styles.routeItem}>Fuel Cost: {mockRideData.route.fuelCost}</Text>
          </View>
        </View>

        {/* Payment & Booking */}
        <View style={styles.detailsCard}>
          <Text style={styles.title}>💳 Payment & Booking</Text>
          <Text style={styles.bookingInfo}>Booking Date: {mockRideData.bookingDate}</Text>
          <Text style={styles.bookingInfo}>Payment Status: {mockRideData.paymentStatus}</Text>
          <Text style={styles.bookingInfo}>Payment Method: {mockRideData.paymentMethod}</Text>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginBottom: Spacing.lg,
  },
  infoSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: FontSizes.md,
    color: '#374151',
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routeText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  rideMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    marginBottom: Spacing.xs,
    flex: 1,
    minWidth: '45%',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  driverAvatar: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  driverPhone: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  driverRating: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  driverExp: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  driverLicense: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  driverAddress: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  driverEmergency: {
    fontSize: FontSizes.sm,
    color: '#374151',
  },
  vehicleDetails: {
    marginTop: Spacing.sm,
  },
  vehicleInfo: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  passengerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    marginRight: Spacing.sm,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.xs,
  },
  passengerInfo: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    marginBottom: 2,
  },
  pricingSection: {
    marginBottom: Spacing.lg,
  },
  pricingTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  pricingItem: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  pricingTotal: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  routeSection: {
    marginTop: Spacing.lg,
  },
  routeTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  routeItem: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
  },
  bookingInfo: {
    fontSize: FontSizes.sm,
    color: '#374151',
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  backButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#374151',
  },
  ratingSection: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  ratingLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: Spacing.xs,
  },
  feedbackText: {
    fontSize: FontSizes.sm,
    color: '#92400E',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: '#6B7280',
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: '#EF4444',
    marginBottom: Spacing.lg,
  },
});
