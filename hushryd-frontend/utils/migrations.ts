import { realDatabaseService } from '../services/realDatabaseService';

export interface MigrationResult {
  success: boolean;
  message: string;
  usersCreated?: number;
  stats?: any;
}

export class MigrationService {
  private static instance: MigrationService;

  public static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  /**
   * Run the initial database migration to seed users
   */
  public runInitialMigration(): MigrationResult {
    try {
      console.log('🌱 Starting database migration...');
      
      // Check current state
      const currentUsers = realDatabaseService.getAllAdminUsers();
      console.log(`Current admin users in database: ${currentUsers.length}`);
      
      if (currentUsers.length === 0) {
        console.log('🔄 Database is empty, running seed migration...');
        realDatabaseService.seedDatabase();
        
        // Get results
        const newUsers = realDatabaseService.getAllAdminUsers();
        const stats = realDatabaseService.getDatabaseStats();
        
        console.log('✅ Database migration completed successfully!');
        console.log(`📈 Migration Results:`);
        console.log(`   - Total users created: ${newUsers.length}`);
        console.log(`   - Active users: ${stats.activeUsers}`);
        console.log(`   - Inactive users: ${stats.inactiveUsers}`);
        
        return {
          success: true,
          message: `Migration completed successfully! Created ${newUsers.length} users.`,
          usersCreated: newUsers.length,
          stats: stats,
        };
      } else {
        return {
          success: false,
          message: 'Database already contains users. Migration skipped.',
          usersCreated: currentUsers.length,
          stats: realDatabaseService.getDatabaseStats(),
        };
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        message: `Migration failed: ${error}`,
      };
    }
  }

  /**
   * Force re-seed the database (clears existing data)
   */
  public forceReseed(): MigrationResult {
    try {
      console.log('🔄 Force re-seeding database...');
      
      // Clear existing data
      realDatabaseService.clearDatabase();
      
      // Run seed
      realDatabaseService.seedDatabase();
      
      const newUsers = realDatabaseService.getAllAdminUsers();
      const stats = realDatabaseService.getDatabaseStats();
      
      return {
        success: true,
        message: `Database re-seeded successfully! Created ${newUsers.length} users.`,
        usersCreated: newUsers.length,
        stats: stats,
      };
      
    } catch (error) {
      console.error('❌ Force re-seed failed:', error);
      return {
        success: false,
        message: `Force re-seed failed: ${error}`,
      };
    }
  }

  /**
   * Get migration status
   */
  public getMigrationStatus(): MigrationResult {
    try {
      const stats = realDatabaseService.getDatabaseStats();
      
      return {
        success: true,
        message: `Database status: ${stats.totalAdminUsers} users found.`,
        usersCreated: stats.totalAdminUsers,
        stats: stats,
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to get migration status: ${error}`,
      };
    }
  }
}

export const migrationService = MigrationService.getInstance();

// Export migration functions for easy use
export const runInitialMigration = () => migrationService.runInitialMigration();
export const forceReseed = () => migrationService.forceReseed();
export const getMigrationStatus = () => migrationService.getMigrationStatus();
