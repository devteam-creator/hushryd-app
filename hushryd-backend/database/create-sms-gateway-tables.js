const { executeQuery } = require('../config/database');

const createSmsGatewayTables = async () => {
  try {
    console.log('Creating SMS gateway tables...');

    // Create sms_gateway_settings table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS sms_gateway_settings (
        id INT PRIMARY KEY DEFAULT 1,
        provider ENUM('twilio', 'msg91', 'textlocal') NOT NULL,
        api_key VARCHAR(255) NOT NULL,
        api_secret VARCHAR(255) DEFAULT NULL,
        sender_id VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_id (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Created sms_gateway_settings table');

    // Create sms_logs table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS sms_logs (
        id VARCHAR(36) PRIMARY KEY,
        mobile_number VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
        provider_response TEXT DEFAULT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivered_at TIMESTAMP NULL,
        error_message TEXT DEFAULT NULL,
        INDEX idx_mobile_number (mobile_number),
        INDEX idx_status (status),
        INDEX idx_sent_at (sent_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Created sms_logs table');
    console.log('✅ SMS gateway tables created successfully!');

  } catch (error) {
    console.error('Error creating SMS gateway tables:', error);
    throw error;
  }
};

// Run the migration
createSmsGatewayTables()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
