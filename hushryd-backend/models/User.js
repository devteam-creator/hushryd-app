const { executeQuery, executeTransaction } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.phone = data.phone;
    this.isVerified = data.is_verified;
    this.isActive = data.is_active;
    this.role = data.role;
    this.profileImage = data.profile_image;
    this.emergencyContact = data.emergency_contact;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.pincode = data.pincode;
    this.bio = data.bio;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const query = `
      INSERT INTO users (id, email, first_name, last_name, phone, is_verified, is_active, role, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      userData.id,
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.isVerified || false,
      userData.isActive || true,
      userData.role || 'user',
      userData.profileImage || null
    ];

    await executeQuery(query, params);
    return await User.findById(userData.id);
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const rows = await executeQuery(query, [email]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Get all users with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }
    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.isActive);
    }
    if (filters.isVerified !== undefined) {
      query += ' AND is_verified = ?';
      params.push(filters.isVerified);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await executeQuery(query, params);
    return rows.map(row => new User(row));
  }

  // Update user
  async update(updateData) {
    // Map camelCase fields to snake_case database columns
    const fieldMapping = {
      'first_name': 'first_name',
      'last_name': 'last_name',
      'phone': 'phone',
      'email': 'email',
      'is_verified': 'is_verified',
      'is_active': 'is_active',
      'role': 'role',
      'profile_image': 'profile_image',
      'profileImage': 'profile_image',
      'avatar': 'profile_image',
      'emergency_contact': 'emergency_contact',
      'emergencyContact': 'emergency_contact',
      'address': 'address',
      'city': 'city',
      'state': 'state',
      'pincode': 'pincode',
      'bio': 'bio'
    };

    const allowedFields = ['first_name', 'last_name', 'phone', 'email', 'is_verified', 'is_active', 'role', 'profile_image', 'emergency_contact', 'address', 'city', 'state', 'pincode', 'bio'];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      // Convert camelCase to snake_case or use mapping
      let dbKey = fieldMapping[key] || key.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (allowedFields.includes(dbKey) && value !== undefined && value !== null) {
        updates.push(`${dbKey} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(this.id);
    const query = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    console.log('Update query:', query);
    console.log('Update params:', params);
    
    await executeQuery(query, params);
    return await User.findById(this.id);
  }

  // Delete user
  async delete() {
    const query = 'DELETE FROM users WHERE id = ?';
    await executeQuery(query, [this.id]);
    return true;
  }

  // Get user statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalUsers,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as totalRegularUsers,
        COUNT(CASE WHEN role = 'driver' THEN 1 END) as totalDrivers,
        COUNT(CASE WHEN is_verified = 1 THEN 1 END) as verifiedUsers,
        COUNT(CASE WHEN is_active = 1 THEN 1 END) as activeUsers,
        COUNT(CASE WHEN is_active = 0 THEN 1 END) as inactiveUsers
      FROM users
    `;
    
    const rows = await executeQuery(query);
    return rows[0];
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      isVerified: this.isVerified,
      isActive: this.isActive,
      role: this.role,
      profileImage: this.profileImage,
      emergencyContact: this.emergencyContact,
      address: this.address,
      city: this.city,
      state: this.state,
      pincode: this.pincode,
      bio: this.bio,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
