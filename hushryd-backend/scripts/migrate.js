const { executeQuery } = require('../config/database');

async function runMigrations() {
  try {
    console.log('🚀 Running Database Migrations...\n');

    // Create migrations table to track migration history
    console.log('1️⃣ Creating migrations tracking table...');
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        version VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Migrations table created');

    // Check if migrations have been run
    const existingMigrations = await executeQuery('SELECT version FROM migrations');
    const executedVersions = existingMigrations.map(m => m.version);

    // Migration 001: Create admins table
    if (!executedVersions.includes('001')) {
      console.log('\n2️⃣ Running migration 001: Create admins table...');
      
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('superadmin', 'admin', 'support', 'manager') NOT NULL DEFAULT 'admin',
          permissions JSON,
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Record migration
      await executeQuery(
        'INSERT INTO migrations (version, name) VALUES (?, ?)',
        ['001', 'create_admins_table']
      );
      
      console.log('✅ Migration 001 completed: Admins table created');
    } else {
      console.log('⚠️ Migration 001 already executed, skipping...');
    }

    // Migration 002: Create users table
    if (!executedVersions.includes('002')) {
      console.log('\n3️⃣ Running migration 002: Create users table...');
      
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20) UNIQUE,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          role ENUM('user', 'driver', 'admin') NOT NULL DEFAULT 'user',
          is_verified BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          profile_image TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Record migration
      await executeQuery(
        'INSERT INTO migrations (version, name) VALUES (?, ?)',
        ['002', 'create_users_table']
      );
      
      console.log('✅ Migration 002 completed: Users table created');
    } else {
      console.log('⚠️ Migration 002 already executed, skipping...');
    }

    // Migration 003: Create rides table
    if (!executedVersions.includes('003')) {
      console.log('\n4️⃣ Running migration 003: Create rides table...');
      
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS rides (
          id VARCHAR(36) PRIMARY KEY,
          driver_id VARCHAR(36) NOT NULL,
          from_latitude DECIMAL(10, 8) NOT NULL,
          from_longitude DECIMAL(11, 8) NOT NULL,
          from_address TEXT NOT NULL,
          from_city VARCHAR(100) NOT NULL,
          from_state VARCHAR(100) NOT NULL,
          from_country VARCHAR(100) NOT NULL,
          from_postal_code VARCHAR(20),
          to_latitude DECIMAL(10, 8) NOT NULL,
          to_longitude DECIMAL(11, 8) NOT NULL,
          to_address TEXT NOT NULL,
          to_city VARCHAR(100) NOT NULL,
          to_state VARCHAR(100) NOT NULL,
          to_country VARCHAR(100) NOT NULL,
          to_postal_code VARCHAR(20),
          departure_time TIMESTAMP NOT NULL,
          arrival_time TIMESTAMP,
          price DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'INR',
          max_passengers INT DEFAULT 4,
          available_seats INT DEFAULT 4,
          status ENUM('scheduled', 'active', 'completed', 'cancelled') DEFAULT 'scheduled',
          vehicle_make VARCHAR(100),
          vehicle_model VARCHAR(100),
          vehicle_year YEAR,
          vehicle_color VARCHAR(50),
          vehicle_license_plate VARCHAR(20),
          vehicle_capacity INT,
          vehicle_features JSON,
          route_id VARCHAR(36),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Record migration
      await executeQuery(
        'INSERT INTO migrations (version, name) VALUES (?, ?)',
        ['003', 'create_rides_table']
      );
      
      console.log('✅ Migration 003 completed: Rides table created');
    } else {
      console.log('⚠️ Migration 003 already executed, skipping...');
    }

    // Migration 004: Create bookings table
    if (!executedVersions.includes('004')) {
      console.log('\n5️⃣ Running migration 004: Create bookings table...');
      
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS bookings (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          ride_id VARCHAR(36) NOT NULL,
          passenger_count INT DEFAULT 1,
          total_price DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'INR',
          status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
          payment_status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
          payment_method VARCHAR(50),
          special_requests TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Record migration
      await executeQuery(
        'INSERT INTO migrations (version, name) VALUES (?, ?)',
        ['004', 'create_bookings_table']
      );
      
      console.log('✅ Migration 004 completed: Bookings table created');
    } else {
      console.log('⚠️ Migration 004 already executed, skipping...');
    }

    // Migration 005: Create transactions table
    if (!executedVersions.includes('005')) {
      console.log('\n6️⃣ Running migration 005: Create transactions table...');
      
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS transactions (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          type ENUM('payment', 'refund', 'payout', 'commission') NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'INR',
          status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
          description TEXT,
          reference_id VARCHAR(100),
          payment_method VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Record migration
      await executeQuery(
        'INSERT INTO migrations (version, name) VALUES (?, ?)',
        ['005', 'create_transactions_table']
      );
      
      console.log('✅ Migration 005 completed: Transactions table created');
    } else {
      console.log('⚠️ Migration 005 already executed, skipping...');
    }

    // Show migration status
    console.log('\n📊 Migration Status:');
    const allMigrations = await executeQuery(`
      SELECT version, name, executed_at 
      FROM migrations 
      ORDER BY version
    `);
    
    allMigrations.forEach(migration => {
      console.log(`  ✅ ${migration.version}: ${migration.name} (${migration.executed_at})`);
    });

    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📋 Database tables created:');
    console.log('  • admins - Admin users and authentication');
    console.log('  • users - Regular users and drivers');
    console.log('  • rides - Ride information and scheduling');
    console.log('  • bookings - User ride bookings');
    console.log('  • transactions - Payment and financial transactions');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();
