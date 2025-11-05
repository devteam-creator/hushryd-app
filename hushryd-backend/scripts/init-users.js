const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { executeQuery } = require('../config/database');

async function initializeUsers() {
  try {
    console.log('🚀 Initializing Users and Admins...\n');

    // Default users
    const users = [
      {
        email: 'user@hushryd.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'user123',
        phone: '+919876543210',
        role: 'user'
      },
      {
        email: 'driver@hushryd.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'driver123',
        phone: '+919876543211',
        role: 'driver'
      }
    ];

    // Default admins
    const admins = [
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

    // Create users
    console.log('1️⃣ Creating default users...');
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await executeQuery(
          'SELECT id FROM users WHERE email = ?',
          [userData.email]
        );

        if (existingUser.length > 0) {
          console.log(`⚠️ User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        const userId = uuidv4();
        await executeQuery(`
          INSERT INTO users (id, email, password, first_name, last_name, phone, role, is_verified, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          userData.email,
          hashedPassword,
          userData.firstName,
          userData.lastName,
          userData.phone,
          userData.role,
          true,
          true
        ]);

        console.log(`✅ Created user: ${userData.email} (${userData.role})`);

      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }

    // Create admins
    console.log('\n2️⃣ Creating default admins...');
    for (const adminData of admins) {
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
          INSERT INTO admins (id, email, password, first_name, last_name, role, permissions, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          adminId,
          adminData.email,
          hashedPassword,
          adminData.firstName,
          adminData.lastName,
          adminData.role,
          JSON.stringify([]),
          true
        ]);

        console.log(`✅ Created admin: ${adminData.email} (${adminData.role})`);

      } catch (error) {
        console.error(`❌ Error creating admin ${adminData.email}:`, error.message);
      }
    }

    // Verify users
    console.log('\n3️⃣ Verifying users...');
    const userCount = await executeQuery('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Total users in database: ${userCount[0].count}`);

    // Verify admins
    console.log('4️⃣ Verifying admins...');
    const adminCount = await executeQuery('SELECT COUNT(*) as count FROM admins');
    console.log(`✅ Total admins in database: ${adminCount[0].count}`);

    console.log('\n🎉 User initialization completed!');
    console.log('\n📋 Default User Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ Email                    │ Password    │ Role        │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ user@hushryd.com         │ user123     │ user        │');
    console.log('│ driver@hushryd.com       │ driver123   │ driver      │');
    console.log('└─────────────────────────────────────────────────────────┘');
    
    console.log('\n📋 Default Admin Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ Email                    │ Password    │ Role        │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ admin@hushryd.com        │ admin123    │ superadmin  │');
    console.log('│ manager@hushryd.com      │ manager123  │ admin       │');
    console.log('│ support@hushryd.com     │ support123  │ support     │');
    console.log('└─────────────────────────────────────────────────────────┘');
    console.log('\n🔐 Please change these passwords after first login!');

  } catch (error) {
    console.error('❌ User initialization failed:', error);
  }
}

// Run initialization
initializeUsers();
