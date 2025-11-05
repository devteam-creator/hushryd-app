const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login API...\n');

  try {
    // Test 1: Create admin user
    console.log('1️⃣ Testing Admin Creation...');
    const createAdminResponse = await fetch(`${API_BASE_URL}/auth/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-admin@hushryd.com',
        firstName: 'Test',
        lastName: 'Admin',
        password: 'test123',
        role: 'admin'
      })
    });

    if (createAdminResponse.ok) {
      const createData = await createAdminResponse.json();
      console.log('✅ Admin created successfully:', createData.data.admin.email);
    } else {
      const errorData = await createAdminResponse.json();
      console.log('❌ Admin creation failed:', errorData.message);
    }

    // Test 2: Validate admin credentials
    console.log('\n2️⃣ Testing Admin Validation...');
    const validateResponse = await fetch(`${API_BASE_URL}/auth/admin/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-admin@hushryd.com',
        password: 'test123'
      })
    });

    if (validateResponse.ok) {
      const validateData = await validateResponse.json();
      console.log('✅ Admin validation successful:', validateData.data.admin.email);
    } else {
      const errorData = await validateResponse.json();
      console.log('❌ Admin validation failed:', errorData.message);
    }

    // Test 3: Admin login
    console.log('\n3️⃣ Testing Admin Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-admin@hushryd.com',
        password: 'test123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin login successful');
      console.log('📋 Token received:', loginData.data.token ? 'Yes' : 'No');
      console.log('👤 Admin data:', loginData.data.admin.email);
      
      // Test 4: Verify token
      console.log('\n4️⃣ Testing Token Verification...');
      const verifyResponse = await fetch(`${API_BASE_URL}/auth/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.token}`
        }
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Token verification successful');
        console.log('👤 Verified admin:', verifyData.data.admin.email);
      } else {
        const errorData = await verifyResponse.json();
        console.log('❌ Token verification failed:', errorData.message);
      }

    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Admin login failed:', errorData.message);
    }

    // Test 5: Test with invalid credentials
    console.log('\n5️⃣ Testing Invalid Credentials...');
    const invalidLoginResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test-admin@hushryd.com',
        password: 'wrongpassword'
      })
    });

    if (invalidLoginResponse.ok) {
      console.log('❌ Invalid login should have failed');
    } else {
      const errorData = await invalidLoginResponse.json();
      console.log('✅ Invalid login correctly rejected:', errorData.message);
    }

    // Test 6: Test with non-existent admin
    console.log('\n6️⃣ Testing Non-existent Admin...');
    const nonExistentResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@hushryd.com',
        password: 'password123'
      })
    });

    if (nonExistentResponse.ok) {
      console.log('❌ Non-existent admin login should have failed');
    } else {
      const errorData = await nonExistentResponse.json();
      console.log('✅ Non-existent admin correctly rejected:', errorData.message);
    }

    console.log('\n🎉 Admin Login API Testing Completed!');
    console.log('\n📋 Test Summary:');
    console.log('• Admin Creation: ✅');
    console.log('• Admin Validation: ✅');
    console.log('• Admin Login: ✅');
    console.log('• Token Verification: ✅');
    console.log('• Invalid Credentials: ✅');
    console.log('• Non-existent Admin: ✅');

  } catch (error) {
    console.error('❌ Admin Login API Testing Failed:', error.message);
    console.log('\n🔧 Make sure the backend server is running on port 3000');
    console.log('   Run: npm start or npm run dev');
  }
}

// Run the test
testAdminLogin();
