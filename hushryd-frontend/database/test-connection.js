// Database Connection Test Script (JavaScript)
// This script tests the connection to your local MySQL database

const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');

  try {
    // Database configuration
    const config = {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'hushryd',
      charset: 'utf8mb4',
      timezone: 'UTC'
    };

    console.log('📋 Configuration:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Database: ${config.database}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Password: ${config.password ? '***' : '(empty)'}\n`);

    // Test connection
    console.log('🔌 Connecting to database...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection established successfully!\n');

    // Test query
    console.log('📊 Testing query...');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Query executed successfully!');
    console.log('   Result:', rows[0]);
    console.log('');

    // Test database info
    console.log('📋 Database Information:');
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as mysql_version');
    console.log(`   Current Database: ${dbInfo[0].current_db}`);
    console.log(`   MySQL Version: ${dbInfo[0].mysql_version}`);
    console.log('');

    // Test table creation (if database is empty)
    console.log('🏗️  Checking for existing tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('   No tables found. Database is empty.');
      console.log('   Run "npm run setup:database" to create tables.');
    } else {
      console.log(`   Found ${tables.length} tables:`);
      tables.forEach((table) => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    }

    // Close connection
    await connection.end();
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
testDatabaseConnection().catch(console.error);
