const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Ride = require('../models/Ride');
const { authenticateToken, authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all rides (Admin only)
router.get('/', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      status: req.query.status,
      userId: req.query.userId,
      driverId: req.query.driverId,
      pickupDate: req.query.pickupDate
    };

    const rides = await Ride.findAll(page, limit, filters);
    
    // Convert Ride instances to JSON
    const ridesData = rides.map(ride => ride.toJSON());
    
    res.json({
      error: false,
      message: 'Rides retrieved successfully',
      data: {
        rides: ridesData,
        pagination: {
          page,
          limit,
          total: ridesData.length
        }
      }
    });

  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get ride by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({
        error: true,
        message: 'Ride not found'
      });
    }

    // Users can only view their own rides unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== ride.userId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    res.json({
      error: false,
      message: 'Ride retrieved successfully',
      data: {
        ride: ride.toJSON()
      }
    });

  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Create new ride
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      fromLocation, 
      toLocation, 
      pickupDate, 
      pickupTime, 
      timeslot, 
      fare, 
      distance, 
      duration, 
      notes 
    } = req.body;

    if (!fromLocation || !toLocation || !pickupDate || !pickupTime || !timeslot || !fare) {
      return res.status(400).json({
        error: true,
        message: 'From location, to location, pickup date, pickup time, timeslot, and fare are required'
      });
    }

    console.log('Ride creation request body:', req.body);
    console.log('Ride creation fromLocation:', fromLocation);
    console.log('Ride creation toLocation:', toLocation);

    // Prepare location data - can be string or object
    const fromLocationData = typeof fromLocation === 'string' 
      ? fromLocation 
      : JSON.stringify(fromLocation);
    const toLocationData = typeof toLocation === 'string'
      ? toLocation
      : JSON.stringify(toLocation);

    const rideData = {
      id: uuidv4(),
      userId: req.user.id,
      fromLocation: fromLocationData,
      toLocation: toLocationData,
      pickupDate,
      pickupTime,
      timeslot,
      fare: parseFloat(fare),
      distance: distance ? parseFloat(distance) : null,
      duration: duration ? parseInt(duration) : null,
      notes: notes || null,
      status: 'pending',
      paymentStatus: 'pending'
    };

    console.log('Ride data to be created:', rideData);

    const newRide = await Ride.create(rideData);

    res.status(201).json({
      error: false,
      message: 'Ride created successfully',
      data: {
        ride: newRide.toJSON()
      }
    });

  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Update ride
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({
        error: true,
        message: 'Ride not found'
      });
    }

    // Users can only update their own rides unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== ride.userId) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = ['fromLocation', 'toLocation', 'pickupDate', 'pickupTime', 'timeslot', 'fare', 'notes'];
    const updateData = {};
    
    for (const [key, value] of Object.entries(req.body)) {
      if (allowedUpdates.includes(key)) {
        updateData[key] = value;
      }
    }

    // Admins can also update status and payment status
    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;
      if (req.body.driverId) updateData.driverId = req.body.driverId;
    }

    const updatedRide = await ride.update(updateData);

    res.json({
      error: false,
      message: 'Ride updated successfully',
      data: {
        ride: updatedRide.toJSON()
      }
    });

  } catch (error) {
    console.error('Update ride error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Delete ride (Admin only)
router.delete('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({
        error: true,
        message: 'Ride not found'
      });
    }

    await ride.delete();

    res.json({
      error: false,
      message: 'Ride deleted successfully'
    });

  } catch (error) {
    console.error('Delete ride error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get ride statistics (Admin only)
router.get('/stats/overview', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const stats = await Ride.getStats();

    res.json({
      error: false,
      message: 'Ride statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get ride stats error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;