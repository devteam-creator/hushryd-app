const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Admin = require('../models/Admin');
const { authenticateAdmin, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all admins with pagination and filters
router.get('/', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined
    };

    const admins = await Admin.findAll(page, limit, filters);
    
    res.json({
      error: false,
      message: 'Admins retrieved successfully',
      data: {
        admins: admins.map(admin => admin.toJSON()),
        pagination: {
          page,
          limit,
          total: admins.length
        }
      }
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get admin by ID
router.get('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        error: true,
        message: 'Admin not found'
      });
    }

    res.json({
      error: false,
      message: 'Admin retrieved successfully',
      data: {
        admin: admin.toJSON()
      }
    });

  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Create new admin (Super admin only)
router.post('/', authenticateAdmin, requireRole(['superadmin']), async (req, res) => {
  try {
    const { email, firstName, lastName, role, permissions, isActive } = req.body;

    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({
        error: true,
        message: 'Email, first name, last name, and role are required'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({
        error: true,
        message: 'Admin with this email already exists'
      });
    }

    // Generate a default password (should be changed on first login)
    const bcrypt = require('bcryptjs');
    const defaultPassword = 'Password123!'; // Default password for new admins
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const adminData = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      password: hashedPassword, // Add password field
      role,
      permissions: permissions || [],
      isActive: isActive !== undefined ? isActive : true
    };

    const newAdmin = await Admin.create(adminData);

    res.status(201).json({
      error: false,
      message: 'Admin created successfully',
      data: {
        admin: newAdmin.toJSON()
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update admin
router.put('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Only super admin can update other admins, or admins can update themselves
    if (req.admin.role !== 'superadmin' && req.admin.id !== id) {
      return res.status(403).json({
        error: true,
        message: 'Access denied'
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        error: true,
        message: 'Admin not found'
      });
    }

    // Only super admin can change role and permissions
    const updateData = { ...req.body };
    if (req.admin.role !== 'superadmin') {
      delete updateData.role;
      delete updateData.permissions;
    }

    const updatedAdmin = await admin.update(updateData);

    res.json({
      error: false,
      message: 'Admin updated successfully',
      data: {
        admin: updatedAdmin.toJSON()
      }
    });

  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Delete admin (Super admin only)
router.delete('/:id', authenticateAdmin, requireRole(['superadmin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent super admin from deleting themselves
    if (req.admin.id === id) {
      return res.status(400).json({
        error: true,
        message: 'Cannot delete your own account'
      });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        error: true,
        message: 'Admin not found'
      });
    }

    await admin.delete();

    res.json({
      error: false,
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

// Get admin statistics (Super admin only)
router.get('/stats/overview', authenticateAdmin, requireRole(['superadmin']), async (req, res) => {
  try {
    const stats = await Admin.getStats();

    res.json({
      error: false,
      message: 'Admin statistics retrieved successfully',
      data: {
        stats
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
