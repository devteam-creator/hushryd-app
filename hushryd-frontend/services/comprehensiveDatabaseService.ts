import { v4 as uuidv4 } from 'uuid';
import {
    Admin,
    BankAccount,
    Booking,
    Commission,
    DriverProfile,
    EmergencyContact,
    Fare,
    Notification,
    Payment,
    Payout, PromoCode,
    Review,
    Ride,
    Route,
    SOSAlert,
    SupportTicket,
    Transaction,
    User,
    UserPromoUsage,
    Wallet, WalletTransaction
} from '../database/models';

export interface DatabaseStats {
  totalUsers: number;
  totalDrivers: number;
  totalRides: number;
  totalBookings: number;
  totalTransactions: number;
  totalRevenue: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingBookings: number;
  completedRides: number;
  totalReviews: number;
  averageRating: number;
}

export class ComprehensiveDatabaseService {
  private static instance: ComprehensiveDatabaseService;
  private users: Map<string, User> = new Map();
  private emergencyContacts: Map<string, EmergencyContact> = new Map();
  private rides: Map<string, Ride> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private sosAlerts: Map<string, SOSAlert> = new Map();
  private admins: Map<string, Admin> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private payments: Map<string, Payment> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private walletTransactions: Map<string, WalletTransaction> = new Map();
  private reviews: Map<string, Review> = new Map();
  private driverProfiles: Map<string, DriverProfile> = new Map();
  private bankAccounts: Map<string, BankAccount> = new Map();
  private routes: Map<string, Route> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private supportTickets: Map<string, SupportTicket> = new Map();
  private fares: Map<string, Fare> = new Map();
  private commissions: Map<string, Commission> = new Map();
  private payouts: Map<string, Payout> = new Map();
  private promoCodes: Map<string, PromoCode> = new Map();
  private userPromoUsages: Map<string, UserPromoUsage> = new Map();

  public static getInstance(): ComprehensiveDatabaseService {
    if (!ComprehensiveDatabaseService.instance) {
      ComprehensiveDatabaseService.instance = new ComprehensiveDatabaseService();
    }
    return ComprehensiveDatabaseService.instance;
  }

  // User Management
  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  public deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Emergency Contact Management
  public createEmergencyContact(contactData: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): EmergencyContact {
    const contact: EmergencyContact = {
      id: uuidv4(),
      ...contactData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emergencyContacts.set(contact.id, contact);
    return contact;
  }

  public getEmergencyContactsByUserId(userId: string): EmergencyContact[] {
    return Array.from(this.emergencyContacts.values()).filter(contact => contact.userId === userId);
  }

  // Ride Management
  public createRide(rideData: Omit<Ride, 'id' | 'createdAt' | 'updatedAt'>): Ride {
    const ride: Ride = {
      id: uuidv4(),
      ...rideData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.rides.set(ride.id, ride);
    return ride;
  }

  public getAllRides(): Ride[] {
    return Array.from(this.rides.values());
  }

  public getRidesByDriverId(driverId: string): Ride[] {
    return Array.from(this.rides.values()).filter(ride => ride.driverId === driverId);
  }

  public updateRideStatus(id: string, status: Ride['status']): Ride | undefined {
    const ride = this.rides.get(id);
    if (ride) {
      const updatedRide = { ...ride, status, updatedAt: new Date() };
      this.rides.set(id, updatedRide);
      return updatedRide;
    }
    return undefined;
  }

  // Booking Management
  public createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const booking: Booking = {
      id: uuidv4(),
      ...bookingData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  public getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  public getBookingsByUserId(userId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  public getBookingsByRideId(rideId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.rideId === rideId);
  }

  public updateBookingStatus(id: string, status: Booking['status']): Booking | undefined {
    const booking = this.bookings.get(id);
    if (booking) {
      const updatedBooking = { ...booking, status, updatedAt: new Date() };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }

  // Transaction Management
  public createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transaction: Transaction = {
      id: uuidv4(),
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  public getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  public getTransactionsByUserId(userId: string): Transaction[] {
    return Array.from(this.transactions.values()).filter(transaction => transaction.userId === userId);
  }

  public getTransactionsByBookingId(bookingId: string): Transaction[] {
    return Array.from(this.transactions.values()).filter(transaction => transaction.bookingId === bookingId);
  }

  // Payment Management
  public createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Payment {
    const payment: Payment = {
      id: uuidv4(),
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  public getAllPayments(): Payment[] {
    return Array.from(this.payments.values());
  }

  public getPaymentsByUserId(userId: string): Payment[] {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  public updatePaymentStatus(id: string, status: Payment['status']): Payment | undefined {
    const payment = this.payments.get(id);
    if (payment) {
      const updatedPayment = { ...payment, status, updatedAt: new Date() };
      this.payments.set(id, updatedPayment);
      return updatedPayment;
    }
    return undefined;
  }

  // Wallet Management
  public createWallet(walletData: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Wallet {
    const wallet: Wallet = {
      id: uuidv4(),
      ...walletData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  public getWalletByUserId(userId: string): Wallet | undefined {
    return Array.from(this.wallets.values()).find(wallet => wallet.userId === userId);
  }

  public updateWalletBalance(walletId: string, amount: number): Wallet | undefined {
    const wallet = this.wallets.get(walletId);
    if (wallet) {
      const updatedWallet = { 
        ...wallet, 
        balance: wallet.balance + amount, 
        lastTransactionAt: new Date(),
        updatedAt: new Date() 
      };
      this.wallets.set(walletId, updatedWallet);
      return updatedWallet;
    }
    return undefined;
  }

  // Review Management
  public createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Review {
    const review: Review = {
      id: uuidv4(),
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reviews.set(review.id, review);
    return review;
  }

  public getAllReviews(): Review[] {
    return Array.from(this.reviews.values());
  }

  public getReviewsByDriverId(driverId: string): Review[] {
    return Array.from(this.reviews.values()).filter(review => review.driverId === driverId);
  }

  public getAverageRatingByDriverId(driverId: string): number {
    const reviews = this.getReviewsByDriverId(driverId);
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }

  // Driver Profile Management
  public createDriverProfile(profileData: Omit<DriverProfile, 'id' | 'createdAt' | 'updatedAt'>): DriverProfile {
    const profile: DriverProfile = {
      id: uuidv4(),
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.driverProfiles.set(profile.id, profile);
    return profile;
  }

  public getDriverProfileByUserId(userId: string): DriverProfile | undefined {
    return Array.from(this.driverProfiles.values()).find(profile => profile.userId === userId);
  }

  public updateDriverProfile(userId: string, updates: Partial<DriverProfile>): DriverProfile | undefined {
    const profile = this.getDriverProfileByUserId(userId);
    if (profile) {
      const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
      this.driverProfiles.set(profile.id, updatedProfile);
      return updatedProfile;
    }
    return undefined;
  }

  // Notification Management
  public createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Notification {
    const notification: Notification = {
      id: uuidv4(),
      ...notificationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  public getNotificationsByUserId(userId: string): Notification[] {
    return Array.from(this.notifications.values()).filter(notification => notification.userId === userId);
  }

  public markNotificationAsRead(id: string): Notification | undefined {
    const notification = this.notifications.get(id);
    if (notification) {
      const updatedNotification = { 
        ...notification, 
        isRead: true, 
        readAt: new Date(),
        updatedAt: new Date() 
      };
      this.notifications.set(id, updatedNotification);
      return updatedNotification;
    }
    return undefined;
  }

  // Support Ticket Management
  public createSupportTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>): SupportTicket {
    const ticket: SupportTicket = {
      id: uuidv4(),
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.supportTickets.set(ticket.id, ticket);
    return ticket;
  }

  public getAllSupportTickets(): SupportTicket[] {
    return Array.from(this.supportTickets.values());
  }

  public getSupportTicketsByUserId(userId: string): SupportTicket[] {
    return Array.from(this.supportTickets.values()).filter(ticket => ticket.userId === userId);
  }

  public updateSupportTicketStatus(id: string, status: SupportTicket['status']): SupportTicket | undefined {
    const ticket = this.supportTickets.get(id);
    if (ticket) {
      const updatedTicket = { ...ticket, status, updatedAt: new Date() };
      this.supportTickets.set(id, updatedTicket);
      return updatedTicket;
    }
    return undefined;
  }

  // Database Statistics
  public getDatabaseStats(): DatabaseStats {
    const users = this.getAllUsers();
    const drivers = users.filter(user => user.role === 'driver');
    const rides = this.getAllRides();
    const bookings = this.getAllBookings();
    const transactions = this.getAllTransactions();
    const reviews = this.getAllReviews();

    const totalRevenue = transactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    return {
      totalUsers: users.length,
      totalDrivers: drivers.length,
      totalRides: rides.length,
      totalBookings: bookings.length,
      totalTransactions: transactions.length,
      totalRevenue,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      completedRides: rides.filter(r => r.status === 'completed').length,
      totalReviews: reviews.length,
      averageRating,
    };
  }

  // Seed Database with Sample Data
  public seedDatabase(): void {
    console.log('🌱 Seeding comprehensive database with sample data...');

    // Create sample users
    const user1 = this.createUser({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+919876543210',
      role: 'user',
      isVerified: true,
      isActive: true,
    });

    const driver1 = this.createUser({
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+919876543211',
      role: 'driver',
      isVerified: true,
      isActive: true,
    });

    const admin1 = this.createUser({
      email: 'admin@hushryd.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+919876543212',
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    // Create sample emergency contacts
    this.createEmergencyContact({
      userId: user1.id,
      name: 'Emergency Contact 1',
      phone: '+919876543220',
      relationship: 'Family',
      isPrimary: true,
    });

    // Create sample driver profile
    this.createDriverProfile({
      userId: driver1.id,
      licenseNumber: 'DL123456789',
      licenseExpiry: new Date('2025-12-31'),
      vehicleRegistration: 'TS09AB1234',
      insuranceNumber: 'INS123456789',
      insuranceExpiry: new Date('2024-12-31'),
      experience: 5,
      totalRides: 0,
      totalEarnings: 0,
      averageRating: 0,
      isVerified: true,
      verificationDocuments: ['license.pdf', 'insurance.pdf'],
    });

    // Create sample ride
    const ride1 = this.createRide({
      driverId: driver1.id,
      fromLocation: {
        latitude: 17.3850,
        longitude: 78.4867,
        address: 'Hyderabad Central',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India',
      },
      toLocation: {
        latitude: 13.0827,
        longitude: 80.2707,
        address: 'Chennai Central',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
      },
      departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      price: 2500,
      currency: 'INR',
      maxPassengers: 4,
      availableSeats: 3,
      status: 'scheduled',
      vehicleInfo: {
        make: 'Toyota',
        model: 'Innova',
        year: 2022,
        color: 'White',
        licensePlate: 'TS09AB1234',
        capacity: 7,
        features: ['AC', 'Music System', 'GPS'],
      },
    });

    // Create sample booking
    const booking1 = this.createBooking({
      userId: user1.id,
      rideId: ride1.id,
      passengerCount: 2,
      totalPrice: 2500,
      currency: 'INR',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
    });

    // Create sample transaction
    this.createTransaction({
      userId: user1.id,
      bookingId: booking1.id,
      type: 'payment',
      amount: 2500,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'upi',
      description: 'Payment for ride booking',
    });

    // Create sample payment
    this.createPayment({
      userId: user1.id,
      bookingId: booking1.id,
      amount: 2500,
      currency: 'INR',
      status: 'completed',
      paymentMethod: 'upi',
      paymentGateway: 'razorpay',
      gatewayTransactionId: 'txn_123456789',
    });

    // Create sample wallet
    this.createWallet({
      userId: user1.id,
      balance: 1000,
      currency: 'INR',
      isActive: true,
    });

    // Create sample review
    this.createReview({
      userId: user1.id,
      driverId: driver1.id,
      rideId: ride1.id,
      bookingId: booking1.id,
      rating: 5,
      comment: 'Excellent service!',
      isAnonymous: false,
      status: 'active',
    });

    // Create sample notification
    this.createNotification({
      userId: user1.id,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your ride booking has been confirmed',
      isRead: false,
      priority: 'medium',
    });

    // Create sample support ticket
    this.createSupportTicket({
      userId: user1.id,
      type: 'general',
      subject: 'Need help with booking',
      description: 'I need assistance with my recent booking',
      status: 'open',
      priority: 'medium',
    });

    console.log('✅ Database seeded successfully with comprehensive sample data');
  }

  // Clear all data
  public clearDatabase(): void {
    this.users.clear();
    this.emergencyContacts.clear();
    this.rides.clear();
    this.bookings.clear();
    this.sosAlerts.clear();
    this.admins.clear();
    this.transactions.clear();
    this.payments.clear();
    this.wallets.clear();
    this.walletTransactions.clear();
    this.reviews.clear();
    this.driverProfiles.clear();
    this.bankAccounts.clear();
    this.routes.clear();
    this.notifications.clear();
    this.supportTickets.clear();
    this.fares.clear();
    this.commissions.clear();
    this.payouts.clear();
    this.promoCodes.clear();
    this.userPromoUsages.clear();
    console.log('🗑️ Database cleared successfully');
  }
}

export const comprehensiveDatabaseService = ComprehensiveDatabaseService.getInstance();
