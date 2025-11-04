const { executeQuery } = require('../config/database');

class Offer {
  constructor(data) {
    this.id = data.id;
    this.code = data.code;
    this.title = data.title;
    this.description = data.description;
    this.discountType = data.discount_type;
    this.discountValue = data.discount_value;
    this.minAmount = data.min_amount;
    this.maxDiscount = data.max_discount;
    this.maxUses = data.max_uses;
    this.usedCount = data.used_count;
    this.validFrom = data.valid_from;
    this.validUntil = data.valid_until;
    this.isActive = data.is_active;
    this.applicableTo = data.applicable_to;
    this.createdBy = data.created_by;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new offer
  static async create(offerData) {
    const query = `
      INSERT INTO offers (
        id, code, title, description, discount_type, discount_value,
        min_amount, max_discount, max_uses, valid_from, valid_until,
        is_active, applicable_to, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      offerData.id,
      offerData.code,
      offerData.title,
      offerData.description || null,
      offerData.discountType || 'percentage',
      offerData.discountValue,
      offerData.minAmount || 0,
      offerData.maxDiscount || null,
      offerData.maxUses || null,
      offerData.validFrom,
      offerData.validUntil,
      offerData.isActive !== undefined ? offerData.isActive : true,
      offerData.applicableTo || 'all',
      offerData.createdBy || null,
    ];

    await executeQuery(query, params);
    return await Offer.findById(offerData.id);
  }

  // Find offer by ID
  static async findById(id) {
    const query = 'SELECT * FROM offers WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Offer(rows[0]) : null;
  }

  // Find offer by code
  static async findByCode(code) {
    const query = 'SELECT * FROM offers WHERE code = ?';
    const rows = await executeQuery(query, [code]);
    return rows.length > 0 ? new Offer(rows[0]) : null;
  }

  // Get all offers with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    let query = 'SELECT * FROM offers WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }
    if (filters.applicableTo) {
      query += ' AND applicable_to = ?';
      params.push(filters.applicableTo);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await executeQuery(query, params);
    return rows.map(row => new Offer(row));
  }

  // Get active offers
  static async findActive() {
    const now = new Date();
    const query = `
      SELECT * FROM offers 
      WHERE is_active = true 
      AND valid_from <= ? 
      AND valid_until >= ?
      AND (max_uses IS NULL OR used_count < max_uses)
      ORDER BY created_at DESC
    `;
    const rows = await executeQuery(query, [now, now]);
    return rows.map(row => new Offer(row));
  }

  // Update offer
  async update(updateData) {
    const allowedFields = [
      'title', 'description', 'discount_type', 'discount_value',
      'min_amount', 'max_discount', 'max_uses', 'valid_from', 'valid_until',
      'is_active', 'applicable_to'
    ];
    
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbKey) && value !== undefined && value !== null) {
        updates.push(`${dbKey} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(this.id);
    const query = `UPDATE offers SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    await executeQuery(query, params);
    return await Offer.findById(this.id);
  }

  // Delete offer
  async delete() {
    const query = 'DELETE FROM offers WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Increment usage count
  async incrementUsage() {
    const query = 'UPDATE offers SET used_count = used_count + 1 WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get usage statistics
  async getUsageStats() {
    const query = `
      SELECT 
        COUNT(*) as total_uses,
        SUM(discount_amount) as total_discount,
        SUM(final_amount) as total_revenue
      FROM offer_usage 
      WHERE offer_id = ?
    `;
    const rows = await executeQuery(query, [this.id]);
    return rows[0] || { total_uses: 0, total_discount: 0, total_revenue: 0 };
  }

  // Check if offer is valid for use
  isValid() {
    const now = new Date();
    const validFrom = new Date(this.validFrom);
    const validUntil = new Date(this.validUntil);
    
    return this.isActive && 
           now >= validFrom && 
           now <= validUntil && 
           (!this.maxUses || this.usedCount < this.maxUses);
  }

  // Calculate discount amount
  calculateDiscount(amount) {
    let discount = 0;

    if (this.discountType === 'percentage') {
      discount = (amount * this.discountValue) / 100;
      if (this.maxDiscount) {
        discount = Math.min(discount, this.maxDiscount);
      }
    } else {
      discount = this.discountValue;
    }

    return Math.max(0, discount);
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      code: this.code,
      title: this.title,
      description: this.description,
      discountType: this.discountType,
      discountValue: this.discountValue,
      minAmount: this.minAmount,
      maxDiscount: this.maxDiscount,
      maxUses: this.maxUses,
      usedCount: this.usedCount,
      validFrom: this.validFrom,
      validUntil: this.validUntil,
      isActive: this.isActive,
      applicableTo: this.applicableTo,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isValid: this.isValid(),
    };
  }
}

module.exports = Offer;
