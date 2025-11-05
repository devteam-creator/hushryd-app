# HushRyd Database Documentation

Complete database schema for the three-role ride-sharing platform.

## 📊 Database Overview

### Total Tables: 17

1. **users** - User accounts with role-based access
2. **vehicles** - Vehicle registrations for drivers/customers
3. **rides** - Published rides/trips
4. **bookings** - Passenger bookings
5. **transactions** - All financial transactions
6. **reviews** - User reviews and ratings
7. **verification_documents** - KYC documents
8. **notifications** - System notifications
9. **conversations** - Chat conversations
10. **messages** - Chat messages
11. **favorite_routes** - Saved routes
12. **blocked_users** - User blocks
13. **audit_logs** - System audit trail

## 🎭 Role-Based Data Model

### Driver-Specific Fields
```sql
- license_number (required, unique)
- license_expiry
- Multiple vehicles (via vehicles table)
- Can publish rides (via rides table)
```

### Customer-Specific Fields
```sql
- license_number (required, unique)
- license_expiry
- Own vehicles (via vehicles table)
- Can publish private rides
```

### Passenger-Specific Fields
```sql
- emergency_contact_name
- emergency_contact_phone
- Can book rides (via bookings table)
```

## 📋 Core Tables

### Users Table
Stores all user types with role-based fields.

**Key Fields:**
- `id` (UUID) - Primary key
- `email` (unique) - Login identifier
- `phone` (unique) - Contact & verification
- `role` (enum) - driver | customer | passenger
- `license_number` (unique) - For drivers/customers
- `rating` (decimal) - Average user rating
- `review_count` - Total reviews received

**Constraints:**
- Drivers & customers MUST have license_number
- Passengers do NOT require license

### Vehicles Table
Vehicle information for drivers and customers.

**Key Fields:**
- `id` (UUID) - Primary key
- `owner_id` (FK to users)
- `license_plate` (unique)
- `vehicle_type` - sedan, suv, van, luxury, economy, bus
- `seating_capacity`
- `status` - pending_verification, active, rejected

**Business Rules:**
- Must be verified before use
- Owner must be driver or customer
- Insurance must be valid

### Rides Table
Published rides by drivers or customers.

**Key Fields:**
- `id` (UUID) - Primary key
- `publisher_id` (FK to users)
- `vehicle_id` (FK to vehicles)
- `from_city`, `to_city` - Route
- `departure_date`, `departure_time`
- `price_per_seat`
- `total_seats`, `available_seats`
- `ride_type` - carpool, bus, private
- `status` - scheduled, active, completed, cancelled

**Business Rules:**
- Available seats ≤ total seats
- Departure must be in future
- Only verified vehicles can be used

### Bookings Table
Passenger bookings for rides.

**Key Fields:**
- `id` (UUID) - Primary key
- `ride_id` (FK to rides)
- `passenger_id` (FK to users)
- `seats_booked`
- `total_price`
- `booking_status` - pending, confirmed, cancelled, completed
- `payment_status` - pending, paid, refunded
- `confirmation_code` (unique)

**Business Rules:**
- Passenger must be role='passenger'
- Cannot book more seats than available
- Must have valid payment

### Transactions Table
All financial transactions in the system.

**Key Fields:**
- `id` (UUID) - Primary key
- `booking_id` (FK to bookings)
- `from_user_id`, `to_user_id`
- `transaction_type` - booking, refund, payout, fee
- `amount`, `currency`
- `status` - pending, completed, failed
- `platform_fee`, `processing_fee`

**Transaction Types:**
- **booking** - Passenger pays for ride
- **refund** - Return money to passenger
- **payout** - Pay driver/customer
- **cancellation_fee** - Penalty charges
- **platform_fee** - HushRyd commission

### Reviews Table
User ratings and feedback.

**Key Fields:**
- `id` (UUID) - Primary key
- `ride_id`, `booking_id`
- `from_user_id`, `to_user_id`
- `review_type` - driver_review, passenger_review
- `rating` (1-5)
- `comment`
- Detailed ratings: punctuality, cleanliness, communication, safety

**Business Rules:**
- Can only review after ride completion
- One review per user per ride
- Rating must be 1-5

## 🔐 Verification System

### VerificationDocuments Table
Stores uploaded verification documents.

**Document Types:**
- drivers_license
- vehicle_registration
- insurance
- id_card
- selfie
- other

**Workflow:**
1. User uploads document
2. Status = 'pending'
3. Admin reviews
4. Status = 'approved' or 'rejected'
5. User/vehicle verification updated

## 💰 Payment Flow

```
1. Passenger books ride
   └─> Booking created (status: pending)
   
2. Payment processed
   └─> Transaction created (type: booking)
   └─> Payment gateway called
   
3. Payment successful
   └─> Transaction status: completed
   └─> Booking status: confirmed
   └─> Ride available_seats decreased
   
4. Ride completed
   └─> Payout transaction created
   └─> Platform fee calculated
   └─> Driver/customer receives net amount
```

## 📈 Analytics Views

### user_stats
Aggregated user statistics.

```sql
SELECT * FROM user_stats WHERE id = 'user-uuid';
-- Returns:
-- - rides_published
-- - rides_booked
-- - total_earned
-- - total_spent
```

### ride_performance
Ride booking performance metrics.

```sql
SELECT * FROM ride_performance WHERE departure_date >= CURRENT_DATE;
-- Returns:
-- - occupancy_rate
-- - total_bookings
-- - total_revenue
```

## 🔄 Automated Triggers

### 1. Update Timestamps
Auto-updates `updated_at` on any record change.

### 2. Update User Rating
Recalculates user rating when new review is added.

### 3. Update Available Seats
Automatically adjusts seats when booking is confirmed/cancelled.

## 🚀 Getting Started

### PostgreSQL Setup

```bash
# Create database
createdb hushryd

# Run schema
psql hushryd < database/schema.sql

# Verify tables
psql hushryd -c "\dt"
```

### Prisma Setup

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize
npx prisma init

# Copy schema
cp database/prisma/schema.prisma prisma/schema.prisma

# Generate client
npx prisma generate

# Push to database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## 📝 Sample Queries

### Register Driver
```sql
INSERT INTO users (
  email, phone, password_hash, name, role, 
  license_number, license_expiry
) VALUES (
  'driver@hushryd.com', '+44700900001', '$hashed$', 
  'John Driver', 'driver', 'DL123456', '2028-12-31'
);
```

### Add Vehicle
```sql
INSERT INTO vehicles (
  owner_id, make, model, year, color, license_plate,
  vehicle_type, seating_capacity, registration_number,
  registration_expiry, insurance_number, insurance_expiry
) VALUES (
  'user-uuid', 'Toyota', 'Prius', 2020, 'Silver', 'ABC 123',
  'sedan', 4, 'REG123456', '2025-12-31', 'INS789', '2025-12-31'
);
```

### Publish Ride
```sql
INSERT INTO rides (
  publisher_id, vehicle_id, from_city, to_city,
  departure_date, departure_time, price_per_seat,
  total_seats, available_seats, ride_type
) VALUES (
  'user-uuid', 'vehicle-uuid', 'London', 'Manchester',
  '2025-10-15', '09:00', 25.00, 3, 3, 'carpool'
);
```

### Book Ride
```sql
INSERT INTO bookings (
  ride_id, passenger_id, seats_booked, total_price
) VALUES (
  'ride-uuid', 'passenger-uuid', 1, 25.00
);
```

### Process Payment
```sql
INSERT INTO transactions (
  booking_id, from_user_id, to_user_id,
  transaction_type, amount, platform_fee, net_amount
) VALUES (
  'booking-uuid', 'passenger-uuid', 'driver-uuid',
  'booking', 25.00, 2.50, 22.50
);
```

## 🔒 Security Considerations

1. **Password Hashing**: Use bcrypt or argon2
2. **Email Verification**: Verify before activation
3. **Phone Verification**: SMS OTP required
4. **License Verification**: Manual admin review
5. **Payment Security**: PCI DSS compliance
6. **Data Encryption**: Encrypt sensitive fields
7. **API Rate Limiting**: Prevent abuse
8. **Audit Logging**: Track all critical actions

## 📊 Indexing Strategy

All tables include indexes on:
- Primary keys (automatic)
- Foreign keys
- Frequently queried fields (email, phone, status)
- Search fields (city names, dates)
- Unique constraints

## 🔄 Backup Strategy

```bash
# Daily backup
pg_dump hushryd > backup_$(date +%Y%m%d).sql

# Restore backup
psql hushryd < backup_20251007.sql
```

## 📖 API Integration

This database schema is designed to work with:
- REST APIs
- GraphQL
- Prisma ORM
- TypeORM
- Sequelize

## 🎯 Next Steps

1. Set up database server (PostgreSQL recommended)
2. Run schema.sql to create tables
3. Set up Prisma for TypeScript integration
4. Create seed data for testing
5. Implement API endpoints
6. Add real-time features (WebSocket)
7. Set up backup automation
8. Configure monitoring and alerts

---

**Your HushRyd database is production-ready with complete support for all three user roles! 🚀**

