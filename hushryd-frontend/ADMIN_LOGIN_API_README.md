# Admin Login API Documentation

This document provides comprehensive information about the Admin Login API endpoints for the HushRyd application.

## 🔐 Authentication Endpoints

### 1. Create Admin User

**Endpoint:** `POST /api/auth/admin/create`

**Description:** Creates a new admin user with hashed password stored in the database.

**Request Body:**
```json
{
  "email": "admin@hushryd.com",
  "firstName": "Admin",
  "lastName": "User",
  "password": "admin123",
  "role": "admin"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@hushryd.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

### 2. Admin Login

**Endpoint:** `POST /api/auth/admin/login`

**Description:** Authenticates admin user and returns JWT token.

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
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "id": "uuid",
      "email": "admin@hushryd.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "permissions": [],
      "isActive": true
    }
  }
}
```

### 3. Validate Admin Credentials

**Endpoint:** `POST /api/auth/admin/validate`

**Description:** Validates admin credentials without logging in (useful for pre-login validation).

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
  "message": "Credentials are valid",
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@hushryd.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "isActive": true
    }
  }
}
```

### 4. Update Admin Password

**Endpoint:** `PUT /api/auth/admin/password`

**Description:** Updates admin password (requires authentication).

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

**Response:**
```json
{
  "error": false,
  "message": "Password updated successfully"
}
```

### 5. Verify Admin Token

**Endpoint:** `GET /api/auth/admin/verify`

**Description:** Verifies if the provided JWT token is valid.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "error": false,
  "message": "Admin token is valid",
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@hushryd.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "permissions": [],
      "isActive": true
    }
  }
}
```

### 6. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logs out the admin user (client-side token removal).

**Response:**
```json
{
  "error": false,
  "message": "Logout successful"
}
```

## 🔧 Setup Instructions

### 1. Initialize Admin Users

Run the admin initialization script to create default admin users:

```bash
cd backend
npm run init-admins
```

This will create the following default admin users:

| Email | Password | Role |
|-------|----------|------|
| admin@hushryd.com | admin123 | superadmin |
| manager@hushryd.com | manager123 | admin |
| support@hushryd.com | support123 | support |

### 2. Test Admin Login API

Test the admin login functionality:

```bash
cd backend
npm run test-admin
```

### 3. Test All APIs

Test all API endpoints:

```bash
cd backend
npm run test-api
```

## 🛡️ Security Features

### Password Hashing
- All passwords are hashed using bcrypt with a salt rounds of 12
- Passwords are never stored in plain text
- Password comparison is done using bcrypt.compare()

### JWT Token Security
- Tokens are signed with a secret key
- Tokens have an expiration time (default: 24 hours)
- Tokens include admin information and permissions

### Input Validation
- All inputs are validated before processing
- Email format validation
- Required field validation
- Password strength validation (can be enhanced)

### Account Security
- Account deactivation check
- Last login tracking
- Role-based access control

## 📊 Database Schema

### Admins Table
```sql
CREATE TABLE admins (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'support', 'manager') NOT NULL,
  permissions JSON,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
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
  "message": "Invalid credentials"
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
  "message": "Admin with this email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

## 🔄 Frontend Integration

### Example Usage in React Native

```javascript
import { apiService } from './services/apiService';

// Login admin
const loginAdmin = async (email, password) => {
  try {
    const response = await apiService.adminLogin(email, password);
    
    if (response.success && response.data.token) {
      // Save token to storage
      await apiService.saveToken(response.data.token);
      
      return {
        success: true,
        admin: response.data.admin,
        token: response.data.token
      };
    } else {
      return {
        success: false,
        message: response.message || 'Login failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Validate credentials
const validateAdmin = async (email, password) => {
  try {
    const response = await apiService.validateAdmin(email, password);
    
    if (response.success) {
      return {
        success: true,
        admin: response.data.admin
      };
    } else {
      return {
        success: false,
        message: response.message || 'Validation failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};

// Update password
const updatePassword = async (currentPassword, newPassword) => {
  try {
    const token = await apiService.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found'
      };
    }

    const response = await apiService.updateAdminPassword(currentPassword, newPassword, token);
    
    if (response.success) {
      return {
        success: true,
        message: response.message
      };
    } else {
      return {
        success: false,
        message: response.message || 'Password update failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
};
```

## 🧪 Testing

### Manual Testing

1. **Create Admin User:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/admin/create \
     -H "Content-Type: application/json" \
     -d '{"email":"test@hushryd.com","firstName":"Test","lastName":"Admin","password":"test123","role":"admin"}'
   ```

2. **Login Admin:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@hushryd.com","password":"test123"}'
   ```

3. **Validate Credentials:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/admin/validate \
     -H "Content-Type: application/json" \
     -d '{"email":"test@hushryd.com","password":"test123"}'
   ```

### Automated Testing

Run the test suite:

```bash
npm run test-admin
```

## 🔐 Security Best Practices

1. **Change Default Passwords:** Always change default passwords after first login
2. **Use Strong Passwords:** Implement password strength requirements
3. **Rate Limiting:** Implement rate limiting for login attempts
4. **Account Lockout:** Implement account lockout after failed attempts
5. **Audit Logging:** Log all admin login attempts and actions
6. **HTTPS:** Always use HTTPS in production
7. **Token Expiration:** Set appropriate token expiration times
8. **Regular Security Updates:** Keep dependencies updated

## 📱 Mobile App Integration

The API is designed to work seamlessly with React Native applications:

- **AsyncStorage Integration:** Automatic token storage
- **Platform Detection:** Works on both iOS and Android
- **Error Handling:** Comprehensive error handling for mobile networks
- **Offline Support:** Graceful handling of network connectivity issues

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Check database configuration
   - Ensure MySQL server is running
   - Verify database credentials

2. **Token Verification Failed:**
   - Check JWT secret configuration
   - Verify token format
   - Check token expiration

3. **Password Hash Mismatch:**
   - Ensure bcrypt is properly configured
   - Check password hashing consistency
   - Verify salt rounds configuration

### Support

For technical support or issues:
1. Check server logs for detailed error messages
2. Verify database connection and configuration
3. Test API endpoints using the provided test scripts
4. Review this documentation for proper implementation

## 🎯 Next Steps

1. Implement password reset functionality
2. Add two-factor authentication
3. Implement session management
4. Add audit logging
5. Implement account lockout policies
6. Add password complexity requirements
7. Implement role-based permissions management
