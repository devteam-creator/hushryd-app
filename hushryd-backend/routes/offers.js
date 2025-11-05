const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Offer = require('../models/Offer');
const { authenticateAdmin, requireRole } = require('../middleware/auth');
const { pool } = require('../config/database');

const router = express.Router();

// Get all offers (Admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
    };

    const offers = await Offer.findAll(page, limit, filters);

    res.json({
      error: false,
      message: 'Offers retrieved successfully',
      data: {
        offers: offers.map(offer => offer.toJSON()),
      },
    });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Get active offers (Public)
router.get('/active', async (req, res) => {
  try {
    const offers = await Offer.findActive();

    res.json({
      error: false,
      message: 'Active offers retrieved successfully',
      data: {
        offers: offers.map(offer => offer.toJSON()),
      },
    });
  } catch (error) {
    console.error('Get active offers error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Get offer by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        error: true,
        message: 'Offer not found',
      });
    }

    // Get usage statistics
    const stats = await offer.getUsageStats();

    res.json({
      error: false,
      message: 'Offer retrieved successfully',
      data: {
        offer: offer.toJSON(),
        stats,
      },
    });
  } catch (error) {
    console.error('Get offer error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Create new offer (Admin only)
router.post('/', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const {
      code, title, description, discountType, discountValue,
      minAmount, maxDiscount, maxUses, validFrom, validUntil,
      isActive, applicableTo, createdBy,
    } = req.body;

    // Validation
    if (!code || !title || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({
        error: true,
        message: 'Code, title, discount value, valid from, and valid until are required',
      });
    }

    // Check if code already exists
    const existingOffer = await Offer.findByCode(code);
    if (existingOffer) {
      return res.status(409).json({
        error: true,
        message: 'Offer code already exists',
      });
    }

    const offerData = {
      id: uuidv4(),
      code: code.toUpperCase(),
      title,
      description: description || null,
      discountType: discountType || 'percentage',
      discountValue,
      minAmount: minAmount || 0,
      maxDiscount: maxDiscount || null,
      maxUses: maxUses || null,
      validFrom,
      validUntil,
      isActive: isActive !== undefined ? isActive : true,
      applicableTo: applicableTo || 'all',
      createdBy: createdBy || req.admin.id,
    };

    const newOffer = await Offer.create(offerData);

    res.status(201).json({
      error: false,
      message: 'Offer created successfully',
      data: {
        offer: newOffer.toJSON(),
      },
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Update offer (Admin only)
router.put('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        error: true,
        message: 'Offer not found',
      });
    }

    // Update the offer
    const updatedOffer = await offer.update(req.body);

    res.json({
      error: false,
      message: 'Offer updated successfully',
      data: {
        offer: updatedOffer.toJSON(),
      },
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Delete offer (Admin only)
router.delete('/:id', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        error: true,
        message: 'Offer not found',
      });
    }

    await offer.delete();

    res.json({
      error: false,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Get offer usage statistics
router.get('/:id/usage', authenticateAdmin, requireRole(['superadmin', 'admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({
        error: true,
        message: 'Offer not found',
      });
    }

    const query = `
      SELECT 
        ou.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        b.booking_date,
        b.status as booking_status
      FROM offer_usage ou
      LEFT JOIN users u ON ou.user_id = u.id
      LEFT JOIN bookings b ON ou.booking_id = b.id
      WHERE ou.offer_id = ?
      ORDER BY ou.used_at DESC
    `;

    const [rows] = await pool.execute(query, [id]);

    res.json({
      error: false,
      message: 'Offer usage retrieved successfully',
      data: {
        usage: rows,
      },
    });
  } catch (error) {
    console.error('Get offer usage error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

// Verify offer code (Public)
router.post('/verify', async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({
        error: true,
        message: 'Offer code is required',
      });
    }

    const offer = await Offer.findByCode(code.toUpperCase());

    if (!offer) {
      return res.status(404).json({
        error: true,
        message: 'Invalid offer code',
      });
    }

    if (!offer.isValid()) {
      return res.status(400).json({
        error: true,
        message: 'Offer code is not valid or has expired',
      });
    }

    if (amount && amount < offer.minAmount) {
      return res.status(400).json({
        error: true,
        message: `Minimum amount of ₹${offer.minAmount} required`,
      });
    }

    const discount = amount ? offer.calculateDiscount(amount) : null;
    const finalAmount = amount ? Math.max(0, amount - discount) : null;

    res.json({
      error: false,
      message: 'Offer code is valid',
      data: {
        offer: offer.toJSON(),
        discount,
        finalAmount,
      },
    });
  } catch (error) {
    console.error('Verify offer error:', error);
    res.status(500).json({
      error: true,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
