// Frontend Integration Example
// This shows how to use the API service in your React Native components

import { apiService } from './services/apiService';

// Example: Admin Login
export const loginAdmin = async (email, password) => {
  try {
    const response = await apiService.adminLogin(email, password);
    
    if (response.success && response.data.token) {
      // Save token to storage
      await apiService.saveToken(response.data.token);
      
      // Return admin data
      return {
        success: true,
        admin: response.data.admin,
        token: response.data.token
      };
    } else {
      return {
        success: false,
        message: response.message || 'Login failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Get Dashboard Statistics
export const getDashboardStats = async () => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.getDashboardStats(token);
    
    if (response.success) {
      return {
        success: true,
        stats: response.data.stats
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to get dashboard stats'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Create New Ride
export const createRide = async (rideData) => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.createRide(rideData, token);
    
    if (response.success) {
      return {
        success: true,
        ride: response.data.ride
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to create ride'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Get All Users
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.getUsers(token);
    
    if (response.success) {
      return {
        success: true,
        users: response.data.users,
        pagination: response.data.pagination
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to get users'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Search Rides
export const searchRides = async (fromCity, toCity, date, passengers = 1) => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.searchRides(fromCity, toCity, date, passengers, token);
    
    if (response.success) {
      return {
        success: true,
        rides: response.data.rides
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to search rides'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Create Booking
export const createBooking = async (bookingData) => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.createBooking(bookingData, token);
    
    if (response.success) {
      return {
        success: true,
        booking: response.data.booking
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to create booking'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Database Operations
export const seedDatabase = async () => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.seedDatabase(token);
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Failed to seed database'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Example: Logout
export const logout = async () => {
  try {
    await apiService.removeToken();
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to logout'
    };
  }
};

// Example: React Native Component Usage
/*
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { getDashboardStats, getUsers, loginAdmin } from './api-helpers';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        getDashboardStats(),
        getUsers()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      if (usersResponse.success) {
        setUsers(usersResponse.users);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const result = await loginAdmin('admin@hushryd.com', 'admin123');
    
    if (result.success) {
      console.log('Login successful:', result.admin);
      loadDashboardData();
    } else {
      console.error('Login failed:', result.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLogin}>
        <Text>Login as Admin</Text>
      </TouchableOpacity>
      
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          {stats && (
            <View>
              <Text>Total Users: {stats.overview.totalUsers}</Text>
              <Text>Total Rides: {stats.overview.totalRides}</Text>
              <Text>Total Bookings: {stats.overview.totalBookings}</Text>
            </View>
          )}
          
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <Text>{item.firstName} {item.lastName}</Text>
                <Text>{item.email}</Text>
                <Text>{item.role}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};
*/
