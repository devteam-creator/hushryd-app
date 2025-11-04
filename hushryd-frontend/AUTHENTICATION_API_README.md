# Node.js Authentication API - Complete Setup Guide

This document provides a comprehensive guide for the Node.js authentication API with password column support.

## 🚀 Quick Setup

### Step 1: Setup Database with Password Columns
```bash
cd backend
npm run setup-database
```

### Step 2: Initialize Default Users and Admins
```bash
npm run init-users
```

### Step 3: Start the Server
```bash
npm start
```

### Step 4: Test Authentication API
```bash
npm run test-auth
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  role ENUM('user', 'driver', 'admin') NOT NULL DEFAULT 'user',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Admins Table
```sql
CREATE TABLE admins (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'support', 'manager') NOT NULL DEFAULT 'admin',
  permissions JSON,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Authentication Endpoints

### 1. User Registration
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@hushryd.com",
  "password": "user123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "role": "user"
}
```

**Response:**
```json
{
  "error": false,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@hushryd.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isVerified": false,
      "isActive": true
    }
  }
}
```

### 2. User Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@hushryd.com",
  "password": "user123"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@hushryd.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isVerified": true,
      "isActive": true
    }
  }
}
```

### 3. Admin Login
**POST** `/api/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@hushryd.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Admin login successful",
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "id": "uuid",
      "email": "admin@hushryd.com",
      "firstName": "Super",
      "lastName": "Admin",
      "role": "superadmin",
      "permissions": [],
      "isActive": true
    }
  }
}
```

### 4. Create Admin User
**POST** `/api/auth/admin/create`

**Request Body:**
```json
{
  "email": "newadmin@hushryd.com",
  "password": "newadmin123",
  "firstName": "New",
  "lastName": "Admin",
  "role": "admin"
}
```

### 5. Verify Token
**GET** `/api/auth/verify`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### 6. Get User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### 7. Change Password
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 8. Logout
**POST** `/api/auth/logout`

## 🔐 Default Credentials

### Users
| Email | Password | Role |
|-------|----------|------|
| user@hushryd.com | user123 | user |
| driver@hushryd.com | driver123 | driver |

### Admins
| Email | Password | Role |
|-------|----------|------|
| admin@hushryd.com | admin123 | superadmin |
| manager@hushryd.com | manager123 | admin |
| support@hushryd.com | support123 | support |

## 🛡️ Security Features

### Password Security
- **Bcrypt Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
- **Password Validation**: Comprehensive password validation
- **Password Change**: Secure password change with current password verification

### JWT Token Security
- **Token Signing**: Tokens are signed with secret keys
- **Token Expiration**: Configurable token expiration (default: 24 hours)
- **Token Verification**: Middleware for token verification

### Account Security
- **Account Status**: Active/inactive account status
- **Email Verification**: Email verification system
- **Last Login Tracking**: Track last login times

## 🧪 Testing

### Manual Testing

1. **Test User Registration**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@hushryd.com","password":"test123","firstName":"Test","lastName":"User","role":"user"}'
   ```

2. **Test User Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@hushryd.com","password":"user123"}'
   ```

3. **Test Admin Login**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@hushryd.com","password":"admin123"}'
   ```

### Automated Testing

Run the comprehensive test suite:

```bash
npm run test-auth
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hushryd
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

### Database Configuration
Update `backend/config/database.js` with your database credentials:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hushryd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## 📱 Frontend Integration

### React Native Example

```javascript
import { apiService } from './services/apiService';

// User Registration
const registerUser = async (userData) => {
  try {
    const response = await apiService.register(userData);
    
    if (response.success) {
      await apiService.saveToken(response.data.token);
      return { success: true, user: response.data.user };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// User Login
const loginUser = async (email, password) => {
  try {
    const response = await apiService.login(email, password);
    
    if (response.success) {
      await apiService.saveToken(response.data.token);
      return { success: true, user: response.data.user };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

// Admin Login
const loginAdmin = async (email, password) => {
  try {
    const response = await apiService.adminLogin(email, password);
    
    if (response.success) {
      await apiService.saveToken(response.data.token);
      return { success: true, admin: response.data.admin };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};
```

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": true,
  "message": "Email and password are required"
}
```

**401 Unauthorized:**
```json
{
  "error": true,
  "message": "Invalid email or password"
}
```

**403 Forbidden:**
```json
{
  "error": true,
  "message": "Account is deactivated"
}
```

**409 Conflict:**
```json
{
  "error": true,
  "message": "User with this email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

## 🔄 API Flow

### User Registration Flow
1. User submits registration form
2. API validates input data
3. Checks if email already exists
4. Hashes password with bcrypt
5. Creates user in database
6. Generates JWT token
7. Returns token and user data

### User Login Flow
1. User submits login credentials
2. API validates input data
3. Finds user by email
4. Verifies password with bcrypt
5. Checks account status
6. Updates last login time
7. Generates JWT token
8. Returns token and user data

### Token Verification Flow
1. Client sends request with Authorization header
2. Middleware extracts token from header
3. Verifies token signature and expiration
4. Attaches user data to request object
5. Continues to protected route

## 🎯 Next Steps

1. **Password Reset**: Implement password reset functionality
2. **Email Verification**: Add email verification system
3. **Two-Factor Authentication**: Enhance security with 2FA
4. **Session Management**: Implement session timeout
5. **Audit Logging**: Track authentication attempts
6. **Rate Limiting**: Implement login attempt rate limiting

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check database configuration
   - Ensure MySQL server is running
   - Verify database credentials

2. **Password Column Missing**:
   - Run `npm run setup-database`
   - Check database schema

3. **JWT Token Issues**:
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure proper token format

4. **Authentication Failures**:
   - Check password hashing
   - Verify user exists in database
   - Check account status

### Debug Steps

1. **Check Database**:
   ```sql
   SELECT * FROM users;
   SELECT * FROM admins;
   ```

2. **Check Backend Logs**:
   ```bash
   npm start
   # Look for error messages in console
   ```

3. **Test API Endpoints**:
   ```bash
   npm run test-auth
   ```

## ✅ Verification Checklist

- [ ] Database tables created with password columns
- [ ] Default users and admins initialized
- [ ] Backend server running on port 3000
- [ ] Authentication API endpoints working
- [ ] Password hashing implemented
- [ ] JWT token generation working
- [ ] Token verification middleware working
- [ ] Frontend integration completed
- [ ] Error handling implemented
- [ ] Test suite passing

Once all items are checked, your authentication API should be fully functional! 🎉
