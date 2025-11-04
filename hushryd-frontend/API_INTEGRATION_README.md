# HushRyd Backend API Integration

This document explains how to integrate the HushRyd backend API with your React Native frontend application.

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

The server will run on `http://localhost:3000`

### 2. Update Frontend API Service

The frontend API service has been updated to connect with the backend. Make sure your `services/apiService.ts` file includes all the new methods.

### 3. Test API Connection

```bash
cd backend
node test-api.js
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/login` - User login
- `POST /api/auth/user/register` - User registration

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Rides
- `GET /api/rides` - Get all rides
- `GET /api/rides/search` - Search rides by route
- `GET /api/rides/:id` - Get ride by ID
- `POST /api/rides` - Create ride (Admin only)
- `PUT /api/rides/:id` - Update ride
- `DELETE /api/rides/:id` - Delete ride (Admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `POST /api/bookings/:id/cancel` - Cancel booking
- `DELETE /api/bookings/:id` - Delete booking (Admin only)

### Admins
- `GET /api/admins` - Get all admins (Admin only)
- `GET /api/admins/:id` - Get admin by ID
- `POST /api/admins` - Create admin (Super admin only)
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin (Super admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get dashboard analytics
- `GET /api/dashboard/recent-activity` - Get recent activity

### Database Management
- `POST /api/database/seed` - Seed database with sample data
- `DELETE /api/database/clear` - Clear database
- `GET /api/database/stats` - Get database statistics
- `POST /api/database/migrate` - Run database migrations

## 🔧 Frontend Integration

### 1. Import API Service

```javascript
import { apiService } from './services/apiService';
```

### 2. Authentication Flow

```javascript
// Login
const loginResult = await apiService.adminLogin(email, password);
if (loginResult.success) {
  await apiService.saveToken(loginResult.data.token);
  // User is now authenticated
}

// Logout
await apiService.removeToken();
```

### 3. Making API Calls

```javascript
// Get dashboard stats
const token = await apiService.getToken();
const stats = await apiService.getDashboardStats(token);

// Create a new ride
const rideData = {
  driverId: 'driver-123',
  fromAddress: 'Mumbai Central',
  toAddress: 'Pune Station',
  departureTime: '2024-01-15T10:00:00Z',
  price: 2500,
  maxPassengers: 4
};
const newRide = await apiService.createRide(rideData, token);
```

### 4. Error Handling

```javascript
try {
  const response = await apiService.getUsers(token);
  
  if (response.success) {
    // Handle success
    console.log('Users:', response.data.users);
  } else {
    // Handle API error
    console.error('API Error:', response.message);
  }
} catch (error) {
  // Handle network error
  console.error('Network Error:', error.message);
}
```

## 🔐 Authentication & Authorization

### Token Management
- Tokens are automatically stored in AsyncStorage (React Native) or localStorage (Web)
- Tokens are included in API requests automatically
- Tokens expire after 1 hour (configurable)

### Role-Based Access
- **Super Admin**: Full access to all endpoints
- **Admin**: Access to most endpoints except super admin functions
- **User**: Limited access to user-specific endpoints

### Protected Routes
All API endpoints (except authentication) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Operations

### Seeding Database
```javascript
const result = await apiService.seedDatabase(token);
if (result.success) {
  console.log('Database seeded successfully');
}
```

### Getting Statistics
```javascript
const stats = await apiService.getDatabaseStats(token);
console.log('Database stats:', stats.data.stats);
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
node test-api.js
```

### Frontend Testing
Use the provided `frontend-integration-example.js` file to test API integration in your React Native components.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hushryd
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:8081
```

### Frontend Configuration
Update your frontend API service base URL if needed:

```javascript
// In services/apiService.ts
this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
```

## 🚨 Error Handling

### Common Error Responses
```json
{
  "error": true,
  "message": "Error description",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 📱 React Native Integration

### AsyncStorage Setup
Make sure you have AsyncStorage installed:

```bash
npm install @react-native-async-storage/async-storage
```

### Platform-Specific Code
The API service automatically handles platform differences between React Native and Web.

## 🔄 Real-time Updates

For real-time updates, consider implementing WebSocket connections or using a service like Firebase for real-time data synchronization.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [JWT Documentation](https://jwt.io/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 🆘 Support

If you encounter any issues with the API integration:

1. Check the backend server logs
2. Verify your database connection
3. Ensure all environment variables are set correctly
4. Test the API endpoints using the provided test script

## 🎯 Next Steps

1. Implement real-time notifications
2. Add file upload functionality
3. Implement caching strategies
4. Add API rate limiting
5. Implement API versioning
6. Add comprehensive logging and monitoring
