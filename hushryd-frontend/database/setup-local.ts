import { initializeDatabase, checkDatabaseHealth, createDatabaseService } from './database';

// Local MySQL Database Setup Script
async function setupLocalDatabase() {
  console.log('🚀 Setting up HushRyd Database on Local MySQL...\n');

  try {
    // Step 1: Check database health
    console.log('📊 Checking database connection...');
    const isHealthy = await checkDatabaseHealth();
    
    if (!isHealthy) {
      console.error('❌ Database connection failed!');
      console.log('\n🔧 Please check the following:');
      console.log('1. MySQL server is running on localhost:3306');
      console.log('2. Database "hushryd" exists in phpMyAdmin');
      console.log('3. User "root" has proper permissions');
      console.log('4. No password is required (or update .env file)');
      console.log('\n📝 To create the database in phpMyAdmin:');
      console.log('   - Open phpMyAdmin (http://localhost/phpmyadmin)');
      console.log('   - Click "New" to create a new database');
      console.log('   - Name it "hushryd"');
      console.log('   - Set collation to "utf8mb4_unicode_ci"');
      return;
    }

    console.log('✅ Database connection successful!\n');

    // Step 2: Initialize database schema
    console.log('🏗️  Initializing database schema...');
    await initializeDatabase();
    console.log('✅ Database schema initialized successfully!\n');

    // Step 3: Test database operations
    console.log('🧪 Testing database operations...');
    const dbService = await createDatabaseService();

    // Create a test user
    const testUser = await dbService.createUser({
      email: 'admin@hushryd.local',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+919876543210',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    console.log('✅ Test user created:', testUser.email);

    // Create emergency contact
    const emergencyContact = await dbService.createEmergencyContact({
      userId: testUser.id,
      name: 'Emergency Contact',
      phone: '+919876543220',
      relationship: 'Family',
      isPrimary: true
    });
    console.log('✅ Emergency contact created:', emergencyContact.name);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Your database is ready for the HushRyd application');
    console.log('2. You can view the data in phpMyAdmin');
    console.log('3. Start using the application with database integration');
    console.log('\n🔗 Access your database at: http://localhost/phpmyadmin');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure MySQL is running');
    console.log('2. Check database credentials');
    console.log('3. Verify database exists');
    console.log('4. Check user permissions');
  }
}

// Run the setup
if (require.main === module) {
  setupLocalDatabase().catch(console.error);
}

export { setupLocalDatabase };
