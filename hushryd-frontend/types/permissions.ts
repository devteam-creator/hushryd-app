export interface PagePermission {
  pageId: string;
  pageName: string;
  allowed: boolean;
}

export interface RolePermissions {
  role: string;
  permissions: PagePermission[];
}

export interface PermissionSettings {
  roles: RolePermissions[];
  lastUpdated: string;
  updatedBy: string;
}

// Default page definitions
export const ADMIN_PAGES = [
  { id: 'dashboard', name: 'Dashboard', description: 'Main admin dashboard' },
  { id: 'users', name: 'User Management', description: 'Manage users and drivers' },
  { id: 'rides', name: 'Ride Management', description: 'Manage rides and bookings' },
  { id: 'bookings', name: 'Booking Management', description: 'View and manage bookings' },
  { id: 'analytics', name: 'Analytics', description: 'View analytics and reports' },
  { id: 'finance', name: 'Finance', description: 'Financial management and reports' },
  { id: 'transactions', name: 'Transactions', description: 'Transaction management' },
  { id: 'payouts', name: 'Payouts', description: 'Driver payout management' },
  { id: 'fares', name: 'Fare Management', description: 'Manage fare structures' },
  { id: 'admins', name: 'Admin Management', description: 'Manage admin users' },
  { id: 'verifications', name: 'Verifications', description: 'User verification management' },
  { id: 'complaints', name: 'Complaints', description: 'Handle user complaints' },
  { id: 'tickets', name: 'Support Tickets', description: 'Support ticket management' },
  { id: 'support', name: 'Support', description: 'Support management' },
  { id: 'sos', name: 'SOS Management', description: 'Emergency SOS management' },
  { id: 'settings', name: 'Settings', description: 'System settings' },
  { id: 'permissions', name: 'Role Permissions', description: 'Manage role permissions' },
  { id: 'database', name: 'Database Management', description: 'Manage database users and data' },
  { id: 'migrations', name: 'Database Migrations', description: 'Run database migrations and seeding' },
];

// Default permissions for each role
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'superadmin',
    permissions: ADMIN_PAGES.map(page => ({
      pageId: page.id,
      pageName: page.name,
      allowed: true, // Super admin has access to everything
    }))
  },
  {
    role: 'admin',
    permissions: ADMIN_PAGES.map(page => ({
      pageId: page.id,
      pageName: page.name,
      allowed: ['dashboard', 'users', 'rides', 'bookings', 'analytics', 'finance', 'transactions', 'payouts', 'settings', 'database', 'migrations'].includes(page.id)
    }))
  },
  {
    role: 'manager',
    permissions: ADMIN_PAGES.map(page => ({
      pageId: page.id,
      pageName: page.name,
      allowed: ['dashboard', 'users', 'rides', 'bookings', 'analytics', 'finance', 'transactions', 'settings'].includes(page.id)
    }))
  },
  {
    role: 'support',
    permissions: ADMIN_PAGES.map(page => ({
      pageId: page.id,
      pageName: page.name,
      allowed: ['dashboard', 'users', 'tickets', 'support', 'complaints', 'settings'].includes(page.id)
    }))
  },
  {
    role: 'finance',
    permissions: ADMIN_PAGES.map(page => ({
      pageId: page.id,
      pageName: page.name,
      allowed: ['dashboard', 'finance', 'transactions', 'payouts', 'fares', 'analytics', 'settings'].includes(page.id)
    }))
  },
];
