import { AdminRole } from '../types/models';

export interface DatabaseTable {
  name: string;
  columns: string[];
  data: any[];
}

export interface DatabaseConnection {
  tables: DatabaseTable[];
  lastUpdated: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  permissions?: string[];
}

export interface RideData {
  id: string;
  driverId: string;
  passengerId: string;
  from: string;
  to: string;
  distance: number;
  fare: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface BookingData {
  id: string;
  userId: string;
  rideId: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
}

export interface TransactionData {
  id: string;
  userId: string;
  type: 'payment' | 'refund' | 'payout';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  processedAt?: string;
}

export class RealDatabaseService {
  private static instance: RealDatabaseService;
  private connection: DatabaseConnection;

  public static getInstance(): RealDatabaseService {
    if (!RealDatabaseService.instance) {
      RealDatabaseService.instance = new RealDatabaseService();
    }
    return RealDatabaseService.instance;
  }

  constructor() {
    this.connection = this.loadDatabase();
  }

  // Expose connection for debugging
  public get connectionData() {
    return this.connection;
  }

  private loadDatabase(): DatabaseConnection {
    try {
      const stored = typeof window !== 'undefined' ? 
        localStorage.getItem('real_database') : 
        null;
      
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }

    // Initialize empty database structure
    return {
      tables: [
        {
          name: 'admin_users',
          columns: ['id', 'name', 'email', 'password', 'role', 'status', 'lastLogin', 'createdAt', 'updatedAt', 'department', 'permissions'],
          data: []
        },
        {
          name: 'rides',
          columns: ['id', 'driverId', 'passengerId', 'from', 'to', 'distance', 'fare', 'status', 'createdAt', 'completedAt'],
          data: []
        },
        {
          name: 'bookings',
          columns: ['id', 'userId', 'rideId', 'bookingDate', 'status', 'paymentStatus', 'amount'],
          data: []
        },
        {
          name: 'transactions',
          columns: ['id', 'userId', 'type', 'amount', 'status', 'description', 'createdAt', 'processedAt'],
          data: []
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }

  private saveDatabase(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('real_database', JSON.stringify(this.connection));
      }
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // Admin Users Table Operations
  public getAllAdminUsers(): AdminUser[] {
    const adminUsersTable = this.connection.tables.find(table => table.name === 'admin_users');
    return adminUsersTable ? adminUsersTable.data : [];
  }

  public getAdminUserById(id: string): AdminUser | undefined {
    const adminUsers = this.getAllAdminUsers();
    return adminUsers.find(user => user.id === id);
  }

  public getAdminUserByEmail(email: string): AdminUser | undefined {
    const adminUsers = this.getAllAdminUsers();
    return adminUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  public addAdminUser(user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): AdminUser {
    const adminUsersTable = this.connection.tables.find(table => table.name === 'admin_users');
    if (!adminUsersTable) {
      throw new Error('Admin users table not found');
    }

    const newUser: AdminUser = {
      id: this.generateId(),
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    adminUsersTable.data.push(newUser);
    this.connection.lastUpdated = new Date().toISOString();
    this.saveDatabase();
    return newUser;
  }

  public updateAdminUser(id: string, updates: Partial<AdminUser>): AdminUser | undefined {
    const adminUsersTable = this.connection.tables.find(table => table.name === 'admin_users');
    if (!adminUsersTable) {
      throw new Error('Admin users table not found');
    }

    const userIndex = adminUsersTable.data.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      adminUsersTable.data[userIndex] = { 
        ...adminUsersTable.data[userIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.connection.lastUpdated = new Date().toISOString();
      this.saveDatabase();
      return adminUsersTable.data[userIndex];
    }
    return undefined;
  }

  public deleteAdminUser(id: string): boolean {
    const adminUsersTable = this.connection.tables.find(table => table.name === 'admin_users');
    if (!adminUsersTable) {
      throw new Error('Admin users table not found');
    }

    const initialLength = adminUsersTable.data.length;
    adminUsersTable.data = adminUsersTable.data.filter(user => user.id !== id);
    const deleted = adminUsersTable.data.length < initialLength;
    
    if (deleted) {
      this.connection.lastUpdated = new Date().toISOString();
      this.saveDatabase();
    }
    
    return deleted;
  }

  // Rides Table Operations
  public getAllRides(): RideData[] {
    const ridesTable = this.connection.tables.find(table => table.name === 'rides');
    return ridesTable ? ridesTable.data : [];
  }

  public addRide(ride: Omit<RideData, 'id' | 'createdAt'>): RideData {
    const ridesTable = this.connection.tables.find(table => table.name === 'rides');
    if (!ridesTable) {
      throw new Error('Rides table not found');
    }

    const newRide: RideData = {
      id: this.generateId(),
      ...ride,
      createdAt: new Date().toISOString(),
    };

    ridesTable.data.push(newRide);
    this.connection.lastUpdated = new Date().toISOString();
    this.saveDatabase();
    return newRide;
  }

  // Bookings Table Operations
  public getAllBookings(): BookingData[] {
    const bookingsTable = this.connection.tables.find(table => table.name === 'bookings');
    return bookingsTable ? bookingsTable.data : [];
  }

  public addBooking(booking: Omit<BookingData, 'id'>): BookingData {
    const bookingsTable = this.connection.tables.find(table => table.name === 'bookings');
    if (!bookingsTable) {
      throw new Error('Bookings table not found');
    }

    const newBooking: BookingData = {
      id: this.generateId(),
      ...booking,
    };

    bookingsTable.data.push(newBooking);
    this.connection.lastUpdated = new Date().toISOString();
    this.saveDatabase();
    return newBooking;
  }

  // Transactions Table Operations
  public getAllTransactions(): TransactionData[] {
    const transactionsTable = this.connection.tables.find(table => table.name === 'transactions');
    return transactionsTable ? transactionsTable.data : [];
  }

  public addTransaction(transaction: Omit<TransactionData, 'id' | 'createdAt'>): TransactionData {
    const transactionsTable = this.connection.tables.find(table => table.name === 'transactions');
    if (!transactionsTable) {
      throw new Error('Transactions table not found');
    }

    const newTransaction: TransactionData = {
      id: this.generateId(),
      ...transaction,
      createdAt: new Date().toISOString(),
    };

    transactionsTable.data.push(newTransaction);
    this.connection.lastUpdated = new Date().toISOString();
    this.saveDatabase();
    return newTransaction;
  }

  // Database Statistics
  public getDatabaseStats() {
    const adminUsers = this.getAllAdminUsers();
    const rides = this.getAllRides();
    const bookings = this.getAllBookings();
    const transactions = this.getAllTransactions();

    const activeUsers = adminUsers.filter(u => u.status === 'active').length;
    const inactiveUsers = adminUsers.length - activeUsers;

    const roleDistribution = adminUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<AdminRole, number>);

    return {
      totalAdminUsers: adminUsers.length,
      activeUsers,
      inactiveUsers,
      roleDistribution,
      totalRides: rides.length,
      totalBookings: bookings.length,
      totalTransactions: transactions.length,
      databaseSize: JSON.stringify(this.connection).length,
      lastUpdated: this.connection.lastUpdated,
    };
  }

  // Seed database with real sample data
  public seedDatabase(): void {
    const adminUsersTable = this.connection.tables.find(table => table.name === 'admin_users');
    const ridesTable = this.connection.tables.find(table => table.name === 'rides');
    const bookingsTable = this.connection.tables.find(table => table.name === 'bookings');
    const transactionsTable = this.connection.tables.find(table => table.name === 'transactions');

    if (adminUsersTable && adminUsersTable.data.length === 0) {
      // Seed admin users
      const sampleAdminUsers: AdminUser[] = [
        {
          id: this.generateId(),
          name: 'Super Admin',
          email: 'admin@hushryd.com',
          password: 'admin123',
          role: 'superadmin',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          department: 'IT',
          permissions: ['all'],
        },
        {
          id: this.generateId(),
          name: 'Sarah Johnson',
          email: 'sarah.support@hushryd.com',
          password: 'support123',
          role: 'support',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          department: 'Support',
          permissions: ['tickets', 'support', 'users'],
        },
        {
          id: this.generateId(),
          name: 'Michael Chen',
          email: 'michael.finance@hushryd.com',
          password: 'finance123',
          role: 'finance',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          department: 'Finance',
          permissions: ['finance', 'transactions', 'payouts'],
        },
        {
          id: this.generateId(),
          name: 'Emma Davis',
          email: 'emma.manager@hushryd.com',
          password: 'manager123',
          role: 'manager',
          status: 'active',
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          department: 'Operations',
          permissions: ['rides', 'bookings', 'analytics'],
        },
      ];

      adminUsersTable.data = sampleAdminUsers;
    }

    if (ridesTable && ridesTable.data.length === 0) {
      // Seed rides data
      const sampleRides: RideData[] = [
        {
          id: this.generateId(),
          driverId: 'driver1',
          passengerId: 'passenger1',
          from: 'Downtown',
          to: 'Airport',
          distance: 15.5,
          fare: 25.00,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 86300000).toISOString(),
        },
        {
          id: this.generateId(),
          driverId: 'driver2',
          passengerId: 'passenger2',
          from: 'Mall',
          to: 'University',
          distance: 8.2,
          fare: 12.50,
          status: 'in_progress',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      ridesTable.data = sampleRides;
    }

    if (bookingsTable && bookingsTable.data.length === 0) {
      // Seed bookings data
      const sampleBookings: BookingData[] = [
        {
          id: this.generateId(),
          userId: 'passenger1',
          rideId: 'ride1',
          bookingDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'confirmed',
          paymentStatus: 'paid',
          amount: 25.00,
        },
        {
          id: this.generateId(),
          userId: 'passenger2',
          rideId: 'ride2',
          bookingDate: new Date(Date.now() - 3600000).toISOString(),
          status: 'pending',
          paymentStatus: 'pending',
          amount: 12.50,
        },
      ];

      bookingsTable.data = sampleBookings;
    }

    if (transactionsTable && transactionsTable.data.length === 0) {
      // Seed transactions data
      const sampleTransactions: TransactionData[] = [
        {
          id: this.generateId(),
          userId: 'passenger1',
          type: 'payment',
          amount: 25.00,
          status: 'completed',
          description: 'Ride payment',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          processedAt: new Date(Date.now() - 86300000).toISOString(),
        },
        {
          id: this.generateId(),
          userId: 'driver1',
          type: 'payout',
          amount: 20.00,
          status: 'pending',
          description: 'Driver payout',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];

      transactionsTable.data = sampleTransactions;
    }

    this.connection.lastUpdated = new Date().toISOString();
    this.saveDatabase();
  }

  public clearDatabase(): void {
    this.connection.tables.forEach(table => {
      table.data = [];
    });
    this.connection.lastUpdated = new Date().toISOString();
    this.saveDatabase();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Get table schema
  public getTableSchema(tableName: string) {
    const table = this.connection.tables.find(t => t.name === tableName);
    return table ? { name: table.name, columns: table.columns } : null;
  }

  // Get all tables
  public getAllTables() {
    return this.connection.tables.map(table => ({
      name: table.name,
      columns: table.columns,
      rowCount: table.data.length
    }));
  }
}

export const realDatabaseService = RealDatabaseService.getInstance();
