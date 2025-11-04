import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminLayout from '../../components/admin/AdminLayoutBasic';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { BorderRadius, FontSizes, Spacing } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { exportToExcel } from '../../utils/excelExport';

export default function RidesPage() {
  const { admin } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRides: 0,
    pendingRides: 0,
    confirmedRides: 0,
    completedRides: 0,
    totalRevenue: 0,
    averageFare: 0
  });

  // Load rides data from API
  const loadRides = async () => {
    try {
      setLoading(true);
      
      // Check if admin is logged in
      if (!admin) {
        Alert.alert('Error', 'Please log in to view rides');
        return;
      }

      // Get token from AuthContext
      const token = await apiService.getToken();
      
      if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        return;
      }

      console.log('Loading rides with token:', token.substring(0, 20) + '...');

      // Fetch rides
      const ridesResponse = await apiService.getRides(token);
      console.log('Rides API response:', JSON.stringify(ridesResponse, null, 2));
      
      if (ridesResponse.success) {
        // Backend returns: { error: false, data: { rides: [...], pagination: {...} } }
        // apiCall wraps it as: { success: true, data: { rides: [...], pagination: {...} } }
        let rides = [];
        if (ridesResponse.data) {
          // Check if data has rides property
          if (ridesResponse.data.rides && Array.isArray(ridesResponse.data.rides)) {
            rides = ridesResponse.data.rides;
          } else if (Array.isArray(ridesResponse.data)) {
            // Data itself is an array
            rides = ridesResponse.data;
          }
        }
        console.log('Rides loaded:', rides.length, 'rides');
        console.log('Sample ride:', rides[0]);
        setRides(rides);
      } else {
        console.error('Failed to load rides:', ridesResponse.message);
        setRides([]);
      }

      // Fetch ride stats
      const statsResponse = await apiService.getRideStats(token);
      console.log('Stats API response:', statsResponse);
      
      if (statsResponse.success) {
        setStats({
          totalRides: statsResponse.data.stats.totalRides || 0,
          pendingRides: statsResponse.data.stats.pendingRides || 0,
          confirmedRides: statsResponse.data.stats.confirmedRides || 0,
          completedRides: statsResponse.data.stats.completedRides || 0,
          totalRevenue: statsResponse.data.stats.totalRevenue || 0,
          averageFare: statsResponse.data.stats.averageFare || 0
        });
      }

    } catch (error) {
      console.error('Error loading rides:', error);
      Alert.alert('Error', 'Failed to load rides data');
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadRides();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'in_progress': return '#8B5CF6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM format
  };

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatLocation = (location: any) => {
    if (!location) return 'N/A';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      if (location.address) return location.address;
      if (location.city && location.state) return `${location.city}, ${location.state}`;
      if (location.city) return location.city;
      return 'N/A';
    }
    return 'N/A';
  };

  const handleExportExcel = async () => {
    try {
      if (rides.length === 0) {
        Alert.alert('No Data', 'No rides to export');
        return;
      }

      // Prepare headers and data for Excel export
      const headers = ['ID', 'From', 'To', 'Date', 'Time', 'Vehicle Make', 'Vehicle Model', 'Total Seats', 'Booked Seats', 'Available Seats', 'Fare', 'Status', 'Timeslot', 'Distance'];
      
      const data = rides.map(ride => {
        const vehicleMake = ride.vehicle?.make || 'N/A';
        const vehicleModel = ride.vehicle?.model || 'N/A';
        const totalSeats = ride.vehicle?.capacity || 0;
        const bookedSeats = ride.passengers?.length || 0;
        const availableSeats = totalSeats - bookedSeats;
        
        return [
          ride.id || 'N/A',
          formatLocation(ride.fromLocation),
          formatLocation(ride.toLocation),
          ride.pickupDate || 'N/A',
          ride.pickupTime || 'N/A',
          vehicleMake,
          vehicleModel,
          totalSeats,
          bookedSeats,
          availableSeats,
          ride.fare || 0,
          getStatusText(ride.status),
          ride.timeslot || 'N/A',
          ride.distance ? `${ride.distance} km` : 'N/A'
        ];
      });

      // Export to Excel
      await exportToExcel({
        filename: 'rides',
        sheetName: 'Rides',
        headers,
        data
      });
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'Failed to export rides data. Please try again.');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute pageId="rides">
        <AdminLayout title="Rides Management" currentPage="rides">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading rides...</Text>
          </View>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute pageId="rides">
      <AdminLayout title="Rides Management" currentPage="rides">
      <View style={styles.container}>
        {/* Header Actions */}
          <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/admin/rides/new')}
          >
            <Text style={styles.addButtonText}>🚗 Add New Ride</Text>
              </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportExcel}
          >
            <Text style={styles.exportButtonText}>📊 Export Excel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadRides}
          >
            <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalRides}</Text>
              <Text style={styles.statLabel}>Total Rides</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.pendingRides}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
        </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.confirmedRides}</Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
          <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.completedRides}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={styles.statCard}>
              <Text style={styles.statNumber}>{formatCurrency(stats.averageFare)}</Text>
              <Text style={styles.statLabel}>Avg Fare</Text>
            </View>
          </View>
        </View>

        {/* Rides List */}
        <View style={styles.ridesSection}>
          <Text style={styles.sectionTitle}>Recent Rides</Text>
          
          {rides.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>📭 No rides found</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first ride to get started
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push('/admin/rides/new')}
              >
                <Text style={styles.emptyStateButtonText}>Create Ride</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableContainer}>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>From</Text>
                  <Text style={styles.tableHeaderText}>To</Text>
                  <Text style={styles.tableHeaderText}>Date</Text>
                  <Text style={styles.tableHeaderText}>Time</Text>
                  <Text style={styles.tableHeaderText}>Vehicle</Text>
                  <Text style={styles.tableHeaderText}>Seats</Text>
                  <Text style={styles.tableHeaderText}>Fare</Text>
                  <Text style={styles.tableHeaderText}>Status</Text>
                  <Text style={styles.tableHeaderText}>Actions</Text>
                </View>
                
                {/* Table Rows */}
                {rides.map((ride: any, index: number) => {
                  console.log('Ride data:', {
                    pickupDate: ride.pickupDate,
                    pickupTime: ride.pickupTime,
                    formattedDate: formatDate(ride.pickupDate || ''),
                    formattedTime: formatTime(ride.pickupTime || '')
                  });
                  
                  // Get vehicle info
                  const vehicleMake = ride.vehicle?.make || 'N/A';
                  const vehicleModel = ride.vehicle?.model || 'N/A';
                  const vehicleInfo = vehicleMake !== 'N/A' && vehicleModel !== 'N/A' 
                    ? `${vehicleMake} ${vehicleModel}` 
                    : 'N/A';
                  
                  // Get available seats
                  const totalSeats = ride.vehicle?.capacity || 0;
                  const bookedSeats = ride.passengers?.length || 0;
                  const availableSeats = totalSeats - bookedSeats;
                  const seatsInfo = totalSeats > 0 ? `${availableSeats}/${totalSeats}` : 'N/A';
                  
                  return (
                    <View key={ride.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                      <Text style={styles.tableCell} numberOfLines={1}>{formatLocation(ride.fromLocation)}</Text>
                      <Text style={styles.tableCell} numberOfLines={1}>{formatLocation(ride.toLocation)}</Text>
                      <Text style={styles.tableCell}>{formatDate(ride.pickupDate || '') || 'N/A'}</Text>
                      <Text style={styles.tableCell}>{formatTime(ride.pickupTime || '') || 'N/A'}</Text>
                      <Text style={styles.tableCell} numberOfLines={1}>{vehicleInfo}</Text>
                      <Text style={styles.tableCell}>{seatsInfo}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(ride.fare || 0)}</Text>
                      <View style={styles.tableCell}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) }]}>
                          <Text style={styles.statusText}>{getStatusText(ride.status)}</Text>
                        </View>
                      </View>
                      <View style={styles.tableCell}>
                        <TouchableOpacity
                          style={styles.viewButton}
                          onPress={() => router.push(`/admin/rides/${ride.id}`)}
                        >
                          <Text style={styles.viewButtonText}>👁️ View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </AdminLayout>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
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
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exportButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  refreshButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: '#374151',
  },
  statsContainer: {
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: '#6B7280',
    marginTop: Spacing.xs,
  },
  ridesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyStateText: {
    fontSize: FontSizes.xl,
    color: '#6B7280',
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: FontSizes.md,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  emptyStateButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    padding: Spacing.md,
  },
  tableHeaderText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    minWidth: 100,
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRowEven: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: FontSizes.sm,
    color: '#111827',
    flex: 1,
    minWidth: 100,
    paddingRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  viewButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});