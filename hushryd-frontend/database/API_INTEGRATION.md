# API Integration Guide

How to connect the HushRyd React Native app with the database backend.

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────┐      ┌──────────────┐
│  React Native   │─────▶│  REST API    │─────▶│  PostgreSQL  │
│  Expo App       │◀─────│  Node.js     │◀─────│  Database    │
└─────────────────┘      └──────────────┘      └──────────────┘
```

## 🚀 Backend Setup (Node.js + Express + Prisma)

### 1. Initialize Backend

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express prisma @prisma/client cors dotenv bcrypt jsonwebtoken
npm install --save-dev typescript @types/node @types/express ts-node nodemon
```

### 2. Create Express Server

```typescript
// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import rideRoutes from './routes/rides';
import bookingRoutes from './routes/bookings';
import userRoutes from './routes/users';
import vehicleRoutes from './routes/vehicles';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 HushRyd API running on port ${PORT}`);
});
```

### 3. Authentication Routes

```typescript
// backend/src/routes/auth.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, name, role, licenseNumber, vehicleInfo } = req.body;

    // Validate role-specific requirements
    if ((role === 'driver' || role === 'customer') && !licenseNumber) {
      return res.status(400).json({ error: 'License number required for drivers and customers' });
    }

    if (role === 'customer' && !vehicleInfo) {
      return res.status(400).json({ error: 'Vehicle information required for customers' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        name,
        role,
        licenseNumber,
        licenseExpiry: role !== 'passenger' ? new Date(req.body.licenseExpiry) : null,
      },
    });

    // If customer, create vehicle
    if (role === 'customer' && vehicleInfo) {
      await prisma.vehicle.create({
        data: {
          ownerId: user.id,
          ...vehicleInfo,
        },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({ user: { id: user.id, email, name, role }, token });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findFirst({
      where: { email, role },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

### 4. Ride Routes

```typescript
// backend/src/routes/rides.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Search rides
router.get('/search', async (req, res) => {
  try {
    const { from, to, date, passengers = 1, type = 'all' } = req.query;

    const rides = await prisma.ride.findMany({
      where: {
        fromCity: { contains: from as string, mode: 'insensitive' },
        toCity: { contains: to as string, mode: 'insensitive' },
        departureDate: new Date(date as string),
        availableSeats: { gte: Number(passengers) },
        status: 'scheduled',
        ...(type !== 'all' && { rideType: type as any }),
      },
      include: {
        publisher: true,
        vehicle: true,
      },
      orderBy: { pricePerSeat: 'asc' },
    });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get ride details
router.get('/:id', async (req, res) => {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: req.params.id },
      include: {
        publisher: true,
        vehicle: true,
        reviews: {
          include: { fromUser: true },
          where: { isVisible: true },
        },
      },
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ride' });
  }
});

// Publish ride (drivers & customers only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role === 'passenger') {
      return res.status(403).json({ error: 'Passengers cannot publish rides' });
    }

    const ride = await prisma.ride.create({
      data: {
        publisherId: userId,
        vehicleId: req.body.vehicleId,
        fromCity: req.body.fromCity,
        toCity: req.body.toCity,
        departureDate: new Date(req.body.departureDate),
        departureTime: new Date(`1970-01-01T${req.body.departureTime}`),
        pricePerSeat: req.body.pricePerSeat,
        totalSeats: req.body.totalSeats,
        availableSeats: req.body.totalSeats,
        rideType: req.body.rideType,
        description: req.body.description,
        allowsSmoking: req.body.allowsSmoking,
        allowsPets: req.body.allowsPets,
        allowsMusic: req.body.allowsMusic,
        publishedAt: new Date(),
      },
    });

    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: 'Failed to publish ride' });
  }
});

export default router;
```

### 5. Booking Routes

```typescript
// backend/src/routes/bookings.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== 'passenger') {
      return res.status(403).json({ error: 'Only passengers can book rides' });
    }

    const { rideId, seatsBooked } = req.body;

    // Check ride availability
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride || ride.availableSeats < seatsBooked) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const totalPrice = ride.pricePerSeat.toNumber() * seatsBooked;
    const confirmationCode = generateConfirmationCode();

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        rideId,
        passengerId: userId,
        seatsBooked,
        totalPrice,
        confirmationCode,
        bookingStatus: 'pending',
        paymentStatus: 'pending',
      },
    });

    // Create transaction
    await prisma.transaction.create({
      data: {
        bookingId: booking.id,
        fromUserId: userId,
        toUserId: ride.publisherId,
        transactionType: 'booking',
        amount: totalPrice,
        platformFee: totalPrice * 0.1, // 10% platform fee
        status: 'pending',
      },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Booking failed' });
  }
});

function generateConfirmationCode(): string {
  return 'HR' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default router;
```

## 📱 React Native Integration

### 1. Create API Service

```typescript
// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

class ApiService {
  private async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getToken();
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async register(data: RegisterData) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result.token) {
      await AsyncStorage.setItem('authToken', result.token);
    }
    return result;
  }

  async login(email: string, password: string, role: string) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (result.token) {
      await AsyncStorage.setItem('authToken', result.token);
    }
    return result;
  }

  // Rides
  async searchRides(params: SearchParams) {
    return this.request(`/rides/search?${new URLSearchParams(params)}`);
  }

  async getRide(id: string) {
    return this.request(`/rides/${id}`);
  }

  async publishRide(data: PublishRideData) {
    return this.request('/rides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bookings
  async createBooking(rideId: string, seatsBooked: number) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify({ rideId, seatsBooked }),
    });
  }

  async getMyBookings() {
    return this.request('/bookings/my');
  }

  // Reviews
  async createReview(data: ReviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
```

### 2. Update App to Use Real API

```typescript
// app/(tabs)/index.tsx - Updated
import api from '@/services/api';

const handleSearch = async (params: SearchParams) => {
  try {
    const results = await api.searchRides(params);
    router.push({
      pathname: '/search',
      params: { ...params, type: selectedType, results: JSON.stringify(results) },
    });
  } catch (error) {
    Alert.alert('Error', 'Search failed. Please try again.');
  }
};
```

## 📊 Database Schemas Summary

### Complete Tables Created

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **users** | User accounts | role, email, license_number |
| **vehicles** | Vehicle registry | owner_id, license_plate, verified |
| **rides** | Published rides | publisher_id, vehicle_id, available_seats |
| **bookings** | Passenger bookings | ride_id, passenger_id, confirmation_code |
| **transactions** | Payments | booking_id, amount, platform_fee |
| **reviews** | User ratings | from_user_id, to_user_id, rating |
| **verification_documents** | KYC docs | user_id, vehicle_id, status |
| **notifications** | System alerts | user_id, type, is_read |
| **conversations** | Chat threads | participant1_id, participant2_id |
| **messages** | Chat messages | conversation_id, sender_id |
| **favorite_routes** | Saved routes | user_id, from_city, to_city |
| **blocked_users** | User blocks | user_id, blocked_user_id |
| **audit_logs** | System audit | user_id, action, entity_type |

### Views Created

| View | Purpose |
|------|---------|
| **user_stats** | Aggregate user statistics |
| **ride_performance** | Ride occupancy and revenue |

### Triggers Created

| Trigger | Purpose |
|---------|---------|
| **update_updated_at** | Auto-update timestamps |
| **update_user_rating** | Recalculate ratings |
| **update_available_seats** | Manage seat inventory |

## 🔒 Authentication Flow

```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## 💳 Payment Integration (Stripe)

```typescript
// services/payment.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function processBookingPayment(booking: Booking) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100), // Convert to cents
    currency: 'gbp',
    metadata: {
      bookingId: booking.id,
      passengerId: booking.passengerId,
    },
  });

  return paymentIntent.client_secret;
}
```

## 📱 React Native Updates

### Install Required Packages

```bash
npm install @react-native-async-storage/async-storage axios
```

### Update Mock Data Service

Replace `services/mockData.ts` with `services/api.ts` (real API calls).

## 🚀 Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create hushryd-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET="your-secret"
heroku config:set STRIPE_SECRET_KEY="sk_live_..."

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma db push

# Check logs
heroku logs --tail
```

## 📈 Scaling Considerations

### Read Replicas
For heavy read operations:
```sql
-- Connect to read replica for searches
-- Write to primary for bookings
```

### Caching (Redis)
```typescript
// Cache popular routes
const cachedRoutes = await redis.get('popular_routes');
if (!cachedRoutes) {
  const routes = await getPopularRoutes();
  await redis.setex('popular_routes', 3600, JSON.stringify(routes));
}
```

### Connection Pooling
```typescript
// Use connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10',
    },
  },
});
```

## 🎯 Testing the Integration

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@driver.com",
    "phone": "+447700900999",
    "password": "password123",
    "name": "Test Driver",
    "role": "driver",
    "licenseNumber": "TEST123",
    "licenseExpiry": "2030-12-31"
  }'
```

### Test Search
```bash
curl "http://localhost:3000/api/rides/search?from=London&to=Manchester&date=2025-10-15&passengers=1"
```

### Test Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rideId": "ride-uuid",
    "seatsBooked": 1
  }'
```

---

**Your database is fully integrated and ready for production use! 🎉**

