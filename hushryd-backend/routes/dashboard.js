const express = require('express');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const Admin = require('../models/Admin');
const { authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const [userStats, rideStats, bookingStats, adminStats] = await Promise.all([
      User.getStats(),
      Ride.getStats(),
      Booking.getStats(),
      Admin.getStats()
    ]);

    const dashboardStats = {
      users: userStats,
      rides: rideStats,
      bookings: bookingStats,
      admins: adminStats,
      overview: {
        totalUsers: userStats.totalUsers,
        totalRides: rideStats.totalRides,
        totalBookings: bookingStats.totalBookings,
        totalRevenue: bookingStats.totalRevenue,
        activeUsers: userStats.activeUsers,
        completedRides: rideStats.completedRides,
        pendingBookings: bookingStats.pendingBookings
      }
    };

    res.json({
      error: false,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        stats: dashboardStats
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get dashboard analytics
router.get('/analytics', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const period = req.query.period || '7d';
    
    // Mock analytics data - in a real app, you'd query your database for time-series data
    const analytics = {
      period,
      revenue: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [1200, 1900, 3000, 5000, 2000, 3000, 4500]
      },
      bookings: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [12, 19, 30, 50, 20, 30, 45]
      },
      users: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [5, 8, 12, 18, 10, 15, 22]
      },
      rides: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [8, 15, 25, 35, 18, 28, 40]
      }
    };

    res.json({
      error: false,
      message: 'Dashboard analytics retrieved successfully',
      data: {
        analytics
      }
    });

  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get recent activity
router.get('/recent-activity', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    // Mock recent activity data - in a real app, you'd query your database for recent activities
    const recentActivity = [
      {
        id: '1',
        type: 'booking',
        description: 'New booking created by John Doe',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user: 'John Doe',
        icon: '📋'
      },
      {
        id: '2',
        type: 'ride',
        description: 'Ride completed from Mumbai to Pune',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user: 'Jane Smith',
        icon: '🚗'
      },
      {
        id: '3',
        type: 'user',
        description: 'New user registered',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        user: 'Mike Johnson',
        icon: '👤'
      },
      {
        id: '4',
        type: 'payment',
        description: 'Payment received for booking #12345',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        user: 'Sarah Wilson',
        icon: '💰'
      },
      {
        id: '5',
        type: 'ride',
        description: 'Ride cancelled by driver',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        user: 'Tom Brown',
        icon: '❌'
      }
    ];

    res.json({
      error: false,
      message: 'Recent activity retrieved successfully',
      data: {
        activities: recentActivity
      }
    });

  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
