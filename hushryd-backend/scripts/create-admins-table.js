const { executeQuery } = require('../config/database');

async function createAdminsTable() {
  try {
    console.log('🚀 Creating admins table...');

    // Create admins table
    const createTableQuery = `
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
    `;

    await executeQuery(createTableQuery);
    console.log('✅ Admins table created successfully');

    // Check if table was created
    const checkTable = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'admins'
    `);

    if (checkTable[0].count > 0) {
      console.log('✅ Admins table exists in database');
    } else {
      console.log('❌ Admins table was not created');
    }

  } catch (error) {
    console.error('❌ Error creating admins table:', error);
  }
}

// Run the script
createAdminsTable();
