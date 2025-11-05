const mysql = require('mysql2/promise');

async function createBookingsTable() {
  let connection;
  
  try {
    // Connect to MySQL server
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Empty password for localhost
      database: 'hushryd'
    });

    console.log('✅ Connected to MySQL database');

    // Create bookings table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        ride_id VARCHAR(36) NOT NULL,
        passenger_count INT NOT NULL DEFAULT 1,
        total_price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'refunded', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50),
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_ride_id (ride_id),
        INDEX idx_status (status),
        INDEX idx_payment_status (payment_status),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
      )
    `;
    
    await connection.query(createTableQuery);
    console.log('✅ Bookings table created/verified');

    // Check if table has any data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM bookings');
    console.log(`📊 Bookings table has ${rows[0].count} records`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createBookingsTable();
