import { comprehensiveDatabaseService } from '../services/comprehensiveDatabaseService';
import { migrationService } from '../utils/migrations';

/**
 * Run database migrations and seed data
 */
async function runMigrations() {
  try {
    console.log('🚀 Starting database migration process...');
    
    // Clear existing data first
    console.log('🧹 Clearing existing database...');
    comprehensiveDatabaseService.clearDatabase();
    
    // Run initial migration (create tables)
    console.log('📊 Running initial migration...');
    const migrationResult = migrationService.runInitialMigration();
    
    if (migrationResult.success) {
      console.log('✅ Initial migration completed successfully!');
      console.log(`📈 Created ${migrationResult.usersCreated} users`);
    } else {
      console.log('⚠️ Initial migration result:', migrationResult.message);
    }
    
    // Seed comprehensive database with sample data
    console.log('🌱 Seeding comprehensive database...');
    comprehensiveDatabaseService.seedDatabase();
    
    // Get final statistics
    const stats = comprehensiveDatabaseService.getDatabaseStats();
    console.log('\n📊 Final Database Statistics:');
    console.log(`   👥 Total Users: ${stats.totalUsers}`);
    console.log(`   🚗 Total Drivers: ${stats.totalDrivers}`);
    console.log(`   🚗 Total Rides: ${stats.totalRides}`);
    console.log(`   📋 Total Bookings: ${stats.totalBookings}`);
    console.log(`   💳 Total Transactions: ${stats.totalTransactions}`);
    console.log(`   💰 Total Revenue: ₹${stats.totalRevenue.toLocaleString()}`);
    console.log(`   ⭐ Total Reviews: ${stats.totalReviews}`);
    console.log(`   📊 Average Rating: ${stats.averageRating.toFixed(1)}`);
    
    console.log('\n🎉 Database migration and seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Force re-seed the database
 */
async function forceReseed() {
  try {
    console.log('🔄 Force re-seeding database...');
    
    // Clear existing data
    comprehensiveDatabaseService.clearDatabase();
    
    // Force re-seed
    const reseedResult = migrationService.forceReseed();
    
    if (reseedResult.success) {
      console.log('✅ Force re-seed completed successfully!');
      console.log(`📈 Created ${reseedResult.usersCreated} users`);
    } else {
      console.log('⚠️ Force re-seed result:', reseedResult.message);
    }
    
    // Seed comprehensive database
    comprehensiveDatabaseService.seedDatabase();
    
    console.log('🎉 Force re-seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Force re-seed failed:', error);
    throw error;
  }
}

/**
 * Get migration status
 */
async function getMigrationStatus() {
  try {
    console.log('📊 Getting migration status...');
    
    const status = migrationService.getMigrationStatus();
    
    if (status.success) {
      console.log('✅ Migration status:', status.message);
      console.log(`📈 Users in database: ${status.usersCreated}`);
    } else {
      console.log('⚠️ Migration status:', status.message);
    }
    
    // Get comprehensive database stats
    const stats = comprehensiveDatabaseService.getDatabaseStats();
    console.log('\n📊 Comprehensive Database Statistics:');
    console.log(`   👥 Total Users: ${stats.totalUsers}`);
    console.log(`   🚗 Total Drivers: ${stats.totalDrivers}`);
    console.log(`   🚗 Total Rides: ${stats.totalRides}`);
    console.log(`   📋 Total Bookings: ${stats.totalBookings}`);
    console.log(`   💳 Total Transactions: ${stats.totalTransactions}`);
    console.log(`   💰 Total Revenue: ₹${stats.totalRevenue.toLocaleString()}`);
    console.log(`   ⭐ Total Reviews: ${stats.totalReviews}`);
    console.log(`   📊 Average Rating: ${stats.averageRating.toFixed(1)}`);
    
  } catch (error) {
    console.error('❌ Failed to get migration status:', error);
    throw error;
  }
}

// Export functions for use
export { forceReseed, getMigrationStatus, runMigrations };

// Run migrations if this file is executed directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      runMigrations();
      break;
    case 'reseed':
      forceReseed();
      break;
    case 'status':
      getMigrationStatus();
      break;
    default:
      console.log('Usage:');
      console.log('  npm run migrate    - Run database migrations');
      console.log('  npm run reseed     - Force re-seed database');
      console.log('  npm run status     - Get migration status');
      break;
  }
}
