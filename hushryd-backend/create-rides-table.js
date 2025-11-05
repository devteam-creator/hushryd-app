const mysql = require('mysql2/promise');

async function createRidesTable() {
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

    // Create rides table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS rides (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36),
        driver_id VARCHAR(36),
        from_location VARCHAR(255) NOT NULL,
        to_location VARCHAR(255) NOT NULL,
        pickup_date DATE NOT NULL,
        pickup_time TIME NOT NULL,
        timeslot VARCHAR(50) NOT NULL,
        fare DECIMAL(10,2) NOT NULL,
        distance DECIMAL(8,2),
        duration INT,
        status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_driver_id (driver_id),
        INDEX idx_pickup_date (pickup_date),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `;
    
    await connection.query(createTableQuery);
    console.log('✅ Rides table created/verified');

    // Check if table has any data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM rides');
    console.log(`📊 Rides table has ${rows[0].count} records`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createRidesTable();
