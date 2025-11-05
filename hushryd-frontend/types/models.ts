export type UserRole = 'driver' | 'customer' | 'passenger';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  memberSince: string;
  bio?: string;
  role: UserRole;
  licenseNumber?: string; // For drivers and customers
  licenseExpiry?: string; // For drivers and customers
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface Vehicle {
  id: string;
  ownerId: string; // User ID of driver or customer
  make: string;
  model: string;
  color: string;
  year: number;
  licensePlate: string;
  capacity: number; // Number of seats
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury' | 'economy';
  registrationNumber: string;
  insuranceExpiry: string;
  verified: boolean;
  images?: string[];
}

export interface Location {
  city: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RidePreferences {
  smoking: boolean;
  pets: boolean;
  music: boolean;
  chatty: 'quiet' | 'moderate' | 'chatty';
}

export interface Ride {
  id: string;
  publisherId: string; // Can be driver or customer
  publisher: User;
  publisherRole: 'driver' | 'customer'; // Who posted this ride
  from: Location;
  to: Location;
  date: string;
  time: string;
  price: number;
  seats: number;
  availableSeats: number;
  vehicleId: string;
  vehicle: Vehicle;
  preferences?: RidePreferences;
  description?: string;
  type: 'carpool' | 'private'; // Ride type: shared or private
  distance?: string;
  duration?: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  rideId: string;
  ride: Ride;
  passengerId: string;
  passenger: User;
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  bookingDate: string;
  pickupLocation: Location;
  dropoffLocation: Location;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUser: User;
  toUserId: string;
  toUser: User;
  rideId: string;
  rating: number;
  comment?: string;
  date: string;
  reviewType: 'driver-review' | 'passenger-review';
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
  type?: 'carpool' | 'private' | 'all';
  timeslot?: 'any' | 'early-morning' | 'morning' | 'late-morning' | 'afternoon' | 'evening' | 'late-evening' | 'night';
}

export interface AuthCredentials {
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  phone?: string;
  licenseNumber?: string;
  vehicleInfo?: Partial<Vehicle>;
}

// ==================== ADMIN TYPES ====================

export type AdminRole = 'superadmin' | 'admin' | 'manager' | 'finance' | 'support';
export type AdminStatus = 'active' | 'inactive' | 'suspended';

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: AdminStatus;
  avatarUrl?: string;
  phone?: string;
  permissions?: string[];
  lastLoginAt?: string;
  lastLoginIp?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface AdminAuthCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  description: string;
  category: 'verification' | 'payment' | 'ride_issue' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedToId?: string;
  assignedTo?: Admin;
  assignedAt?: string;
  resolution?: string;
  resolvedAt?: string;
  closedAt?: string;
  relatedRideId?: string;
  relatedBookingId?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRides: number;
  activeRides: number;
  totalBookings: number;
  confirmedBookings: number;
  revenue: number;
  pendingPayouts: number;
  newUsersToday: number;
  newRidesToday: number;
  openTickets: number;
  pendingVerifications: number;
}

export interface FinancialReport {
  period: string;
  totalRevenue: number;
  platformFees: number;
  processingFees: number;
  payouts: number;
  refunds: number;
  netRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
}

export interface VerificationRequest {
  id: string;
  type: 'user' | 'vehicle' | 'document';
  userId: string;
  user: User;
  vehicleId?: string;
  vehicle?: Vehicle;
  documentType?: string;
  documentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}