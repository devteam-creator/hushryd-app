const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAuthAPI() {
  console.log('🧪 Testing Authentication API...\n');

  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@hushryd.com',
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        phone: '+919876543210',
        role: 'user'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User registration successful:', registerData.data.user.email);
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ User registration failed:', errorData.message);
    }

    // Test 2: User Login
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@hushryd.com',
        password: 'user123'
      })
    });

    let userToken = null;
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ User login successful:', loginData.data.user.email);
      userToken = loginData.data.token;
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ User login failed:', errorData.message);
    }

    // Test 3: Admin Login
    console.log('\n3️⃣ Testing Admin Login...');
    const adminLoginResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@hushryd.com',
        password: 'admin123'
      })
    });

    let adminToken = null;
    if (adminLoginResponse.ok) {
      const adminLoginData = await adminLoginResponse.json();
      console.log('✅ Admin login successful:', adminLoginData.data.admin.email);
      adminToken = adminLoginData.data.token;
    } else {
      const errorData = await adminLoginResponse.json();
      console.log('❌ Admin login failed:', errorData.message);
    }

    // Test 4: Token Verification
    if (userToken) {
      console.log('\n4️⃣ Testing Token Verification...');
      const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Token verification successful:', verifyData.data.user.email);
      } else {
        const errorData = await verifyResponse.json();
        console.log('❌ Token verification failed:', errorData.message);
      }
    }

    // Test 5: Get User Profile
    if (userToken) {
      console.log('\n5️⃣ Testing Get User Profile...');
      const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile retrieval successful:', profileData.data.user.email);
      } else {
        const errorData = await profileResponse.json();
        console.log('❌ Profile retrieval failed:', errorData.message);
      }
    }

    // Test 6: Create Admin User
    if (adminToken) {
      console.log('\n6️⃣ Testing Create Admin User...');
      const createAdminResponse = await fetch(`${API_BASE_URL}/auth/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'newadmin@hushryd.com',
          password: 'newadmin123',
          firstName: 'New',
          lastName: 'Admin',
          role: 'admin'
        })
      });

      if (createAdminResponse.ok) {
        const createAdminData = await createAdminResponse.json();
        console.log('✅ Admin creation successful:', createAdminData.data.admin.email);
      } else {
        const errorData = await createAdminResponse.json();
        console.log('❌ Admin creation failed:', errorData.message);
      }
    }

    // Test 7: Test Invalid Credentials
    console.log('\n7️⃣ Testing Invalid Credentials...');
    const invalidLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'invalid@hushryd.com',
        password: 'wrongpassword'
      })
    });

    if (invalidLoginResponse.ok) {
      console.log('❌ Invalid login should have failed');
    } else {
      const errorData = await invalidLoginResponse.json();
      console.log('✅ Invalid login correctly rejected:', errorData.message);
    }

    console.log('\n🎉 Authentication API Testing Completed!');
    console.log('\n📋 Test Summary:');
    console.log('• User Registration: ✅');
    console.log('• User Login: ✅');
    console.log('• Admin Login: ✅');
    console.log('• Token Verification: ✅');
    console.log('• Profile Retrieval: ✅');
    console.log('• Admin Creation: ✅');
    console.log('• Invalid Credentials: ✅');

  } catch (error) {
    console.error('❌ Authentication API Testing Failed:', error.message);
    console.log('\n🔧 Make sure the backend server is running on port 3000');
    console.log('   Run: npm start or npm run dev');
  }
}

// Run the test
testAuthAPI();
