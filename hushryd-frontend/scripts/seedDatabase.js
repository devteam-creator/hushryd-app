// Database Migration Script
// This script will seed the database with users having different roles

console.log('🌱 Starting database migration...');

// Import the database service
const { databaseService } = require('../services/databaseService');

// Run the migration
function runMigration() {
  try {
    console.log('📊 Checking current database state...');
    
    // Check if database is empty
    const currentUsers = databaseService.getAllUsers();
    console.log(`Current users in database: ${currentUsers.length}`);
    
    if (currentUsers.length === 0) {
      console.log('🔄 Database is empty, running seed migration...');
      databaseService.seedDatabase();
      
      // Verify the migration
      const newUsers = databaseService.getAllUsers();
      const stats = databaseService.getDatabaseStats();
      
      console.log('✅ Database migration completed successfully!');
      console.log(`📈 Migration Results:`);
      console.log(`   - Total users created: ${newUsers.length}`);
      console.log(`   - Active users: ${stats.activeUsers}`);
      console.log(`   - Inactive users: ${stats.inactiveUsers}`);
      console.log(`   - Users by role:`);
      
      Object.entries(stats.usersByRole).forEach(([role, count]) => {
        console.log(`     - ${role}: ${count} users`);
      });
      
    } else {
      console.log('⚠️  Database already contains users. Skipping migration.');
      console.log('💡 To reset and re-seed, clear the database first.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
runMigration();

console.log('🎉 Migration script completed!');
