const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../config/database');

// Admin users to initialize
const adminUsers = [
  {
    email: 'admin@hushryd.com',
    firstName: 'Admin',
    lastName: 'User',
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

async function initializeAdmins() {
  try {
    console.log('🚀 Initializing admin users...');

    // Check if admins table exists
    const tableExists = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name = 'admins'
    `);

    if (tableExists[0].count === 0) {
      console.log('❌ Admins table does not exist. Please run migrations first.');
      return;
    }

    // Create admin users
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

    console.log('\n🎉 Admin initialization completed!');
    console.log('\n📋 Default Admin Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ Email                    │ Password    │ Role        │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ admin@hushryd.com        │ admin123    │ superadmin  │');
    console.log('│ manager@hushryd.com      │ manager123  │ admin       │');
    console.log('│ support@hushryd.com      │ support123  │ support     │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('\n🔐 Please change these passwords after first login!');

  } catch (error) {
    console.error('❌ Admin initialization failed:', error);
  }
}

// Run initialization
initializeAdmins();
