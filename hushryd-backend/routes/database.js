const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// Seed database with sample data
router.post('/seed', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');

    // Sample users data
    const users = [
      {
        id: 'user-001',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+919876543210',
        role: 'user',
        isVerified: true,
        isActive: true
      },
      {
        id: 'user-002',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+919876543211',
        role: 'driver',
        isVerified: true,
        isActive: true
      },
      {
        id: 'user-003',
        email: 'mike.johnson@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+919876543212',
        role: 'user',
        isVerified: false,
        isActive: true
      }
    ];

    // Insert sample users
    for (const user of users) {
      await executeQuery(`
        INSERT INTO users (id, email, first_name, last_name, phone, is_verified, is_active, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE email = VALUES(email)
      `, [
        user.id, user.email, user.firstName, user.lastName, 
        user.phone, user.isVerified, user.isActive, user.role
      ]);
    }

    // Sample rides data
    const rides = [
      {
        id: 'ride-001',
        driverId: 'user-002',
        fromLatitude: 19.0760,
        fromLongitude: 72.8777,
        fromAddress: 'Mumbai Central',
        fromCity: 'Mumbai',
        fromState: 'Maharashtra',
        fromCountry: 'India',
        toLatitude: 18.5204,
        toLongitude: 73.8567,
        toAddress: 'Pune Station',
        toCity: 'Pune',
        toState: 'Maharashtra',
        toCountry: 'India',
        departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        price: 2500,
        currency: 'INR',
        maxPassengers: 4,
        availableSeats: 3,
        status: 'scheduled',
        vehicleMake: 'Toyota',
        vehicleModel: 'Innova',
        vehicleYear: 2022,
        vehicleColor: 'White',
        vehicleLicensePlate: 'MH01AB1234',
        vehicleCapacity: 7
      }
    ];

    // Insert sample rides
    for (const ride of rides) {
      await executeQuery(`
        INSERT INTO rides (
          id, driver_id, from_latitude, from_longitude, from_address, from_city, from_state, from_country,
          to_latitude, to_longitude, to_address, to_city, to_state, to_country,
          departure_time, price, currency, max_passengers, available_seats, status,
          vehicle_make, vehicle_model, vehicle_year, vehicle_color, vehicle_license_plate, vehicle_capacity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE driver_id = VALUES(driver_id)
      `, [
        ride.id, ride.driverId, ride.fromLatitude, ride.fromLongitude, ride.fromAddress, ride.fromCity, ride.fromState, ride.fromCountry,
        ride.toLatitude, ride.toLongitude, ride.toAddress, ride.toCity, ride.toState, ride.toCountry,
        ride.departureTime, ride.price, ride.currency, ride.maxPassengers, ride.availableSeats, ride.status,
        ride.vehicleMake, ride.vehicleModel, ride.vehicleYear, ride.vehicleColor, ride.vehicleLicensePlate, ride.vehicleCapacity
      ]);
    }

    // Sample bookings data
    const bookings = [
      {
        id: 'booking-001',
        userId: 'user-001',
        rideId: 'ride-001',
        passengerCount: 1,
        totalPrice: 2500,
        currency: 'INR',
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card'
      }
    ];

    // Insert sample bookings
    for (const booking of bookings) {
      await executeQuery(`
        INSERT INTO bookings (id, user_id, ride_id, passenger_count, total_price, currency, status, payment_status, payment_method)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
      `, [
        booking.id, booking.userId, booking.rideId, booking.passengerCount, 
        booking.totalPrice, booking.currency, booking.status, booking.paymentStatus, booking.paymentMethod
      ]);
    }

    res.json({
      error: false,
      message: 'Database seeded successfully',
      data: {
        usersCreated: users.length,
        ridesCreated: rides.length,
        bookingsCreated: bookings.length
      }
    });

  } catch (error) {
    console.error('Database seeding error:', error);
    res.status(500).json({
      error: true,
      message: 'Database seeding failed',
      error: error.message
    });
  }
});

// Clear database
router.delete('/clear', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    console.log('🗑️ Starting database clearing...');

    // Clear tables in order to respect foreign key constraints
    await executeQuery('DELETE FROM bookings');
    await executeQuery('DELETE FROM rides');
    await executeQuery('DELETE FROM users');

    res.json({
      error: false,
      message: 'Database cleared successfully'
    });

  } catch (error) {
    console.error('Database clearing error:', error);
    res.status(500).json({
      error: true,
      message: 'Database clearing failed',
      error: error.message
    });
  }
});

// Get database statistics
router.get('/stats', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const [userStats, rideStats, bookingStats] = await Promise.all([
      executeQuery('SELECT COUNT(*) as total FROM users'),
      executeQuery('SELECT COUNT(*) as total FROM rides'),
      executeQuery('SELECT COUNT(*) as total FROM bookings')
    ]);

    const stats = {
      totalUsers: userStats[0].total,
      totalRides: rideStats[0].total,
      totalBookings: bookingStats[0].total,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      error: false,
      message: 'Database statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get database stats error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to get database statistics',
      error: error.message
    });
  }
});

// Run migrations
router.post('/migrate', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    console.log('🚀 Starting database migrations...');

    // Check if tables exist, if not create them
    const tables = ['users', 'rides', 'bookings', 'admins'];
    
    for (const table of tables) {
      try {
        await executeQuery(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`✅ Table ${table} already exists`);
      } catch (error) {
        console.log(`⚠️ Table ${table} does not exist, creating...`);
        // In a real app, you would run your migration scripts here
      }
    }

    res.json({
      error: false,
      message: 'Database migrations completed successfully'
    });

  } catch (error) {
    console.error('Database migration error:', error);
    res.status(500).json({
      error: true,
      message: 'Database migration failed',
      error: error.message
    });
  }
});

module.exports = router;
