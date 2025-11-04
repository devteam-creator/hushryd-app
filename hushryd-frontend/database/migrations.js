// MySQL Migration Runner
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hushryd',
  charset: 'utf8mb4',
  multipleStatements: true
};

// MySQL-specific migrations
const migrations = [
  {
    version: '001',
    name: 'create_initial_schema',
    up: async (connection) => {
      console.log('📝 Creating initial schema...');
      
      // Create users table
      await connection.execute(`
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Users table created');

      // Create emergency_contacts table
      await connection.execute(`
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Emergency contacts table created');

      // Create rides table
      await connection.execute(`
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
          arrival_time TIMESTAMP NULL,
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Rides table created');

      // Create bookings table
      await connection.execute(`
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Bookings table created');

      // Create sos_alerts table
      await connection.execute(`
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
          resolved_at TIMESTAMP NULL,
          admin_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ SOS alerts table created');

      // Create admins table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS admins (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          permissions JSON,
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('   ✅ Admins table created');
    },
    down: async (connection) => {
      console.log('📝 Dropping initial schema...');
      const tables = ['admins', 'sos_alerts', 'bookings', 'rides', 'emergency_contacts', 'users'];
      
      for (const table of tables) {
        try {
          await connection.execute(`DROP TABLE IF EXISTS ${table}`);
          console.log(`   ✅ Dropped table: ${table}`);
        } catch (error) {
          console.log(`   ⚠️  Could not drop table ${table}: ${error.message}`);
        }
      }
    }
  },
  {
    version: '002',
    name: 'insert_sample_data',
    up: async (connection) => {
      console.log('📝 Inserting sample data...');
      
      // Insert sample users
      await connection.execute(`
        INSERT IGNORE INTO users (id, email, first_name, last_name, phone, role, is_verified, is_active) VALUES
        ('user-001', 'john.doe@example.com', 'John', 'Doe', '+919876543210', 'user', 1, 1),
        ('driver-001', 'jane.smith@example.com', 'Jane', 'Smith', '+919876543211', 'driver', 1, 1),
        ('admin-001', 'admin@hushryd.com', 'Admin', 'User', '+919876543212', 'admin', 1, 1)
      `);
      console.log('   ✅ Sample users inserted');

      // Insert sample emergency contacts
      await connection.execute(`
        INSERT IGNORE INTO emergency_contacts (id, user_id, name, phone, relationship, is_primary) VALUES
        ('ec-001', 'user-001', 'Emergency Contact 1', '+919876543220', 'Family', 1),
        ('ec-002', 'user-001', 'Emergency Contact 2', '+919876543221', 'Friend', 0)
      `);
      console.log('   ✅ Sample emergency contacts inserted');

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
      console.log('   ✅ Sample rides inserted');

      // Insert sample admin
      await connection.execute(`
        INSERT IGNORE INTO admins (id, email, first_name, last_name, role, permissions, is_active) VALUES
        ('admin-001', 'admin@hushryd.com', 'Admin', 'User', 'superadmin', '{"all": true}', 1)
      `);
      console.log('   ✅ Sample admin inserted');
    },
    down: async (connection) => {
      console.log('📝 Removing sample data...');
      
      await connection.execute('DELETE FROM emergency_contacts WHERE id IN (?, ?)', ['ec-001', 'ec-002']);
      await connection.execute('DELETE FROM rides WHERE id = ?', ['ride-001']);
      await connection.execute('DELETE FROM users WHERE id IN (?, ?, ?)', ['user-001', 'driver-001', 'admin-001']);
      await connection.execute('DELETE FROM admins WHERE id = ?', ['admin-001']);
      
      console.log('   ✅ Sample data removed');
    }
  }
];

class MySQLMigrationManager {
  constructor(connection) {
    this.connection = connection;
  }

  async initialize() {
    await this.createMigrationsTable();
  }

  async createMigrationsTable() {
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        version VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  async getExecutedMigrations() {
    const [rows] = await this.connection.execute('SELECT version FROM migrations ORDER BY executed_at');
    return rows.map(row => row.version);
  }

  async executeMigration(migration) {
    const executedMigrations = await this.getExecutedMigrations();

    if (executedMigrations.includes(migration.version)) {
      console.log(`Migration ${migration.version} already executed, skipping...`);
      return;
    }

    console.log(`Executing migration ${migration.version}: ${migration.name}`);

    try {
      await this.connection.query('START TRANSACTION');
      await migration.up(this.connection);
      await this.connection.query(
        'INSERT INTO migrations (version, name) VALUES (?, ?)',
        [migration.version, migration.name]
      );
      await this.connection.query('COMMIT');
      console.log(`✅ Migration ${migration.version} executed successfully`);
    } catch (error) {
      await this.connection.query('ROLLBACK');
      throw error;
    }
  }

  async runMigrations(migrations) {
    await this.initialize();

    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = migrations.filter(m => !executedMigrations.includes(m.version));

    console.log(`Found ${pendingMigrations.length} pending migrations`);

    for (const migration of pendingMigrations) {
      await this.executeMigration(migration);
    }
  }
}

async function runMigrations() {
  console.log('🚀 Running MySQL Migrations...\n');
  
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL database\n');

    const migrationManager = new MySQLMigrationManager(connection);
    await migrationManager.runMigrations(migrations);

    console.log('\n🎉 All migrations completed successfully!');
    console.log('\n📋 Database Summary:');
    
    // Show table counts
    const tables = ['users', 'emergency_contacts', 'rides', 'bookings', 'sos_alerts', 'admins'];
    for (const table of tables) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${count[0].count} records`);
      } catch (error) {
        console.log(`   ${table}: Error reading count`);
      }
    }

    console.log('\n🔗 You can now view your database in phpMyAdmin:');
    console.log('   http://localhost/phpmyadmin');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('   1. MySQL server is running');
    console.log('   2. Database "hushryd" exists');
    console.log('   3. User "root" has permissions');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migrations
if (require.main === module) {
  runMigrations().catch(console.error);
}

module.exports = { runMigrations, MySQLMigrationManager };
