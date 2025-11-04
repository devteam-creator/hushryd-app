const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../config/database');

async function setupAdminSystem() {
  try {
    console.log('🚀 Setting up Admin System...\n');

    // Step 1: Create admins table
    console.log('1️⃣ Creating admins table...');
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

    // Step 2: Check if admins table exists
    const checkTable = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'admins'
    `);

    if (checkTable[0].count === 0) {
      console.log('❌ Admins table was not created');
      return;
    }

    console.log('✅ Admins table exists in database');

    // Step 3: Create default admin users
    console.log('\n2️⃣ Creating default admin users...');

    const adminUsers = [
      {
        email: 'admin@hushryd.com',
        firstName: 'Super',
        lastName: 'Admin',
        password: 'admin123',
        role: 'superadmin'
      },
      {
        email: 'manager@hushryd.com',
        firstName: 'Manager',
        lastName: 'User',
        password: 'manager123',
        role: 'admin'
      },
      {
        email: 'support@hushryd.com',
        firstName: 'Support',
        lastName: 'Agent',
        password: 'support123',
        role: 'support'
      }
    ];

    for (const adminData of adminUsers) {
      try {
        // Check if admin already exists
        const existingAdmin = await executeQuery(
          'SELECT id FROM admins WHERE email = ?',
          [adminData.email]
        );

        if (existingAdmin.length > 0) {
          console.log(`⚠️ Admin ${adminData.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminData.password, 12);

        // Create admin
        const adminId = uuidv4();
        await executeQuery(`
          INSERT INTO admins (
            id, email, first_name, last_name, password, role, 
            permissions, is_active, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          adminId,
          adminData.email,
          adminData.firstName,
          adminData.lastName,
          hashedPassword,
          adminData.role,
          JSON.stringify([]), // Default empty permissions
          true, // is_active
          new Date(),
          new Date()
        ]);

        console.log(`✅ Created admin: ${adminData.email} (${adminData.role})`);

      } catch (error) {
        console.error(`❌ Error creating admin ${adminData.email}:`, error.message);
      }
    }

    // Step 4: Verify admin users
    console.log('\n3️⃣ Verifying admin users...');
    const adminCount = await executeQuery('SELECT COUNT(*) as count FROM admins');
    console.log(`✅ Total admin users in database: ${adminCount[0].count}`);

    // Step 5: Test admin login
    console.log('\n4️⃣ Testing admin login...');
    const testAdmin = await executeQuery(
      'SELECT * FROM admins WHERE email = ?',
      ['admin@hushryd.com']
    );

    if (testAdmin.length > 0) {
      const admin = testAdmin[0];
      const isValidPassword = await bcrypt.compare('admin123', admin.password);
      
      if (isValidPassword) {
        console.log('✅ Admin login test successful');
      } else {
        console.log('❌ Admin login test failed - password mismatch');
      }
    } else {
      console.log('❌ Admin login test failed - admin not found');
    }

    console.log('\n🎉 Admin System Setup Completed!');
    console.log('\n📋 Default Admin Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ Email                    │ Password    │ Role        │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ admin@hushryd.com        │ admin123    │ superadmin  │');
    console.log('│ manager@hushryd.com      │ manager123  │ admin       │');
    console.log('│ support@hushryd.com      │ support123  │ support     │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('\n🔐 Please change these passwords after first login!');
    console.log('\n🚀 You can now start the backend server and test admin login!');

  } catch (error) {
    console.error('❌ Admin system setup failed:', error);
  }
}

// Run setup
setupAdminSystem();
