const { executeQuery } = require('../config/database');

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Database for Authentication...\n');

    // Create users table with password column
    console.log('1️⃣ Creating users table with password column...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE,
        role ENUM('user', 'driver', 'admin') NOT NULL DEFAULT 'user',
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Users table created with password column');

    // Create admins table with password column
    console.log('2️⃣ Creating admins table with password column...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        role ENUM('superadmin', 'admin', 'support', 'manager') NOT NULL DEFAULT 'admin',
        permissions JSON,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Admins table created with password column');

    // Check if password column exists in users table
    console.log('3️⃣ Checking password column in users table...');
    const userColumns = await executeQuery(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'password'
    `);

    if (userColumns.length === 0) {
      console.log('⚠️ Password column missing in users table, adding...');
      await executeQuery(`
        ALTER TABLE users 
        ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'password123'
      `);
      console.log('✅ Password column added to users table');
    } else {
      console.log('✅ Password column exists in users table');
    }

    // Check if password column exists in admins table
    console.log('4️⃣ Checking password column in admins table...');
    const adminColumns = await executeQuery(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'admins' 
      AND COLUMN_NAME = 'password'
    `);

    if (adminColumns.length === 0) {
      console.log('⚠️ Password column missing in admins table, adding...');
      await executeQuery(`
        ALTER TABLE admins 
        ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'admin123'
      `);
      console.log('✅ Password column added to admins table');
    } else {
      console.log('✅ Password column exists in admins table');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Tables created/verified:');
    console.log('  • users - with password column');
    console.log('  • admins - with password column');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Run setup
setupDatabase();
