import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { TableColumn } from '../../components/admin/DataTable';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { useColorScheme } from '../../components/useColorScheme';
import Colors, { CURRENCY_SYMBOL } from '../../constants/Colors';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { exportToExcel, formatBookingsDataForExcel } from '../../utils/excelExport';

// StatCard component
const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) => (
  <View style={[styles.statCard, { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Types
type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'no_show';
type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

interface Booking {
  id: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  carNumber: string;
  carOwner: string;
  carOwnerPhone: string;
  rideId: string;
  from: string;
  to: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  rideDate: string;
  rideTime: string;
  seatsBooked: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  feedback?: {
    rating: number;
    comment: string;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    passengerName: 'Rajesh Kumar',
    passengerPhone: '+91 98765 43210',
    passengerEmail: 'rajesh.kumar@email.com',
    carNumber: 'TS09AB1234',
    carOwner: 'Karthik Menon',
    carOwnerPhone: '+91 87654 32109',
    rideId: 'ride1',
    from: 'Hyderabad',
    to: 'Vijayawada',
    pickupLocation: 'Gachibowli, Hyderabad',
    dropLocation: 'Prakasam Barrage, Vijayawada',
    bookingDate: '2025-01-10',
    rideDate: '2025-01-14',
    rideTime: '11:00',
    seatsBooked: 2,
    totalAmount: 1040,
    status: 'completed',
    paymentStatus: 'paid',
    specialRequests: 'Need AC car with WiFi',
    feedback: {
      rating: 5,
      comment: 'Excellent ride! Driver was punctual and the car was very clean.',
      date: '2025-01-14'
    },
    createdAt: '2025-01-10',
    updatedAt: '2025-01-14',
  },
  {
    id: '2',
    passengerName: 'Meera Singh',
    passengerPhone: '+91 87654 32109',
    passengerEmail: 'meera.singh@email.com',
    carNumber: 'TS09AB1234',
    carOwner: 'Karthik Menon',
    carOwnerPhone: '+91 87654 32109',
    rideId: 'ride1',
    from: 'Hyderabad',
    to: 'Vijayawada',
    pickupLocation: 'HITEC City, Hyderabad',
    dropLocation: 'Vijayawada Railway Station',
    bookingDate: '2025-01-11',
    rideDate: '2025-01-14',
    rideTime: '11:00',
    seatsBooked: 1,
    totalAmount: 520,
    status: 'completed',
    paymentStatus: 'paid',
    feedback: {
      rating: 4,
      comment: 'Good ride overall. Driver was friendly and the journey was comfortable.',
      date: '2025-01-14'
    },
    createdAt: '2025-01-11',
    updatedAt: '2025-01-14',
  },
  {
    id: '3',
    passengerName: 'Arjun Reddy',
    passengerPhone: '+91 91234 56789',
    passengerEmail: 'arjun.reddy@email.com',
    carNumber: 'AP16CD5678',
    carOwner: 'Priya Sharma',
    carOwnerPhone: '+91 92345 67890',
    rideId: 'ride2',
    from: 'Vijayawada',
    to: 'Hyderabad',
    pickupLocation: 'Vijayawada Bus Stand',
    dropLocation: 'Cyber City, Hyderabad',
    bookingDate: '2025-01-12',
    rideDate: '2025-01-13',
    rideTime: '16:00',
    seatsBooked: 1,
    totalAmount: 460,
    status: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'Window seat preferred',
    createdAt: '2025-01-12',
    updatedAt: '2025-01-12',
  },
  {
    id: '4',
    passengerName: 'Kavitha Rao',
    passengerPhone: '+91 92345 67890',
    passengerEmail: 'kavitha.rao@email.com',
    carNumber: 'AP16CD5678',
    carOwner: 'Priya Sharma',
    carOwnerPhone: '+91 92345 67890',
    rideId: 'ride2',
    from: 'Vijayawada',
    to: 'Hyderabad',
    pickupLocation: 'One Town, Vijayawada',
    dropLocation: 'Gachibowli, Hyderabad',
    bookingDate: '2025-01-12',
    rideDate: '2025-01-13',
    rideTime: '16:00',
    seatsBooked: 2,
    totalAmount: 920,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2025-01-12',
    updatedAt: '2025-01-12',
  },
  {
    id: '5',
    passengerName: 'Vikram Singh',
    passengerPhone: '+91 93456 78901',
    passengerEmail: 'vikram.singh@email.com',
    carNumber: 'KA01EF9012',
    carOwner: 'Anitha Reddy',
    carOwnerPhone: '+91 94567 89012',
    rideId: 'ride3',
    from: 'Hyderabad',
    to: 'Bangalore',
    pickupLocation: 'Kondapur, Hyderabad',
    dropLocation: 'MG Road, Bangalore',
    bookingDate: '2025-01-13',
    rideDate: '2025-01-16',
    rideTime: '07:00',
    seatsBooked: 1,
    totalAmount: 600,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2025-01-13',
    updatedAt: '2025-01-13',
  },
];

const BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show'];
const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'paid', 'refunded', 'failed'];

export default function AdminBookingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { admin } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  
  // Filter states
  const [mobileNumberFilter, setMobileNumberFilter] = useState('');
  const [carNumberFilter, setCarNumberFilter] = useState('');
  const [carOwnerFilter, setCarOwnerFilter] = useState('');
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | PaymentStatus>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<Booking>>({});

  // Load bookings from API
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      if (!admin) {
        Alert.alert('Error', 'Please log in to view bookings');
        return;
      }
      const token = await apiService.getToken();
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }
      
      const bookingsResponse = await apiService.getBookings(token);
      console.log('Bookings API response:', bookingsResponse);
      if (bookingsResponse.success && bookingsResponse.data) {
        const bookingsData = bookingsResponse.data.bookings || [];
        console.log('Bookings loaded:', bookingsData.length);
        
        // If no bookings from API, use mock data
        if (bookingsData.length === 0) {
          console.log('No bookings from API, using mock data');
          setBookings(mockBookings);
        } else {
          // Transform backend data to match frontend interface
          const transformedBookings = bookingsData.map((booking: any) => ({
            id: booking.id || '',
            passengerName: booking.passengerName || 'N/A',
            passengerPhone: booking.passengerPhone || 'N/A',
            passengerEmail: booking.passengerEmail || 'N/A',
            carNumber: booking.carNumber || 'N/A',
            carOwner: booking.carOwner || 'N/A',
            carOwnerPhone: booking.carOwnerPhone || 'N/A',
            rideId: booking.rideId || '',
            from: booking.from || 'N/A',
            to: booking.to || 'N/A',
            pickupLocation: booking.pickupLocation || 'N/A',
            dropLocation: booking.dropLocation || 'N/A',
            bookingDate: booking.bookingDate || '',
            rideDate: booking.rideDate || '',
            rideTime: booking.rideTime || '',
            seatsBooked: booking.seatsBooked || booking.passengerCount || 1,
            totalAmount: booking.totalAmount || booking.totalPrice || 0,
            status: (booking.status || 'pending') as BookingStatus,
            paymentStatus: (booking.paymentStatus || 'pending') as PaymentStatus,
            specialRequests: booking.specialRequests,
            feedback: booking.feedback,
            createdAt: booking.createdAt || new Date().toISOString(),
            updatedAt: booking.updatedAt || new Date().toISOString(),
          }));
          
          setBookings(transformedBookings);
        }
      } else {
        // If API call fails, use mock data
        console.log('API call failed, using mock data');
        setBookings(mockBookings);
      }
      
      const statsResponse = await apiService.getBookingStats(token);
      console.log('Stats API response:', statsResponse);
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data.stats);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    loadBookings();
  }, []);

  const handleEdit = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setFormData(booking);
    setIsEditing(true);
    setShowModal(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!selectedBooking || !formData) return;
    
    setBookings(bookings.map(b => 
      b.id === selectedBooking.id 
        ? { ...b, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
        : b
    ));
    
    setShowModal(false);
    setIsEditing(false);
    setSelectedBooking(null);
    setFormData({});
    Alert.alert('Success', 'Booking updated successfully');
  }, [selectedBooking, formData, bookings]);

  const handleCancelEdit = useCallback(() => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedBooking(null);
    setFormData({});
  }, []);

  const handleDelete = useCallback((booking: Booking) => {
    Alert.alert(
      'Delete Booking',
      `Are you sure you want to delete the booking for ${booking.passengerName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBookings(bookings.filter(b => b.id !== booking.id));
            Alert.alert('Success', 'Booking deleted successfully');
          },
        },
      ]
    );
  }, [bookings]);

  const handleToggleStatus = useCallback((booking: Booking) => {
    const statusOrder = ['pending', 'confirmed', 'active', 'completed'];
    const currentIndex = statusOrder.indexOf(booking.status);
    const newStatus = currentIndex < statusOrder.length - 1 
      ? statusOrder[currentIndex + 1] as BookingStatus
      : 'pending';
    
    setBookings(bookings.map(b => 
      b.id === booking.id 
        ? { ...b, status: newStatus }
        : b
    ));
    Alert.alert('Success', `Booking status updated to ${newStatus}`);
  }, [bookings]);

  const handleViewDetails = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  }, []);

  const handleExportToExcel = async () => {
    try {
      const { headers, data } = formatBookingsDataForExcel(filteredBookings);
      await exportToExcel({
        filename: 'bookings_data',
        sheetName: 'Bookings',
        headers,
        data
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesMobile = !mobileNumberFilter || 
        booking.passengerPhone.includes(mobileNumberFilter) ||
        booking.carOwnerPhone.includes(mobileNumberFilter);
      
      const matchesCarNumber = !carNumberFilter || 
        booking.carNumber.toLowerCase().includes(carNumberFilter.toLowerCase());
      
      const matchesCarOwner = !carOwnerFilter || 
        booking.carOwner.toLowerCase().includes(carOwnerFilter.toLowerCase());
      
      const matchesFromDate = !fromDateFilter || booking.rideDate >= fromDateFilter;
      const matchesToDate = !toDateFilter || booking.rideDate <= toDateFilter;
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || booking.paymentStatus === paymentStatusFilter;
      
      return matchesMobile && matchesCarNumber && matchesCarOwner && 
             matchesFromDate && matchesToDate && matchesStatus && matchesPaymentStatus;
    });
  }, [bookings, mobileNumberFilter, carNumberFilter, carOwnerFilter, fromDateFilter, toDateFilter, statusFilter, paymentStatusFilter]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      case 'no_show': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'paid': return '#10b981';
      case 'refunded': return '#6b7280';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const columns: TableColumn[] = useMemo(() => [
    {
      key: 'passenger',
      label: 'Passenger',
      width: 150,
      render: (_, row) => (
        <View>
          <Text style={[styles.passengerName, { color: colors.text }]} numberOfLines={1}>
            {row.passengerName}
          </Text>
          <Text style={[styles.passengerPhone, { color: colors.textSecondary }]} numberOfLines={1}>
            {row.passengerPhone}
          </Text>
        </View>
      ),
    },
    {
      key: 'car',
      label: 'Car Details',
      width: 120,
      render: (_, row) => (
        <View>
          <Text style={[styles.carNumber, { color: colors.text }]} numberOfLines={1}>
            {row.carNumber}
          </Text>
          <Text style={[styles.carOwner, { color: colors.textSecondary }]} numberOfLines={1}>
            {row.carOwner}
          </Text>
        </View>
      ),
    },
    {
      key: 'route',
      label: 'Route',
      width: 140,
      render: (_, row) => (
        <View>
          <Text style={[styles.routeText, { color: colors.text }]}>
            {row.from} → {row.to}
          </Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]} numberOfLines={1}>
            {row.rideDate} {row.rideTime}
          </Text>
        </View>
      ),
    },
    {
      key: 'booking',
      label: 'Booking',
      width: 100,
      render: (_, row) => (
        <View>
          <Text style={[styles.seatsText, { color: colors.text }]}>
            {row.seatsBooked} seat{row.seatsBooked > 1 ? 's' : ''}
          </Text>
          <Text style={[styles.amountText, { color: colors.text, fontWeight: '600' }]}>
            {CURRENCY_SYMBOL}{row.totalAmount}
          </Text>
        </View>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 100,
      render: (value) => (
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(value) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(value) }]}>
            {value}
          </Text>
        </View>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      width: 80,
      render: (value) => (
        <View style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(value) + '20' }]}>
          <Text style={[styles.statusText, { color: getPaymentStatusColor(value) }]}>
            {value}
          </Text>
        </View>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 200,
      render: (_, row) => (
        <View style={styles.actionsCell}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => handleEdit(row)}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#10b98120' }]}
            onPress={() => handleViewDetails(row)}
          >
            <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#f59e0b20' }]}
            onPress={() => handleToggleStatus(row)}
          >
            <Text style={[styles.actionButtonText, { color: '#f59e0b' }]}>Status</Text>
          </TouchableOpacity>
      </View>
      ),
    },
  ], [colors, handleEdit, handleViewDetails, handleToggleStatus]);

  if (loading && bookings.length === 0) {
    return (
      <ProtectedRoute pageId="bookings">
        <AdminLayout title="Booking Management" currentPage="bookings">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute pageId="bookings">
      <AdminLayout title="Booking Management" currentPage="bookings">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with Export Button */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Manage and monitor all bookings</Text>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportToExcel}>
            <Text style={styles.exportButtonText}>📊 Export to CSV</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="📋"
            label="Total Bookings"
            value={stats?.totalBookings?.toString() || bookings.length.toString()}
            color="#3b82f6"
          />
          <StatCard
            icon="✅"
            label="Confirmed"
            value={stats?.confirmedBookings?.toString() || bookings.filter(b => b.status === 'confirmed').length.toString()}
            color="#10b981"
          />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={CURRENCY_SYMBOL + (typeof stats?.totalRevenue === 'number' ? stats.totalRevenue.toFixed(0) : bookings.reduce((sum, b) => sum + b.totalAmount, 0).toString())}
            color="#8b5cf6"
          />
          <StatCard
            icon="🏁"
            label="Completed"
            value={stats?.completedBookings?.toString() || bookings.filter(b => b.status === 'completed').length.toString()}
            color="#6b7280"
          />
        </View>

        {/* Advanced Filters */}
        <View style={[styles.filtersCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>Advanced Filters</Text>
          
          {/* First Row - Mobile Number & Car Number */}
          <View style={styles.filterRow}>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Mobile Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter mobile number..."
                placeholderTextColor={colors.textSecondary}
                value={mobileNumberFilter}
                onChangeText={setMobileNumberFilter}
              />
            </View>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Car Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter car number..."
                placeholderTextColor={colors.textSecondary}
                value={carNumberFilter}
                onChangeText={setCarNumberFilter}
              />
            </View>
          </View>

          {/* Second Row - Car Owner & Status */}
          <View style={styles.filterRow}>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Car Owner</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="Enter car owner name..."
                placeholderTextColor={colors.textSecondary}
                value={carOwnerFilter}
                onChangeText={setCarOwnerFilter}
              />
            </View>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Booking Status</Text>
              <View style={styles.pickerContainer}>
                {BOOKING_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.pickerOption,
                      { 
                        backgroundColor: statusFilter === status ? colors.primary : colors.background,
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      { color: statusFilter === status ? '#FFFFFF' : colors.text }
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    { 
                      backgroundColor: statusFilter === 'all' ? colors.primary : colors.background,
                      borderColor: colors.border 
                    }
                  ]}
                  onPress={() => setStatusFilter('all')}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: statusFilter === 'all' ? '#FFFFFF' : colors.text }
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Third Row - Date Range & Payment Status */}
          <View style={styles.filterRow}>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>From Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={fromDateFilter}
                onChangeText={setFromDateFilter}
              />
            </View>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>To Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
                value={toDateFilter}
                onChangeText={setToDateFilter}
              />
            </View>
            <View style={styles.filterInput}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Payment Status</Text>
              <View style={styles.pickerContainer}>
                {PAYMENT_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.pickerOption,
                      { 
                        backgroundColor: paymentStatusFilter === status ? colors.primary : colors.background,
                        borderColor: colors.border 
                      }
                    ]}
                    onPress={() => setPaymentStatusFilter(paymentStatusFilter === status ? 'all' : status)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      { color: paymentStatusFilter === status ? '#FFFFFF' : colors.text }
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    { 
                      backgroundColor: paymentStatusFilter === 'all' ? colors.primary : colors.background,
                      borderColor: colors.border 
                    }
                  ]}
                  onPress={() => setPaymentStatusFilter('all')}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    { color: paymentStatusFilter === 'all' ? '#FFFFFF' : colors.text }
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Clear Filters Button */}
          <TouchableOpacity
            style={[styles.clearFiltersButton, { backgroundColor: colors.lightGray }]}
            onPress={() => {
              setMobileNumberFilter('');
              setCarNumberFilter('');
              setCarOwnerFilter('');
              setFromDateFilter('');
              setToDateFilter('');
              setStatusFilter('all');
              setPaymentStatusFilter('all');
            }}
          >
            <Text style={[styles.clearFiltersText, { color: colors.text }]}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Data Table */}
        <View style={[styles.tableCard, { backgroundColor: colors.card }]}>
          <DataTable
            data={filteredBookings}
            columns={columns}
          />
        </View>
      </ScrollView>

      {/* Booking Details Modal */}
      <Modal visible={showDetailsModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Booking Details
            </Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Text style={[styles.modalCloseButton, { color: colors.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedBooking && (
              <>
                {/* Passenger Information */}
                <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.detailCardTitle, { color: colors.text }]}>Passenger Information</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Name:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.passengerName}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Phone:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.passengerPhone}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Email:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.passengerEmail}</Text>
                  </View>
                </View>

                {/* Car & Owner Information */}
                <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.detailCardTitle, { color: colors.text }]}>Car & Owner Details</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Car Number:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.carNumber}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Car Owner:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.carOwner}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Owner Phone:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.carOwnerPhone}</Text>
                  </View>
                </View>

                {/* Booking Information */}
                <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.detailCardTitle, { color: colors.text }]}>Booking Information</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Route:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedBooking.from} → {selectedBooking.to}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Pickup:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.pickupLocation}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Drop:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.dropLocation}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Ride Date & Time:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedBooking.rideDate} at {selectedBooking.rideTime}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Booking Date:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.bookingDate}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Seats Booked:</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.seatsBooked}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Total Amount:</Text>
                    <Text style={[styles.detailValue, { color: colors.text, fontWeight: '600' }]}>
                      {CURRENCY_SYMBOL}{selectedBooking.totalAmount}
                    </Text>
                  </View>
                </View>

                {/* Status Information */}
                <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.detailCardTitle, { color: colors.text }]}>Status Information</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Booking Status:</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedBooking.status) }]}>
                      {selectedBooking.status}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Payment Status:</Text>
                    <Text style={[styles.detailValue, { color: getPaymentStatusColor(selectedBooking.paymentStatus) }]}>
                      {selectedBooking.paymentStatus}
                    </Text>
                  </View>
                </View>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.detailCardTitle, { color: colors.text }]}>Special Requests</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.specialRequests}</Text>
                  </View>
                )}

                {/* Feedback */}
                {selectedBooking.feedback && (
                  <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.detailCardTitle, { color: colors.text }]}>Passenger Feedback</Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Rating:</Text>
                      <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Text
                            key={star}
                            style={[
                              styles.star,
                              { color: star <= selectedBooking.feedback!.rating ? '#fbbf24' : colors.lightGray }
                            ]}
                          >
                            ⭐
                          </Text>
                        ))}
                        <Text style={[styles.ratingNumber, { color: colors.text }]}>
                          {selectedBooking.feedback.rating}/5
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Comment:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        "{selectedBooking.feedback.comment}"
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Feedback Date:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>{selectedBooking.feedback.date}</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Booking Modal */}
      <Modal visible={showModal && isEditing} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Booking
            </Text>
            <TouchableOpacity onPress={handleCancelEdit}>
              <Text style={[styles.modalCloseButton, { color: colors.primary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Passenger Information */}
            <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.detailCardTitle, { color: colors.text }]}>Passenger Information</Text>
              
              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Name:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.passengerName || ''}
                  onChangeText={(text) => setFormData({...formData, passengerName: text})}
                  placeholder="Enter passenger name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Phone:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.passengerPhone || ''}
                  onChangeText={(text) => setFormData({...formData, passengerPhone: text})}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Email:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.passengerEmail || ''}
                  onChangeText={(text) => setFormData({...formData, passengerEmail: text})}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            {/* Booking Information */}
            <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.detailCardTitle, { color: colors.text }]}>Booking Information</Text>
              
              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Route:</Text>
                <View style={styles.routeInputContainer}>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text, flex: 1, marginRight: Spacing.sm }]}
                    value={formData.from || ''}
                    onChangeText={(text) => setFormData({...formData, from: text})}
                    placeholder="From"
                    placeholderTextColor={colors.textSecondary}
                  />
                  <Text style={[styles.routeArrow, { color: colors.text }]}>→</Text>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text, flex: 1, marginLeft: Spacing.sm }]}
                    value={formData.to || ''}
                    onChangeText={(text) => setFormData({...formData, to: text})}
                    placeholder="To"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Pickup Location:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.pickupLocation || ''}
                  onChangeText={(text) => setFormData({...formData, pickupLocation: text})}
                  placeholder="Enter pickup location"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Drop Location:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.dropLocation || ''}
                  onChangeText={(text) => setFormData({...formData, dropLocation: text})}
                  placeholder="Enter drop location"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Ride Date:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.rideDate || ''}
                  onChangeText={(text) => setFormData({...formData, rideDate: text})}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Ride Time:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.rideTime || ''}
                  onChangeText={(text) => setFormData({...formData, rideTime: text})}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Seats Booked:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.seatsBooked?.toString() || ''}
                  onChangeText={(text) => setFormData({...formData, seatsBooked: parseInt(text) || 0})}
                  placeholder="Enter number of seats"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Total Amount:</Text>
                <TextInput
                  style={[styles.editInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                  value={formData.totalAmount?.toString() || ''}
                  onChangeText={(text) => setFormData({...formData, totalAmount: parseFloat(text) || 0})}
                  placeholder="Enter total amount"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Status Information */}
            <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.detailCardTitle, { color: colors.text }]}>Status Information</Text>
              
              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Booking Status:</Text>
                <View style={styles.pickerContainer}>
                  {BOOKING_STATUSES.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.pickerOption,
                        { 
                          backgroundColor: formData.status === status ? colors.primary : colors.background,
                          borderColor: colors.border 
                        }
                      ]}
                      onPress={() => setFormData({...formData, status})}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        { color: formData.status === status ? '#FFFFFF' : colors.text }
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.editRow}>
                <Text style={[styles.editLabel, { color: colors.textSecondary }]}>Payment Status:</Text>
                <View style={styles.pickerContainer}>
                  {PAYMENT_STATUSES.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.pickerOption,
                        { 
                          backgroundColor: formData.paymentStatus === status ? colors.primary : colors.background,
                          borderColor: colors.border 
                        }
                      ]}
                      onPress={() => setFormData({...formData, paymentStatus: status})}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        { color: formData.paymentStatus === status ? '#FFFFFF' : colors.text }
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Special Requests */}
            <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.detailCardTitle, { color: colors.text }]}>Special Requests</Text>
              <TextInput
                style={[styles.editTextArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                value={formData.specialRequests || ''}
                onChangeText={(text) => setFormData({...formData, specialRequests: text})}
                placeholder="Enter special requests (optional)"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.lightGray, borderColor: colors.border }]}
                onPress={handleCancelEdit}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: '#6B7280',
  },
  exportButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.small,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
  },
  filtersCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  filtersTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  filterInput: {
    flex: 1,
  },
  filterLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  pickerOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  pickerOptionText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  clearFiltersButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  clearFiltersText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  tableCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  passengerName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  passengerPhone: {
    fontSize: FontSizes.sm,
  },
  carNumber: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  carOwner: {
    fontSize: FontSizes.sm,
  },
  routeText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  dateText: {
    fontSize: FontSizes.sm,
  },
  seatsText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  amountText: {
    fontSize: FontSizes.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionsCell: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  actionButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  modalCloseButton: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    padding: Spacing.sm,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  detailCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  detailCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
    color: '#1e293b',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: FontSizes.sm,
    flex: 2,
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  star: {
    fontSize: FontSizes.sm,
  },
  ratingNumber: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  // Edit form styles
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  editLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    width: 120,
    marginRight: Spacing.md,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
  },
  editTextArea: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  routeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeArrow: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginHorizontal: Spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});