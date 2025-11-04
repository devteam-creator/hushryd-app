const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hushryd',
};

async function createOffersTables() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Create offers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id VARCHAR(36) PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
        discount_value DECIMAL(10, 2) NOT NULL,
        min_amount DECIMAL(10, 2) DEFAULT 0,
        max_discount DECIMAL(10, 2) DEFAULT NULL,
        max_uses INT DEFAULT NULL,
        used_count INT DEFAULT 0,
        valid_from DATETIME NOT NULL,
        valid_until DATETIME NOT NULL,
        is_active BOOLEAN DEFAULT true,
        applicable_to ENUM('all', 'new_users', 'specific_users') DEFAULT 'all',
        created_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_code (code),
        INDEX idx_valid (valid_from, valid_until, is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Created offers table');

    // Create offer_usage table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS offer_usage (
        id VARCHAR(36) PRIMARY KEY,
        offer_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        booking_id VARCHAR(36),
        discount_amount DECIMAL(10, 2) NOT NULL,
        original_amount DECIMAL(10, 2) NOT NULL,
        final_amount DECIMAL(10, 2) NOT NULL,
        used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_offer (offer_id),
        INDEX idx_user (user_id),
        INDEX idx_booking (booking_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Created offer_usage table');

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createOffersTables();
