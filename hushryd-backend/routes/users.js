const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { authenticateToken, authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    res.json({
      error: false,
      message: 'User profile retrieved successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Update current user profile
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phone, emergencyContact, address, city, state, pincode, bio, avatar } = req.body;

    console.log('Update user request body:', req.body);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Prepare update data - map camelCase to snake_case for database
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    if (emergencyContact) updates.emergencyContact = emergencyContact;
    if (address) updates.address = address;
    if (city) updates.city = city;
    if (state) updates.state = state;
    if (pincode) updates.pincode = pincode;
    if (bio) updates.bio = bio;
    if (avatar) updates.profileImage = avatar;

    console.log('Prepared updates:', updates);
    
    // Call instance method to update
    const updatedUser = await user.update(updates);
    
    console.log('User updated successfully:', updatedUser.toJSON());

    res.json({
      success: true,
      error: false,
      message: 'Profile updated successfully!',
      data: {
        user: updatedUser.toJSON()
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: true,
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
});

// Get current user's bookings
router.get('/me/bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findByUserId(userId);

    res.json({
      error: false,
      message: 'User bookings retrieved successfully',
      data: {
        bookings: bookings.map(booking => booking.toJSON())
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

// Get current user's complaints
router.get('/me/complaints', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Query complaints table directly
    const db = require('../config/database');
    const { pool } = db;
    
    const [rows] = await pool.execute(
      'SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({
      error: false,
      message: 'User complaints retrieved successfully',
      data: {
        complaints: rows || []
      }
    });

  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get all users (Admin only)
router.get('/', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      isVerified: req.query.isVerified !== undefined ? req.query.isVerified === 'true' : undefined
    };

    const users = await User.findAll(page, limit, filters);
    
    res.json({
      error: false,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          page,
          limit,
          total: users.length
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== id) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    res.json({
      error: false,
      message: 'User retrieved successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Create new user (Admin only)
router.post('/', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { email, firstName, lastName, phone, role, isVerified, isActive } = req.body;

    if (!email || !firstName || !lastName || !phone) {
      return res.status(400).json({
        error: true,
        message: 'Email, first name, last name, and phone are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'User with this email already exists'
      });
    }

    const userData = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      phone,
      role: role || 'user',
      isVerified: isVerified || false,
      isActive: isActive !== undefined ? isActive : true
    };

    const newUser = await User.create(userData);

    res.status(201).json({
      error: false,
      message: 'User created successfully',
      data: {
        user: newUser.toJSON()
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.id !== id) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Only admins can change role and active status
    const updateData = { ...req.body };
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      delete updateData.role;
      delete updateData.isActive;
    }

    const updatedUser = await user.update(updateData);

    res.json({
      error: false,
      message: 'User updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    await user.delete();

    res.json({
      error: false,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats/overview', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const stats = await User.getStats();

    res.json({
      error: false,
      message: 'User statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
