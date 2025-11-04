// Database Connection Test Script
// This script tests the connection to your local MySQL database

import { getDatabaseConfig } from './config';
import { connect, disconnect } from './connection';

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');

  try {
    // Get configuration
    const config = getDatabaseConfig();
    console.log('📋 Configuration:');
    console.log(`   Type: ${config.type}`);
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.username || 'root'}`);
    console.log(`   Password: ${config.password ? '***' : '(empty)'}\n`);

    // Test connection
    console.log('🔌 Connecting to database...');
    const connection = await connect();
    console.log('✅ Connection established successfully!\n');

    // Test query
    console.log('📊 Testing query...');
    const result = await connection.query('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Query executed successfully!');
    console.log('   Result:', result.rows[0]);
    console.log('');

    // Test database info
    console.log('📋 Database Information:');
    const dbInfo = await connection.query('SELECT DATABASE() as current_db, VERSION() as mysql_version');
    console.log(`   Current Database: ${dbInfo.rows[0].current_db}`);
    console.log(`   MySQL Version: ${dbInfo.rows[0].mysql_version}`);
    console.log('');

    // Test table creation (if database is empty)
    console.log('🏗️  Checking for existing tables...');
    const tables = await connection.query('SHOW TABLES');
    
    if (tables.rows.length === 0) {
      console.log('   No tables found. Database is empty.');
      console.log('   Run "npm run setup:database" to create tables.');
    } else {
      console.log(`   Found ${tables.rows.length} tables:`);
      tables.rows.forEach((table: any) => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }

    // Close connection
    await disconnect();
    console.log('\n✅ Database connection test completed successfully!');
    console.log('\n🎉 Your local MySQL database is ready to use!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run "npm run setup:database" to create tables');
    console.log('   2. Start using the HushRyd application');
    console.log('   3. View data in phpMyAdmin: http://localhost/phpmyadmin');

  } catch (error) {
    console.error('❌ Database connection test failed!');
    console.error('   Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure MySQL server is running');
    console.log('   2. Check if database "hushryd" exists');
    console.log('   3. Verify username/password in .env file');
    console.log('   4. Check MySQL port (default: 3306)');
    console.log('   5. Ensure MySQL service is started');
    console.log('\n📖 For detailed setup instructions, see:');
    console.log('   database/LOCAL_SETUP_GUIDE.md');
  }
}

// Run the test
if (require.main === module) {
  testDatabaseConnection().catch(console.error);
}

export { testDatabaseConnection };
