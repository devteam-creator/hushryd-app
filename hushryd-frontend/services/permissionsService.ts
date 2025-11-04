import { ADMIN_PAGES, DEFAULT_ROLE_PERMISSIONS, PagePermission, PermissionSettings } from '../types/permissions';

export class PermissionsService {
  private static instance: PermissionsService;
  private permissions: PermissionSettings;

  public static getInstance(): PermissionsService {
    if (!PermissionsService.instance) {
      PermissionsService.instance = new PermissionsService();
    }
    return PermissionsService.instance;
  }

  constructor() {
    this.permissions = this.loadPermissions();
  }

  private loadPermissions(): PermissionSettings {
    try {
      // In a real app, this would load from backend/database
      // For now, we'll use localStorage for web and AsyncStorage for mobile
      const stored = typeof window !== 'undefined' ? 
        localStorage.getItem('role_permissions') : 
        null;
      
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }

    // Return default permissions if none stored
    return {
      roles: DEFAULT_ROLE_PERMISSIONS,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system',
    };
  }

  private savePermissions(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('role_permissions', JSON.stringify(this.permissions));
      }
      // In a real app, this would save to backend/database
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  }

  public getRolePermissions(role: string): PagePermission[] {
    const rolePermissions = this.permissions.roles.find(r => r.role === role);
    return rolePermissions ? rolePermissions.permissions : [];
  }

  public hasPageAccess(role: string, pageId: string): boolean {
    const rolePermissions = this.getRolePermissions(role);
    const pagePermission = rolePermissions.find(p => p.pageId === pageId);
    return pagePermission ? pagePermission.allowed : false;
  }

  public updateRolePermissions(role: string, permissions: PagePermission[], updatedBy: string): void {
    const roleIndex = this.permissions.roles.findIndex(r => r.role === role);
    
    if (roleIndex !== -1) {
      this.permissions.roles[roleIndex].permissions = permissions;
    } else {
      this.permissions.roles.push({ role, permissions });
    }

    this.permissions.lastUpdated = new Date().toISOString();
    this.permissions.updatedBy = updatedBy;
    
    this.savePermissions();
  }

  public getAllPermissions(): PermissionSettings {
    return { ...this.permissions };
  }

  public resetToDefaults(): void {
    this.permissions = {
      roles: DEFAULT_ROLE_PERMISSIONS,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system',
    };
    this.savePermissions();
  }

  public getAvailableRoles(): string[] {
    return ['superadmin', 'admin', 'manager', 'support', 'finance'];
  }

  public getPageInfo(pageId: string) {
    return ADMIN_PAGES.find(page => page.id === pageId);
  }
}

export const permissionsService = PermissionsService.getInstance();
