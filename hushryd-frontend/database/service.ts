import { DatabaseConnection, dbManager } from './connection';
import { Booking, EmergencyContact, Ride, SOSAlert, User } from './models';
import { del, insert, select, update } from './queryBuilder';

export class DatabaseService {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  // User operations
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = this.generateId();
    const now = new Date();
    
    await insert()
      .into('users')
      .columns(['id', 'email', 'first_name', 'last_name', 'phone', 'is_verified', 'is_active', 'role', 'profile_image', 'created_at', 'updated_at'])
      .values([id, user.email, user.firstName, user.lastName, user.phone, user.isVerified, user.isActive, user.role, user.profileImage, now, now])
      .execute(this.connection);

    return { ...user, id, createdAt: now, updatedAt: now };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await select()
      .from('users')
      .where('id = ?', id)
      .execute(this.connection);

    if (result.rows.length === 0) return null;
    
    return this.mapUserFromRow(result.rows[0]);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await select()
      .from('users')
      .where('email = ?', email)
      .execute(this.connection);

    if (result.rows.length === 0) return null;
    
    return this.mapUserFromRow(result.rows[0]);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) return null;

    const updateData: any = { ...updates, updatedAt: new Date() };
    const columns = Object.keys(updateData).filter(key => key !== 'id' && key !== 'createdAt');
    
    if (columns.length === 0) return existingUser;

    const setClause = columns.map(col => `${this.camelToSnake(col)} = ?`).join(', ');
    const values = columns.map(col => updateData[col]);
    
    await this.connection.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return { ...existingUser, ...updateData };
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await del()
      .from('users')
      .where('id = ?', id)
      .execute(this.connection);

    return result.rowCount > 0;
  }

  // Ride operations
  async createRide(ride: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ride> {
    const id = this.generateId();
    const now = new Date();
    
    await insert()
      .into('rides')
      .columns([
        'id', 'driver_id', 'from_latitude', 'from_longitude', 'from_address', 'from_city', 'from_state', 'from_country', 'from_postal_code',
        'to_latitude', 'to_longitude', 'to_address', 'to_city', 'to_state', 'to_country', 'to_postal_code',
        'departure_time', 'arrival_time', 'price', 'currency', 'max_passengers', 'available_seats', 'status',
        'vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_color', 'vehicle_license_plate', 'vehicle_capacity', 'vehicle_features',
        'route_id', 'created_at', 'updated_at'
      ])
      .values([
        id, ride.driverId, ride.fromLocation.latitude, ride.fromLocation.longitude, ride.fromLocation.address,
        ride.fromLocation.city, ride.fromLocation.state, ride.fromLocation.country, ride.fromLocation.postalCode,
        ride.toLocation.latitude, ride.toLocation.longitude, ride.toLocation.address, ride.toLocation.city,
        ride.toLocation.state, ride.toLocation.country, ride.toLocation.postalCode,
        ride.departureTime, ride.arrivalTime, ride.price, ride.currency, ride.maxPassengers, ride.availableSeats, ride.status,
        ride.vehicleInfo.make, ride.vehicleInfo.model, ride.vehicleInfo.year, ride.vehicleInfo.color,
        ride.vehicleInfo.licensePlate, ride.vehicleInfo.capacity, JSON.stringify(ride.vehicleInfo.features),
        ride.route?.id, now, now
      ])
      .execute(this.connection);

    return { ...ride, id, createdAt: now, updatedAt: now };
  }

  async getRidesByDriver(driverId: string, limit: number = 10, offset: number = 0): Promise<Ride[]> {
    const result = await select()
      .from('rides')
      .where('driver_id = ?', driverId)
      .orderBy('departure_time', 'DESC')
      .limit(limit)
      .offset(offset)
      .execute(this.connection);

    return result.rows.map(row => this.mapRideFromRow(row));
  }

  async getRidesByLocation(fromLat: number, fromLng: number, toLat: number, toLng: number, radius: number = 10): Promise<Ride[]> {
    // This is a simplified version - in production, you'd use proper spatial queries
    const result = await select()
      .from('rides')
      .where('status = ?', 'scheduled')
      .where('available_seats > 0')
      .execute(this.connection);

    // Filter by distance (simplified)
    return result.rows
      .map(row => this.mapRideFromRow(row))
      .filter(ride => {
        const fromDistance = this.calculateDistance(fromLat, fromLng, ride.fromLocation.latitude, ride.fromLocation.longitude);
        const toDistance = this.calculateDistance(toLat, toLng, ride.toLocation.latitude, ride.toLocation.longitude);
        return fromDistance <= radius && toDistance <= radius;
      });
  }

  // Booking operations
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const id = this.generateId();
    const now = new Date();
    
    await this.connection.transaction(async (trx) => {
      // Create booking
      await insert()
        .into('bookings')
        .columns(['id', 'user_id', 'ride_id', 'passenger_count', 'total_price', 'currency', 'status', 'payment_status', 'payment_method', 'special_requests', 'created_at', 'updated_at'])
        .values([id, booking.userId, booking.rideId, booking.passengerCount, booking.totalPrice, booking.currency, booking.status, booking.paymentStatus, booking.paymentMethod, booking.specialRequests, now, now])
        .execute(trx);

      // Update available seats
      await trx.query(
        'UPDATE rides SET available_seats = available_seats - ?, updated_at = ? WHERE id = ?',
        [booking.passengerCount, now, booking.rideId]
      );
    });

    return { ...booking, id, createdAt: now, updatedAt: now };
  }

  async getBookingsByUser(userId: string, limit: number = 10, offset: number = 0): Promise<Booking[]> {
    const result = await select()
      .from('bookings')
      .where('user_id = ?', userId)
      .orderBy('created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .execute(this.connection);

    return result.rows.map(row => this.mapBookingFromRow(row));
  }

  // SOS Alert operations
  async createSOSAlert(alert: Omit<SOSAlert, 'id' | 'createdAt' | 'updatedAt'>): Promise<SOSAlert> {
    const id = this.generateId();
    const now = new Date();
    
    await insert()
      .into('sos_alerts')
      .columns([
        'id', 'user_id', 'ride_id', 'latitude', 'longitude', 'address', 'city', 'state', 'country', 'postal_code',
        'type', 'message', 'status', 'priority', 'resolved_by', 'resolved_at', 'admin_notes', 'created_at', 'updated_at'
      ])
      .values([
        id, alert.userId, alert.rideId, alert.location.latitude, alert.location.longitude, alert.location.address,
        alert.location.city, alert.location.state, alert.location.country, alert.location.postalCode,
        alert.type, alert.message, alert.status, alert.priority, alert.resolvedBy, alert.resolvedAt, alert.adminNotes, now, now
      ])
      .execute(this.connection);

    return { ...alert, id, createdAt: now, updatedAt: now };
  }

  async getActiveSOSAlerts(): Promise<SOSAlert[]> {
    const result = await select()
      .from('sos_alerts')
      .where('status = ?', 'active')
      .orderBy('created_at', 'DESC')
      .execute(this.connection);

    return result.rows.map(row => this.mapSOSAlertFromRow(row));
  }

  async updateSOSAlertStatus(id: string, status: SOSAlert['status'], resolvedBy?: string, adminNotes?: string): Promise<SOSAlert | null> {
    const existingAlert = await this.getSOSAlertById(id);
    if (!existingAlert) return null;

    const updates: any = { 
      status, 
      updatedAt: new Date() 
    };

    if (status === 'resolved') {
      updates.resolvedBy = resolvedBy;
      updates.resolvedAt = new Date();
    }

    if (adminNotes) {
      updates.adminNotes = adminNotes;
    }

    await update()
      .table('sos_alerts')
      .set('status', updates.status)
      .set('updated_at', updates.updatedAt)
      .where('id = ?', id)
      .execute(this.connection);

    return { ...existingAlert, ...updates };
  }

  async getSOSAlertById(id: string): Promise<SOSAlert | null> {
    const result = await select()
      .from('sos_alerts')
      .where('id = ?', id)
      .execute(this.connection);

    if (result.rows.length === 0) return null;
    
    return this.mapSOSAlertFromRow(result.rows[0]);
  }

  // Emergency Contact operations
  async createEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmergencyContact> {
    const id = this.generateId();
    const now = new Date();
    
    await insert()
      .into('emergency_contacts')
      .columns(['id', 'user_id', 'name', 'phone', 'relationship', 'is_primary', 'created_at', 'updated_at'])
      .values([id, contact.userId, contact.name, contact.phone, contact.relationship, contact.isPrimary, now, now])
      .execute(this.connection);

    return { ...contact, id, createdAt: now, updatedAt: now };
  }

  async getEmergencyContactsByUser(userId: string): Promise<EmergencyContact[]> {
    const result = await select()
      .from('emergency_contacts')
      .where('user_id = ?', userId)
      .orderBy('is_primary', 'DESC')
      .execute(this.connection);

    return result.rows.map(row => this.mapEmergencyContactFromRow(row));
  }

  // Helper methods
  private generateId(): string {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Mapping methods
  private mapUserFromRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      isVerified: Boolean(row.is_verified),
      isActive: Boolean(row.is_active),
      role: row.role,
      profileImage: row.profile_image,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private mapRideFromRow(row: any): Ride {
    return {
      id: row.id,
      driverId: row.driver_id,
      fromLocation: {
        latitude: row.from_latitude,
        longitude: row.from_longitude,
        address: row.from_address,
        city: row.from_city,
        state: row.from_state,
        country: row.from_country,
        postalCode: row.from_postal_code,
      },
      toLocation: {
        latitude: row.to_latitude,
        longitude: row.to_longitude,
        address: row.to_address,
        city: row.to_city,
        state: row.to_state,
        country: row.to_country,
        postalCode: row.to_postal_code,
      },
      departureTime: new Date(row.departure_time),
      arrivalTime: row.arrival_time ? new Date(row.arrival_time) : undefined,
      price: row.price,
      currency: row.currency,
      maxPassengers: row.max_passengers,
      availableSeats: row.available_seats,
      status: row.status,
      vehicleInfo: {
        make: row.vehicle_make,
        model: row.vehicle_model,
        year: row.vehicle_year,
        color: row.vehicle_color,
        licensePlate: row.vehicle_license_plate,
        capacity: row.vehicle_capacity,
        features: row.vehicle_features ? JSON.parse(row.vehicle_features) : [],
      },
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private mapBookingFromRow(row: any): Booking {
    return {
      id: row.id,
      userId: row.user_id,
      rideId: row.ride_id,
      passengerCount: row.passenger_count,
      totalPrice: row.total_price,
      currency: row.currency,
      status: row.status,
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      specialRequests: row.special_requests,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private mapSOSAlertFromRow(row: any): SOSAlert {
    return {
      id: row.id,
      userId: row.user_id,
      rideId: row.ride_id,
      location: {
        latitude: row.latitude,
        longitude: row.longitude,
        address: row.address,
        city: row.city,
        state: row.state,
        country: row.country,
        postalCode: row.postal_code,
      },
      type: row.type,
      message: row.message,
      status: row.status,
      priority: row.priority,
      resolvedBy: row.resolved_by,
      resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
      adminNotes: row.admin_notes,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  private mapEmergencyContactFromRow(row: any): EmergencyContact {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      phone: row.phone,
      relationship: row.relationship,
      isPrimary: Boolean(row.is_primary),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

// Factory function to create database service
export const createDatabaseService = async (connectionName: string = 'default'): Promise<DatabaseService> => {
  const connection = await dbManager.connect(connectionName);
  return new DatabaseService(connection);
};
