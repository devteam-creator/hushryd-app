import { DatabaseType } from './config';

// Base model interface
export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User model
export interface User extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'driver' | 'admin' | 'superadmin';
  profileImage?: string;
  emergencyContacts?: EmergencyContact[];
}

// Emergency Contact model
export interface EmergencyContact extends BaseModel {
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// Ride model
export interface Ride extends BaseModel {
  driverId: string;
  fromLocation: Location;
  toLocation: Location;
  departureTime: Date;
  arrivalTime?: Date;
  price: number;
  currency: string;
  maxPassengers: number;
  availableSeats: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  vehicleInfo: VehicleInfo;
  route?: Route;
}

// Location model
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

// Vehicle Info model
export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  capacity: number;
  features: string[];
}

// Route model
export interface Route {
  id: string;
  name: string;
  fromCity: string;
  toCity: string;
  distance: number;
  estimatedDuration: number;
  waypoints?: Location[];
}

// Booking model
export interface Booking extends BaseModel {
  userId: string;
  rideId: string;
  passengerCount: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  specialRequests?: string;
}

// SOS Alert model
export interface SOSAlert extends BaseModel {
  userId: string;
  rideId?: string;
  location: Location;
  type: 'medical' | 'accident' | 'breakdown' | 'harassment' | 'other';
  message?: string;
  status: 'active' | 'resolved' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  resolvedBy?: string;
  resolvedAt?: Date;
  adminNotes?: string;
}

// Admin model
export interface Admin extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'superadmin' | 'finance' | 'support';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
}

// Transaction model
export interface Transaction extends BaseModel {
  userId: string;
  bookingId?: string;
  type: 'payment' | 'refund' | 'bonus' | 'penalty' | 'commission';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  paymentGateway?: string;
  gatewayTransactionId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Payment model
export interface Payment extends BaseModel {
  userId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'cash' | 'net_banking';
  paymentGateway: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
}

// Wallet model
export interface Wallet extends BaseModel {
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  lastTransactionAt?: Date;
}

// Wallet Transaction model
export interface WalletTransaction extends BaseModel {
  walletId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: 'booking' | 'refund' | 'bonus' | 'penalty';
}

// Review model
export interface Review extends BaseModel {
  userId: string;
  driverId: string;
  rideId: string;
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
  isAnonymous: boolean;
  status: 'active' | 'hidden' | 'reported';
}

// Driver Profile model
export interface DriverProfile extends BaseModel {
  userId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  vehicleRegistration: string;
  insuranceNumber: string;
  insuranceExpiry: Date;
  experience: number; // years
  totalRides: number;
  totalEarnings: number;
  averageRating: number;
  isVerified: boolean;
  verificationDocuments: string[];
  bankAccount?: BankAccount;
}

// Bank Account model
export interface BankAccount extends BaseModel {
  driverId: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  isVerified: boolean;
}

// Route model
export interface Route extends BaseModel {
  name: string;
  fromCity: string;
  toCity: string;
  fromState: string;
  toState: string;
  distance: number; // in kilometers
  estimatedDuration: number; // in minutes
  waypoints: Location[];
  isActive: boolean;
  basePrice: number;
}

// Notification model
export interface Notification extends BaseModel {
  userId: string;
  type: 'booking' | 'payment' | 'ride' | 'sos' | 'general' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  metadata?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// Support Ticket model
export interface SupportTicket extends BaseModel {
  userId: string;
  type: 'technical' | 'billing' | 'ride' | 'general' | 'complaint';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  resolvedAt?: Date;
  resolution?: string;
  attachments?: string[];
}

// Fare Management model
export interface Fare extends BaseModel {
  routeId: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  surgeMultiplier: number;
  minimumFare: number;
  maximumFare: number;
  currency: string;
  isActive: boolean;
  validFrom: Date;
  validTo?: Date;
}

// Commission model
export interface Commission extends BaseModel {
  driverId: string;
  bookingId: string;
  amount: number;
  percentage: number;
  type: 'platform' | 'driver';
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: Date;
}

// Payout model
export interface Payout extends BaseModel {
  driverId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: string;
  bankAccountId: string;
  transactionId?: string;
  processedAt?: Date;
  failureReason?: string;
}

// Promo Code model
export interface PromoCode extends BaseModel {
  code: string;
  description: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  applicableRoutes?: string[];
}

// User Promo Usage model
export interface UserPromoUsage extends BaseModel {
  userId: string;
  promoCodeId: string;
  bookingId: string;
  discountAmount: number;
  usedAt: Date;
}

// Database schema definitions
export const getDatabaseSchema = (dbType: DatabaseType) => {
  const schemas = {
    mysql: getMySQLSchema(),
    postgresql: getPostgreSQLSchema(),
    oracle: getOracleSchema(),
  };
  
  return schemas[dbType];
};

function getMySQLSchema() {
  return {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        role ENUM('user', 'driver', 'admin', 'superadmin') DEFAULT 'user',
        profile_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_phone (phone),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    
    emergency_contacts: `
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        relationship VARCHAR(50),
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    
    rides: `
      CREATE TABLE IF NOT EXISTS rides (
        id VARCHAR(36) PRIMARY KEY,
        driver_id VARCHAR(36) NOT NULL,
        from_latitude DECIMAL(10, 8) NOT NULL,
        from_longitude DECIMAL(11, 8) NOT NULL,
        from_address TEXT NOT NULL,
        from_city VARCHAR(100) NOT NULL,
        from_state VARCHAR(100) NOT NULL,
        from_country VARCHAR(100) NOT NULL,
        from_postal_code VARCHAR(20),
        to_latitude DECIMAL(10, 8) NOT NULL,
        to_longitude DECIMAL(11, 8) NOT NULL,
        to_address TEXT NOT NULL,
        to_city VARCHAR(100) NOT NULL,
        to_state VARCHAR(100) NOT NULL,
        to_country VARCHAR(100) NOT NULL,
        to_postal_code VARCHAR(20),
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        max_passengers INT NOT NULL,
        available_seats INT NOT NULL,
        status ENUM('scheduled', 'active', 'completed', 'cancelled') DEFAULT 'scheduled',
        vehicle_make VARCHAR(50),
        vehicle_model VARCHAR(50),
        vehicle_year INT,
        vehicle_color VARCHAR(30),
        vehicle_license_plate VARCHAR(20),
        vehicle_capacity INT,
        vehicle_features JSON,
        route_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_driver_id (driver_id),
        INDEX idx_departure_time (departure_time),
        INDEX idx_status (status),
        INDEX idx_from_location (from_latitude, from_longitude),
        INDEX idx_to_location (to_latitude, to_longitude)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    
    bookings: `
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        ride_id VARCHAR(36) NOT NULL,
        passenger_count INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_ride_id (ride_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    
    sos_alerts: `
      CREATE TABLE IF NOT EXISTS sos_alerts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        ride_id VARCHAR(36),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20),
        type ENUM('medical', 'accident', 'breakdown', 'harassment', 'other') NOT NULL,
        message TEXT,
        status ENUM('active', 'resolved', 'cancelled') DEFAULT 'active',
        priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
        resolved_by VARCHAR(36),
        resolved_at TIMESTAMP NULL,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL,
        FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_location (latitude, longitude)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
    
    admins: `
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'superadmin', 'finance', 'support') NOT NULL,
        permissions JSON,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    transactions: `
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        booking_id VARCHAR(36),
        type ENUM('payment', 'refund', 'bonus', 'penalty', 'commission') NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
        payment_method VARCHAR(50) NOT NULL,
        payment_gateway VARCHAR(50),
        gateway_transaction_id VARCHAR(255),
        description TEXT,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_booking_id (booking_id),
        INDEX idx_type (type),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    payments: `
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        booking_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
        payment_method ENUM('credit_card', 'debit_card', 'upi', 'wallet', 'cash', 'net_banking') NOT NULL,
        payment_gateway VARCHAR(50) NOT NULL,
        gateway_transaction_id VARCHAR(255),
        gateway_response JSON,
        refund_amount DECIMAL(10, 2),
        refund_reason TEXT,
        refunded_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_booking_id (booking_id),
        INDEX idx_status (status),
        INDEX idx_payment_method (payment_method)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    wallets: `
      CREATE TABLE IF NOT EXISTS wallets (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        balance DECIMAL(10, 2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'INR',
        is_active BOOLEAN DEFAULT TRUE,
        last_transaction_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_wallet (user_id),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    wallet_transactions: `
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id VARCHAR(36) PRIMARY KEY,
        wallet_id VARCHAR(36) NOT NULL,
        type ENUM('credit', 'debit') NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        reference_id VARCHAR(36),
        reference_type ENUM('booking', 'refund', 'bonus', 'penalty'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
        INDEX idx_wallet_id (wallet_id),
        INDEX idx_type (type),
        INDEX idx_reference (reference_id, reference_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    reviews: `
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        driver_id VARCHAR(36) NOT NULL,
        ride_id VARCHAR(36) NOT NULL,
        booking_id VARCHAR(36) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_anonymous BOOLEAN DEFAULT FALSE,
        status ENUM('active', 'hidden', 'reported') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_driver_id (driver_id),
        INDEX idx_ride_id (ride_id),
        INDEX idx_booking_id (booking_id),
        INDEX idx_rating (rating)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    driver_profiles: `
      CREATE TABLE IF NOT EXISTS driver_profiles (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        license_number VARCHAR(50) NOT NULL,
        license_expiry DATE NOT NULL,
        vehicle_registration VARCHAR(50) NOT NULL,
        insurance_number VARCHAR(50) NOT NULL,
        insurance_expiry DATE NOT NULL,
        experience INT DEFAULT 0,
        total_rides INT DEFAULT 0,
        total_earnings DECIMAL(10, 2) DEFAULT 0.00,
        average_rating DECIMAL(3, 2) DEFAULT 0.00,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_documents JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_driver_profile (user_id),
        INDEX idx_user_id (user_id),
        INDEX idx_is_verified (is_verified)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    bank_accounts: `
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id VARCHAR(36) PRIMARY KEY,
        driver_id VARCHAR(36) NOT NULL,
        account_number VARCHAR(50) NOT NULL,
        ifsc_code VARCHAR(20) NOT NULL,
        bank_name VARCHAR(100) NOT NULL,
        account_holder_name VARCHAR(100) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_driver_id (driver_id),
        INDEX idx_is_verified (is_verified)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    routes: `
      CREATE TABLE IF NOT EXISTS routes (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        from_city VARCHAR(100) NOT NULL,
        to_city VARCHAR(100) NOT NULL,
        from_state VARCHAR(100) NOT NULL,
        to_state VARCHAR(100) NOT NULL,
        distance DECIMAL(10, 2) NOT NULL,
        estimated_duration INT NOT NULL,
        waypoints JSON,
        is_active BOOLEAN DEFAULT TRUE,
        base_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_from_to (from_city, to_city),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    notifications: `
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        type ENUM('booking', 'payment', 'ride', 'sos', 'general', 'promotion') NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP NULL,
        metadata JSON,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_type (type),
        INDEX idx_is_read (is_read),
        INDEX idx_priority (priority)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    support_tickets: `
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        type ENUM('technical', 'billing', 'ride', 'general', 'complaint') NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        assigned_to VARCHAR(36),
        resolved_at TIMESTAMP NULL,
        resolution TEXT,
        attachments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES admins(id) ON DELETE SET NULL,
        INDEX idx_user_id (user_id),
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_assigned_to (assigned_to)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    fares: `
      CREATE TABLE IF NOT EXISTS fares (
        id VARCHAR(36) PRIMARY KEY,
        route_id VARCHAR(36) NOT NULL,
        base_fare DECIMAL(10, 2) NOT NULL,
        per_km_rate DECIMAL(10, 2) NOT NULL,
        per_minute_rate DECIMAL(10, 2) NOT NULL,
        surge_multiplier DECIMAL(3, 2) DEFAULT 1.00,
        minimum_fare DECIMAL(10, 2) NOT NULL,
        maximum_fare DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        is_active BOOLEAN DEFAULT TRUE,
        valid_from TIMESTAMP NOT NULL,
        valid_to TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
        INDEX idx_route_id (route_id),
        INDEX idx_is_active (is_active),
        INDEX idx_valid_dates (valid_from, valid_to)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    commissions: `
      CREATE TABLE IF NOT EXISTS commissions (
        id VARCHAR(36) PRIMARY KEY,
        driver_id VARCHAR(36) NOT NULL,
        booking_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        percentage DECIMAL(5, 2) NOT NULL,
        type ENUM('platform', 'driver') NOT NULL,
        status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
        paid_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        INDEX idx_driver_id (driver_id),
        INDEX idx_booking_id (booking_id),
        INDEX idx_type (type),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    payouts: `
      CREATE TABLE IF NOT EXISTS payouts (
        id VARCHAR(36) PRIMARY KEY,
        driver_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50) NOT NULL,
        bank_account_id VARCHAR(36) NOT NULL,
        transaction_id VARCHAR(255),
        processed_at TIMESTAMP NULL,
        failure_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE,
        INDEX idx_driver_id (driver_id),
        INDEX idx_status (status),
        INDEX idx_bank_account_id (bank_account_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    promo_codes: `
      CREATE TABLE IF NOT EXISTS promo_codes (
        id VARCHAR(36) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        type ENUM('percentage', 'fixed_amount') NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        min_order_amount DECIMAL(10, 2),
        max_discount_amount DECIMAL(10, 2),
        usage_limit INT,
        used_count INT DEFAULT 0,
        valid_from TIMESTAMP NOT NULL,
        valid_to TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        applicable_routes JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_code (code),
        INDEX idx_is_active (is_active),
        INDEX idx_valid_dates (valid_from, valid_to)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,

    user_promo_usages: `
      CREATE TABLE IF NOT EXISTS user_promo_usages (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        promo_code_id VARCHAR(36) NOT NULL,
        booking_id VARCHAR(36) NOT NULL,
        discount_amount DECIMAL(10, 2) NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE,
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_promo_code_id (promo_code_id),
        INDEX idx_booking_id (booking_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `,
  };
}

function getPostgreSQLSchema() {
  return {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'driver', 'admin', 'superadmin')),
        profile_image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `,
    
    emergency_contacts: `
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        relationship VARCHAR(50),
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
    `,
    
    rides: `
      CREATE TABLE IF NOT EXISTS rides (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        driver_id UUID NOT NULL,
        from_latitude DECIMAL(10, 8) NOT NULL,
        from_longitude DECIMAL(11, 8) NOT NULL,
        from_address TEXT NOT NULL,
        from_city VARCHAR(100) NOT NULL,
        from_state VARCHAR(100) NOT NULL,
        from_country VARCHAR(100) NOT NULL,
        from_postal_code VARCHAR(20),
        to_latitude DECIMAL(10, 8) NOT NULL,
        to_longitude DECIMAL(11, 8) NOT NULL,
        to_address TEXT NOT NULL,
        to_city VARCHAR(100) NOT NULL,
        to_state VARCHAR(100) NOT NULL,
        to_country VARCHAR(100) NOT NULL,
        to_postal_code VARCHAR(20),
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        max_passengers INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
        vehicle_make VARCHAR(50),
        vehicle_model VARCHAR(50),
        vehicle_year INTEGER,
        vehicle_color VARCHAR(30),
        vehicle_license_plate VARCHAR(20),
        vehicle_capacity INTEGER,
        vehicle_features JSONB,
        route_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
      CREATE INDEX IF NOT EXISTS idx_rides_departure_time ON rides(departure_time);
      CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
      CREATE INDEX IF NOT EXISTS idx_rides_from_location ON rides(from_latitude, from_longitude);
      CREATE INDEX IF NOT EXISTS idx_rides_to_location ON rides(to_latitude, to_longitude);
    `,
    
    bookings: `
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        ride_id UUID NOT NULL,
        passenger_count INTEGER NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        payment_method VARCHAR(50),
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_ride_id ON bookings(ride_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    `,
    
    sos_alerts: `
      CREATE TABLE IF NOT EXISTS sos_alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        ride_id UUID,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20),
        type VARCHAR(20) NOT NULL CHECK (type IN ('medical', 'accident', 'breakdown', 'harassment', 'other')),
        message TEXT,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        resolved_by UUID,
        resolved_at TIMESTAMP NULL,
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL,
        FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
      CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
      CREATE INDEX IF NOT EXISTS idx_sos_alerts_priority ON sos_alerts(priority);
      CREATE INDEX IF NOT EXISTS idx_sos_alerts_location ON sos_alerts(latitude, longitude);
    `,
    
    admins: `
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'superadmin', 'finance', 'support')),
        permissions JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
      CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
    `,
  };
}

function getOracleSchema() {
  return {
    users: `
      CREATE TABLE users (
        id VARCHAR2(36) PRIMARY KEY,
        email VARCHAR2(255) UNIQUE NOT NULL,
        first_name VARCHAR2(100) NOT NULL,
        last_name VARCHAR2(100) NOT NULL,
        phone VARCHAR2(20) NOT NULL,
        is_verified NUMBER(1) DEFAULT 0 CHECK (is_verified IN (0, 1)),
        is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
        role VARCHAR2(20) DEFAULT 'user' CHECK (role IN ('user', 'driver', 'admin', 'superadmin')),
        profile_image VARCHAR2(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_users_phone ON users(phone);
      CREATE INDEX idx_users_role ON users(role);
    `,
    
    emergency_contacts: `
      CREATE TABLE emergency_contacts (
        id VARCHAR2(36) PRIMARY KEY,
        user_id VARCHAR2(36) NOT NULL,
        name VARCHAR2(100) NOT NULL,
        phone VARCHAR2(20) NOT NULL,
        relationship VARCHAR2(50),
        is_primary NUMBER(1) DEFAULT 0 CHECK (is_primary IN (0, 1)),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_emergency_contacts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
    `,
    
    rides: `
      CREATE TABLE rides (
        id VARCHAR2(36) PRIMARY KEY,
        driver_id VARCHAR2(36) NOT NULL,
        from_latitude NUMBER(10, 8) NOT NULL,
        from_longitude NUMBER(11, 8) NOT NULL,
        from_address CLOB NOT NULL,
        from_city VARCHAR2(100) NOT NULL,
        from_state VARCHAR2(100) NOT NULL,
        from_country VARCHAR2(100) NOT NULL,
        from_postal_code VARCHAR2(20),
        to_latitude NUMBER(10, 8) NOT NULL,
        to_longitude NUMBER(11, 8) NOT NULL,
        to_address CLOB NOT NULL,
        to_city VARCHAR2(100) NOT NULL,
        to_state VARCHAR2(100) NOT NULL,
        to_country VARCHAR2(100) NOT NULL,
        to_postal_code VARCHAR2(20),
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NULL,
        price NUMBER(10, 2) NOT NULL,
        currency VARCHAR2(3) DEFAULT 'INR',
        max_passengers NUMBER(10) NOT NULL,
        available_seats NUMBER(10) NOT NULL,
        status VARCHAR2(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
        vehicle_make VARCHAR2(50),
        vehicle_model VARCHAR2(50),
        vehicle_year NUMBER(4),
        vehicle_color VARCHAR2(30),
        vehicle_license_plate VARCHAR2(20),
        vehicle_capacity NUMBER(10),
        vehicle_features CLOB,
        route_id VARCHAR2(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_rides_driver_id FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX idx_rides_driver_id ON rides(driver_id);
      CREATE INDEX idx_rides_departure_time ON rides(departure_time);
      CREATE INDEX idx_rides_status ON rides(status);
      CREATE INDEX idx_rides_from_location ON rides(from_latitude, from_longitude);
      CREATE INDEX idx_rides_to_location ON rides(to_latitude, to_longitude);
    `,
    
    bookings: `
      CREATE TABLE bookings (
        id VARCHAR2(36) PRIMARY KEY,
        user_id VARCHAR2(36) NOT NULL,
        ride_id VARCHAR2(36) NOT NULL,
        passenger_count NUMBER(10) NOT NULL,
        total_price NUMBER(10, 2) NOT NULL,
        currency VARCHAR2(3) DEFAULT 'INR',
        status VARCHAR2(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status VARCHAR2(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        payment_method VARCHAR2(50),
        special_requests CLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_bookings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_bookings_ride_id FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
      );
      
      CREATE INDEX idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX idx_bookings_ride_id ON bookings(ride_id);
      CREATE INDEX idx_bookings_status ON bookings(status);
    `,
    
    sos_alerts: `
      CREATE TABLE sos_alerts (
        id VARCHAR2(36) PRIMARY KEY,
        user_id VARCHAR2(36) NOT NULL,
        ride_id VARCHAR2(36),
        latitude NUMBER(10, 8) NOT NULL,
        longitude NUMBER(11, 8) NOT NULL,
        address CLOB NOT NULL,
        city VARCHAR2(100) NOT NULL,
        state VARCHAR2(100) NOT NULL,
        country VARCHAR2(100) NOT NULL,
        postal_code VARCHAR2(20),
        type VARCHAR2(20) NOT NULL CHECK (type IN ('medical', 'accident', 'breakdown', 'harassment', 'other')),
        message CLOB,
        status VARCHAR2(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
        priority VARCHAR2(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        resolved_by VARCHAR2(36),
        resolved_at TIMESTAMP NULL,
        admin_notes CLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_sos_alerts_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_sos_alerts_ride_id FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE SET NULL,
        CONSTRAINT fk_sos_alerts_resolved_by FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
      );
      
      CREATE INDEX idx_sos_alerts_user_id ON sos_alerts(user_id);
      CREATE INDEX idx_sos_alerts_status ON sos_alerts(status);
      CREATE INDEX idx_sos_alerts_priority ON sos_alerts(priority);
      CREATE INDEX idx_sos_alerts_location ON sos_alerts(latitude, longitude);
    `,
    
    admins: `
      CREATE TABLE admins (
        id VARCHAR2(36) PRIMARY KEY,
        email VARCHAR2(255) UNIQUE NOT NULL,
        first_name VARCHAR2(100) NOT NULL,
        last_name VARCHAR2(100) NOT NULL,
        role VARCHAR2(20) NOT NULL CHECK (role IN ('admin', 'superadmin', 'finance', 'support')),
        permissions CLOB,
        is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX idx_admins_email ON admins(email);
      CREATE INDEX idx_admins_role ON admins(role);
    `,
  };
}
