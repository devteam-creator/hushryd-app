const { executeQuery, executeTransaction } = require('../config/database');

class Booking {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.rideId = data.ride_id;
    this.passengerCount = data.passenger_count;
    this.totalPrice = data.total_price;
    this.currency = data.currency;
    this.status = data.status;
    this.paymentStatus = data.payment_status;
    this.paymentMethod = data.payment_method;
    this.specialRequests = data.special_requests;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new booking
  static async create(bookingData) {
    return await executeTransaction(async (connection) => {
      // Check if ride has enough available seats
      const rideQuery = 'SELECT available_seats, max_passengers FROM rides WHERE id = ?';
      const [rideRows] = await connection.execute(rideQuery, [bookingData.rideId]);
      
      if (rideRows.length === 0) {
        throw new Error('Ride not found');
      }

      const ride = rideRows[0];
      if (ride.available_seats < bookingData.passengerCount) {
        throw new Error('Not enough available seats');
      }

      // Create booking
      const bookingQuery = `
        INSERT INTO bookings (id, user_id, ride_id, passenger_count, total_price, currency, status, payment_status, payment_method, special_requests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const bookingParams = [
        bookingData.id,
        bookingData.userId,
        bookingData.rideId,
        bookingData.passengerCount,
        bookingData.totalPrice,
        bookingData.currency || 'INR',
        bookingData.status || 'pending',
        bookingData.paymentStatus || 'pending',
        bookingData.paymentMethod || null,
        bookingData.specialRequests || null
      ];

      await connection.execute(bookingQuery, bookingParams);

      // Update ride available seats
      const updateRideQuery = 'UPDATE rides SET available_seats = available_seats - ? WHERE id = ?';
      await connection.execute(updateRideQuery, [bookingData.passengerCount, bookingData.rideId]);

      return await Booking.findById(bookingData.id);
    });
  }

  // Find booking by ID
  static async findById(id) {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const rows = await executeQuery(query, [id]);
    return rows.length > 0 ? new Booking(rows[0]) : null;
  }

  // Get all bookings with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    // Apply filters
    if (filters.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }
    if (filters.rideId) {
      query += ' AND ride_id = ?';
      params.push(filters.rideId);
    }
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.paymentStatus) {
      query += ' AND payment_status = ?';
      params.push(filters.paymentStatus);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await executeQuery(query, params);
    return rows.map(row => new Booking(row));
  }

  // Get bookings by user ID
  static async findByUserId(userId, page = 1, limit = 100) {
    const query = 'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC';
    const rows = await executeQuery(query, [userId]);
    return rows.map(row => new Booking(row));
  }

  // Update booking
  async update(updateData) {
    const allowedFields = ['passenger_count', 'total_price', 'currency', 'status', 'payment_status', 'payment_method', 'special_requests'];
    const updates = [];
    const params = [];

    for (const [key, value] of Object.entries(updateData)) {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (allowedFields.includes(dbKey)) {
        updates.push(`${dbKey} = ?`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(this.id);
    const query = `UPDATE bookings SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    await executeQuery(query, params);
    return await Booking.findById(this.id);
  }

  // Cancel booking
  async cancel() {
    return await executeTransaction(async (connection) => {
      // Update booking status
      const bookingQuery = 'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      await connection.execute(bookingQuery, ['cancelled', this.id]);

      // Restore ride available seats
      const rideQuery = 'UPDATE rides SET available_seats = available_seats + ? WHERE id = ?';
      await connection.execute(rideQuery, [this.passengerCount, this.rideId]);

      return await Booking.findById(this.id);
    });
  }

  // Delete booking
  async delete() {
    return await executeTransaction(async (connection) => {
      // Restore ride available seats before deleting
      const rideQuery = 'UPDATE rides SET available_seats = available_seats + ? WHERE id = ?';
      await connection.execute(rideQuery, [this.passengerCount, this.rideId]);

      // Delete booking
      const bookingQuery = 'DELETE FROM bookings WHERE id = ?';
      await connection.execute(bookingQuery, [this.id]);

      return true;
    });
  }

  // Get booking statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as totalBookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingBookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmedBookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelledBookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completedBookings,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paidBookings,
        SUM(total_price) as totalRevenue,
        AVG(total_price) as averageBookingValue
      FROM bookings
    `;
    
    const rows = await executeQuery(query);
    return rows[0];
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      rideId: this.rideId,
      passengerCount: this.passengerCount,
      totalPrice: this.totalPrice,
      currency: this.currency,
      status: this.status,
      paymentStatus: this.paymentStatus,
      paymentMethod: this.paymentMethod,
      specialRequests: this.specialRequests,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Booking;
