export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'manager' | 'support' | 'finance';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseUsers {
  users: User[];
  lastUpdated: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private users: User[];

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  constructor() {
    this.users = this.loadUsers();
  }

  private loadUsers(): User[] {
    try {
      const stored = typeof window !== 'undefined' ? 
        localStorage.getItem('database_users') : 
        null;
      
      if (stored) {
        const data = JSON.parse(stored);
        return data.users || [];
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }

    return [];
  }

  private saveUsers(): void {
    try {
      if (typeof window !== 'undefined') {
        const data: DatabaseUsers = {
          users: this.users,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem('database_users', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | null {
    return this.users.find(user => user.id === id) || null;
  }

  public getUserByEmail(email: string): User | null {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveUsers();
    return this.users[userIndex];
  }

  public deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.users.splice(userIndex, 1);
    this.saveUsers();
    return true;
  }

  public getUsersByRole(role: string): User[] {
    return this.users.filter(user => user.role === role);
  }

  public seedDatabase(): void {
    const seedUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
      // Super Admin
      {
        name: 'Super Admin',
        email: 'admin@hushryd.com',
        password: 'admin123',
        role: 'superadmin',
        status: 'active',
        lastLogin: '2024-10-11 14:30',
      },
      
      // Support Role Users
      {
        name: 'Sarah Johnson',
        email: 'sarah.support@hushryd.com',
        password: 'support123',
        role: 'support',
        status: 'active',
        lastLogin: '2024-10-11 13:45',
      },
      {
        name: 'Michael Chen',
        email: 'michael.support@hushryd.com',
        password: 'support123',
        role: 'support',
        status: 'active',
        lastLogin: '2024-10-11 12:20',
      },
      {
        name: 'Emma Davis',
        email: 'emma.support@hushryd.com',
        password: 'support123',
        role: 'support',
        status: 'active',
        lastLogin: '2024-10-11 11:15',
      },
      {
        name: 'David Wilson',
        email: 'david.support@hushryd.com',
        password: 'support123',
        role: 'support',
        status: 'inactive',
        lastLogin: '2024-10-08 16:20',
      },

      // Admin Role Users
      {
        name: 'Jennifer Martinez',
        email: 'jennifer.admin@hushryd.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-10-11 14:15',
      },
      {
        name: 'Robert Taylor',
        email: 'robert.admin@hushryd.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-10-11 13:30',
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.admin@hushryd.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-10-11 10:45',
      },

      // Finance Role Users
      {
        name: 'James Brown',
        email: 'james.finance@hushryd.com',
        password: 'finance123',
        role: 'finance',
        status: 'active',
        lastLogin: '2024-10-11 14:00',
      },
      {
        name: 'Maria Garcia',
        email: 'maria.finance@hushryd.com',
        password: 'finance123',
        role: 'finance',
        status: 'active',
        lastLogin: '2024-10-11 13:20',
      },
      {
        name: 'Kevin Lee',
        email: 'kevin.finance@hushryd.com',
        password: 'finance123',
        role: 'finance',
        status: 'active',
        lastLogin: '2024-10-11 12:10',
      },
      {
        name: 'Amanda White',
        email: 'amanda.finance@hushryd.com',
        password: 'finance123',
        role: 'finance',
        status: 'inactive',
        lastLogin: '2024-10-09 15:30',
      },

      // Manager Role Users
      {
        name: 'Christopher Moore',
        email: 'chris.manager@hushryd.com',
        password: 'manager123',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-10-11 13:50',
      },
      {
        name: 'Rachel Thompson',
        email: 'rachel.manager@hushryd.com',
        password: 'manager123',
        role: 'manager',
        status: 'active',
        lastLogin: '2024-10-11 11:40',
      },
    ];

    // Clear existing users and add seed data
    this.users = [];
    
    seedUsers.forEach(userData => {
      this.createUser(userData);
    });

    console.log(`Database seeded with ${seedUsers.length} users`);
    console.log('Users created:', {
      superadmin: this.getUsersByRole('superadmin').length,
      admin: this.getUsersByRole('admin').length,
      manager: this.getUsersByRole('manager').length,
      support: this.getUsersByRole('support').length,
      finance: this.getUsersByRole('finance').length,
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  public clearDatabase(): void {
    this.users = [];
    this.saveUsers();
    console.log('Database cleared');
  }

  public getDatabaseStats(): {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
  } {
    const activeUsers = this.users.filter(user => user.status === 'active').length;
    const inactiveUsers = this.users.filter(user => user.status === 'inactive').length;
    
    const usersByRole = this.users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: this.users.length,
      activeUsers,
      inactiveUsers,
      usersByRole,
    };
  }
}

export const databaseService = DatabaseService.getInstance();
