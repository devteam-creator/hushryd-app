const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const { authenticateToken, authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all bookings with filters and pagination
router.get('/', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      userId: req.query.userId,
      rideId: req.query.rideId,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus
    };

    // Get bookings with related data
    const { executeQuery } = require('../config/database');
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        b.*,
        u.first_name, u.last_name, u.email as passenger_email, u.phone as passenger_phone,
        r.from_location, r.to_location, r.vehicle_id, r.pickup_date, r.pickup_time,
        v.make as vehicle_make, v.model as vehicle_model, v.registration_number as car_number,
        owner.first_name as owner_first_name, owner.last_name as owner_last_name, owner.phone as owner_phone
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN rides r ON b.ride_id = r.id
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN users owner ON v.owner_id = owner.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (filters.userId) {
      query += ' AND b.user_id = ?';
      params.push(filters.userId);
    }
    if (filters.rideId) {
      query += ' AND b.ride_id = ?';
      params.push(filters.rideId);
    }
    if (filters.status) {
      query += ' AND b.status = ?';
      params.push(filters.status);
    }
    if (filters.paymentStatus) {
      query += ' AND b.payment_status = ?';
      params.push(filters.paymentStatus);
    }
    
    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const rows = await executeQuery(query, params);
    
    // Format bookings with all details
    const formattedBookings = rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      rideId: row.ride_id,
      passengerName: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'N/A',
      passengerPhone: row.passenger_phone || 'N/A',
      passengerEmail: row.passenger_email || 'N/A',
      carNumber: row.car_number || 'N/A',
      carOwner: `${row.owner_first_name || ''} ${row.owner_last_name || ''}`.trim() || 'N/A',
      carOwnerPhone: row.owner_phone || 'N/A',
      from: typeof row.from_location === 'string' ? row.from_location : JSON.parse(row.from_location || '{}').address || 'N/A',
      to: typeof row.to_location === 'string' ? row.to_location : JSON.parse(row.to_location || '{}').address || 'N/A',
      pickupLocation: typeof row.from_location === 'string' ? row.from_location : JSON.parse(row.from_location || '{}').address || 'N/A',
      dropLocation: typeof row.to_location === 'string' ? row.to_location : JSON.parse(row.to_location || '{}').address || 'N/A',
      bookingDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '',
      rideDate: row.pickup_date ? new Date(row.pickup_date).toISOString().split('T')[0] : '',
      rideTime: row.pickup_time || '',
      seatsBooked: row.passenger_count,
      totalAmount: parseFloat(row.total_price) || 0,
      status: row.status || 'pending',
      paymentStatus: row.payment_status || 'pending',
      specialRequests: row.special_requests,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json({
      error: false,
      message: 'Bookings retrieved successfully',
      data: {
        bookings: formattedBookings,
        pagination: {
          page,
          limit,
          total: formattedBookings.length
        }
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get bookings by user ID
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own bookings unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== userId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.findByUserId(userId, page, limit);
    
    res.json({
      error: false,
      message: 'User bookings retrieved successfully',
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total: bookings.length
        }
      }
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        error: true,
        message: 'Booking not found'
      });
    }

    // Users can only view their own bookings unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== booking.userId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    res.json({
      error: false,
      message: 'Booking retrieved successfully',
      data: {
        booking: booking.toJSON()
      }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const bookingData = {
      id: uuidv4(),
      userId: req.user.id,
      rideId: req.body.rideId,
      passengerCount: req.body.passengerCount,
      totalPrice: req.body.totalPrice,
      currency: req.body.currency || 'INR',
      status: req.body.status || 'pending',
      paymentStatus: req.body.paymentStatus || 'pending',
      paymentMethod: req.body.paymentMethod,
      specialRequests: req.body.specialRequests
    };

    if (!bookingData.rideId || !bookingData.passengerCount || !bookingData.totalPrice) {
      return res.status(400).json({
        error: true,
        message: 'Ride ID, passenger count, and total price are required'
      });
    }

    const newBooking = await Booking.create(bookingData);

    res.status(201).json({
      error: false,
      message: 'Booking created successfully',
      data: {
        booking: newBooking.toJSON()
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      error: true,
      message: error.message || 'Internal server error'
    });
  }
});

// Update booking
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        error: true,
        message: 'Booking not found'
      });
    }

    // Users can only update their own bookings unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== booking.userId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    const updatedBooking = await booking.update(req.body);

    res.json({
      error: false,
      message: 'Booking updated successfully',
      data: {
        booking: updatedBooking.toJSON()
      }
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Cancel booking
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        error: true,
        message: 'Booking not found'
      });
    }

    // Users can only cancel their own bookings unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== booking.userId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        error: true,
        message: 'Booking is already cancelled'
      });
    }

    const cancelledBooking = await booking.cancel();

    res.json({
      error: false,
      message: 'Booking cancelled successfully',
      data: {
        booking: cancelledBooking.toJSON()
      }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Delete booking (Admin only)
router.delete('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        error: true,
        message: 'Booking not found'
      });
    }

    await booking.delete();

    res.json({
      error: false,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get booking statistics (Admin only)
router.get('/stats/overview', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const stats = await Booking.getStats();

    res.json({
      error: false,
      message: 'Booking statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
