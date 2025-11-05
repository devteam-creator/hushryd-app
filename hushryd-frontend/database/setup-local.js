// Local MySQL Database Setup Script (JavaScript)
// This script sets up the HushRyd database on your local MySQL server

const mysql = require('mysql2/promise');

// Database configuration
const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hushryd',
  charset: 'utf8mb4',
  timezone: 'UTC',
  multipleStatements: true
};

// Database schema
const schema = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) UNIQUE,
      is_verified BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      role VARCHAR(50) NOT NULL,
      profile_image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  
  emergency_contacts: `
    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      relationship VARCHAR(255),
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  
  rides: `
    CREATE TABLE IF NOT EXISTS rides (
      id VARCHAR(255) PRIMARY KEY,
      driver_id VARCHAR(255) NOT NULL,
      from_latitude DECIMAL(10, 8) NOT NULL,
      from_longitude DECIMAL(11, 8) NOT NULL,
      from_address TEXT NOT NULL,
      from_city VARCHAR(255),
      from_state VARCHAR(255),
      from_country VARCHAR(255),
      from_postal_code VARCHAR(20),
      to_latitude DECIMAL(10, 8) NOT NULL,
      to_longitude DECIMAL(11, 8) NOT NULL,
      to_address TEXT NOT NULL,
      to_city VARCHAR(255),
      to_state VARCHAR(255),
      to_country VARCHAR(255),
      to_postal_code VARCHAR(20),
      departure_time TIMESTAMP NOT NULL,
      arrival_time TIMESTAMP,
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      max_passengers INT NOT NULL,
      available_seats INT NOT NULL,
      status VARCHAR(50) NOT NULL,
      vehicle_make VARCHAR(255),
      vehicle_model VARCHAR(255),
      vehicle_year INT,
      vehicle_color VARCHAR(255),
      vehicle_license_plate VARCHAR(255),
      vehicle_capacity INT,
      vehicle_features JSON,
      route_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  
  bookings: `
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      ride_id VARCHAR(255) NOT NULL,
      passenger_count INT NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment_status VARCHAR(50) NOT NULL,
      payment_method VARCHAR(255),
      special_requests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  
  sos_alerts: `
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      ride_id VARCHAR(255),
      latitude DECIMAL(10, 8) NOT NULL,
      longitude DECIMAL(11, 8) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(255),
      state VARCHAR(255),
      country VARCHAR(255),
      postal_code VARCHAR(20),
      type VARCHAR(50) NOT NULL,
      message TEXT,
      status VARCHAR(50) NOT NULL,
      priority VARCHAR(50) NOT NULL,
      resolved_by VARCHAR(255),
      resolved_at TIMESTAMP,
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  
  admins: `
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      permissions JSON,
      is_active BOOLEAN DEFAULT TRUE,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  
  migrations: `
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      version VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `
};

async function setupLocalDatabase() {
  console.log('🚀 Setting up HushRyd Database on Local MySQL...\n');

  let connection;
  
  try {
    // Step 1: Check database connection
    console.log('📊 Checking database connection...');
    connection = await mysql.createConnection(config);
    console.log('✅ Database connection successful!\n');

    // Step 2: Create tables
    console.log('🏗️  Creating database tables...');
    
    const tableOrder = ['users', 'emergency_contacts', 'rides', 'bookings', 'sos_alerts', 'admins', 'migrations'];
    
    for (const tableName of tableOrder) {
      if (schema[tableName]) {
        await connection.execute(schema[tableName]);
        console.log(`   ✅ Created table: ${tableName}`);
      }
    }
    
    console.log('✅ All tables created successfully!\n');

    // Step 3: Insert sample data
    console.log('📝 Inserting sample data...');
    
    // Insert sample users
    await connection.execute(`
      INSERT IGNORE INTO users (id, email, first_name, last_name, phone, role, is_verified, is_active) VALUES
      ('user-001', 'john.doe@example.com', 'John', 'Doe', '+919876543210', 'user', 1, 1),
      ('driver-001', 'jane.smith@example.com', 'Jane', 'Smith', '+919876543211', 'driver', 1, 1),
      ('admin-001', 'admin@hushryd.com', 'Admin', 'User', '+919876543212', 'admin', 1, 1)
    `);
    console.log('   ✅ Sample users created');

    // Insert sample emergency contacts
    await connection.execute(`
      INSERT IGNORE INTO emergency_contacts (id, user_id, name, phone, relationship, is_primary) VALUES
      ('ec-001', 'user-001', 'Emergency Contact 1', '+919876543220', 'Family', 1),
      ('ec-002', 'user-001', 'Emergency Contact 2', '+919876543221', 'Friend', 0)
    `);
    console.log('   ✅ Sample emergency contacts created');

    // Insert sample rides
    await connection.execute(`
      INSERT IGNORE INTO rides (id, driver_id, from_latitude, from_longitude, from_address, from_city, from_state, from_country,
                                to_latitude, to_longitude, to_address, to_city, to_state, to_country,
                                departure_time, price, currency, max_passengers, available_seats, status,
                                vehicle_make, vehicle_model, vehicle_year, vehicle_color, vehicle_license_plate, vehicle_capacity) VALUES
      ('ride-001', 'driver-001', 17.3850, 78.4867, 'Hyderabad Central', 'Hyderabad', 'Telangana', 'India',
                               13.0827, 80.2707, 'Chennai Central', 'Chennai', 'Tamil Nadu', 'India',
                               DATE_ADD(NOW(), INTERVAL 2 HOUR), 2500.00, 'INR', 4, 3, 'scheduled',
                               'Toyota', 'Innova', 2022, 'White', 'TS09AB1234', 7)
    `);
    console.log('   ✅ Sample rides created');

    // Insert sample admin
    await connection.execute(`
      INSERT IGNORE INTO admins (id, email, first_name, last_name, role, permissions, is_active) VALUES
      ('admin-001', 'admin@hushryd.com', 'Admin', 'User', 'superadmin', '{"all": true}', 1)
    `);
    console.log('   ✅ Sample admin created');

    // Record migration
    await connection.execute(`
      INSERT IGNORE INTO migrations (version, name) VALUES
      ('001', 'create_initial_schema'),
      ('002', 'insert_sample_data')
    `);
    console.log('   ✅ Migration records created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Database Summary:');
    
    // Show table counts
    const tables = ['users', 'emergency_contacts', 'rides', 'bookings', 'sos_alerts', 'admins'];
    for (const table of tables) {
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`   ${table}: ${count[0].count} records`);
    }

    console.log('\n📝 Next steps:');
    console.log('1. Your database is ready for the HushRyd application');
    console.log('2. You can view the data in phpMyAdmin');
    console.log('3. Start using the application with database integration');
    console.log('\n🔗 Access your database at: http://localhost/phpmyadmin');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure MySQL is running');
    console.log('2. Check database credentials');
    console.log('3. Verify database exists');
    console.log('4. Check user permissions');
    console.log('\n📖 For detailed setup instructions, see:');
    console.log('   database/LOCAL_SETUP_GUIDE.md');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
if (require.main === module) {
  setupLocalDatabase().catch(console.error);
}

module.exports = { setupLocalDatabase };
