# HushRyd Database Schema Diagram

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            USERS (Central)                          │
│  - id (PK, UUID)                                                    │
│  - email (unique)                                                   │
│  - phone (unique)                                                   │
│  - password_hash                                                    │
│  - name                                                            │
│  - role (driver|customer|passenger)                                │
│  - license_number (unique, required for driver/customer)           │
│  - rating, review_count                                            │
│  - emergency_contact_name, emergency_contact_phone (for passenger) │
└─────────────────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
    ┌────▼─────┐   ┌───▼──────┐  ┌───▼──────┐  ┌───▼──────────┐
    │ VEHICLES │   │  RIDES   │  │ BOOKINGS │  │ REVIEWS      │
    └──────────┘   └──────────┘  └──────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         VEHICLES                                    │
│  - id (PK, UUID)                                                    │
│  - owner_id (FK → users.id)                                         │
│  - make, model, year, color                                         │
│  - license_plate (unique)                                           │
│  - vehicle_type (sedan|suv|van|luxury|economy|bus)                 │
│  - seating_capacity                                                 │
│  - registration_number, insurance_number                            │
│  - status (active|pending_verification|rejected)                    │
│  - verified_at                                                      │
└─────────────────────────────────────────────────────────────────────┘
         │
         │
    ┌────▼─────────────────────────────────────────────────────────────┐
    │                         RIDES                                    │
    │  - id (PK, UUID)                                                 │
    │  - publisher_id (FK → users.id)                                  │
    │  - vehicle_id (FK → vehicles.id)                                 │
    │  - from_city, to_city, from_address, to_address                  │
    │  - from_latitude, from_longitude, to_latitude, to_longitude      │
    │  - departure_date, departure_time                                │
    │  - price_per_seat, total_seats, available_seats                  │
    │  - ride_type (carpool|bus|private)                               │
    │  - status (scheduled|active|completed|cancelled)                 │
    │  - allows_smoking, allows_pets, allows_music, chattiness         │
    │  - description, distance_km, duration_minutes                    │
    └──────────────────────────────────────────────────────────────────┘
              │
              │
    ┌─────────▼──────────────────────────────────────────────────────┐
    │                      BOOKINGS                                   │
    │  - id (PK, UUID)                                                │
    │  - ride_id (FK → rides.id)                                      │
    │  - passenger_id (FK → users.id)                                 │
    │  - seats_booked                                                 │
    │  - total_price                                                  │
    │  - booking_status (pending|confirmed|cancelled|completed)       │
    │  - payment_status (pending|paid|refunded)                       │
    │  - confirmation_code (unique)                                   │
    │  - pickup_location, dropoff_location                            │
    │  - special_requests, luggage_count                              │
    └─────────────────────────────────────────────────────────────────┘
              │
              │
    ┌─────────▼──────────────────────────────────────────────────────┐
    │                   TRANSACTIONS                                  │
    │  - id (PK, UUID)                                                │
    │  - booking_id (FK → bookings.id)                                │
    │  - from_user_id (FK → users.id)                                 │
    │  - to_user_id (FK → users.id)                                   │
    │  - transaction_type (booking|refund|payout|fee)                 │
    │  - amount, currency                                             │
    │  - platform_fee, processing_fee, net_amount                     │
    │  - status (pending|completed|failed)                            │
    │  - payment_method, payment_provider                             │
    └─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         REVIEWS                                     │
│  - id (PK, UUID)                                                    │
│  - ride_id (FK → rides.id)                                          │
│  - booking_id (FK → bookings.id)                                    │
│  - from_user_id (FK → users.id)                                     │
│  - to_user_id (FK → users.id)                                       │
│  - review_type (driver_review|passenger_review)                     │
│  - rating (1-5)                                                     │
│  - comment                                                          │
│  - punctuality_rating, cleanliness_rating, safety_rating            │
│  - is_visible, is_flagged                                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  VERIFICATION_DOCUMENTS                             │
│  - id (PK, UUID)                                                    │
│  - user_id (FK → users.id) [nullable]                               │
│  - vehicle_id (FK → vehicles.id) [nullable]                         │
│  - document_type (license|registration|insurance|id|selfie)         │
│  - document_url, document_back_url                                  │
│  - status (pending|approved|rejected|expired)                       │
│  - verified_by (FK → users.id)                                      │
│  - verified_at, expiry_date                                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      NOTIFICATIONS                                  │
│  - id (PK, UUID)                                                    │
│  - user_id (FK → users.id)                                          │
│  - type (booking|cancellation|review|payment|verification)          │
│  - priority (low|medium|high|urgent)                                │
│  - title, message                                                   │
│  - related_ride_id, related_booking_id                              │
│  - is_read, read_at                                                 │
│  - push_sent, email_sent, sms_sent                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     CONVERSATIONS                                   │
│  - id (PK, UUID)                                                    │
│  - ride_id (FK → rides.id)                                          │
│  - booking_id (FK → bookings.id)                                    │
│  - participant1_id (FK → users.id)                                  │
│  - participant2_id (FK → users.id)                                  │
│  - is_active, last_message_at                                       │
└─────────────────────────────────────────────────────────────────────┘
         │
         │
    ┌────▼────────────────────────────────────────────────────────────┐
    │                      MESSAGES                                   │
    │  - id (PK, UUID)                                                │
    │  - conversation_id (FK → conversations.id)                      │
    │  - sender_id (FK → users.id)                                    │
    │  - message, attachment_url                                      │
    │  - is_read, read_at                                             │
    └─────────────────────────────────────────────────────────────────┘
```

## 🔗 Relationships

### Users → Vehicles (One-to-Many)
- Driver can own multiple vehicles
- Customer can own multiple vehicles
- Passenger owns no vehicles

### Users → Rides (One-to-Many)
- Driver can publish many rides
- Customer can publish many rides
- Passenger cannot publish rides

### Rides → Bookings (One-to-Many)
- One ride can have multiple bookings
- Each booking is for one ride

### Users → Bookings (One-to-Many)
- Passenger can make multiple bookings
- Each booking belongs to one passenger

### Bookings → Transactions (One-to-Many)
- One booking can have multiple transactions (payment, refund, etc.)

### Users → Reviews (Many-to-Many)
- Users can give many reviews
- Users can receive many reviews
- Each review is between two users for a specific ride

## 📐 Database Design Patterns

### Soft Deletes
```sql
-- All tables have deleted_at column
WHERE deleted_at IS NULL  -- Filter out deleted records
```

### Audit Trail
```sql
-- Every critical action is logged
INSERT INTO audit_logs (user_id, entity_type, entity_id, action, new_values)
```

### Optimistic Locking
```sql
-- updated_at serves as version field
UPDATE rides 
SET available_seats = available_seats - 1, updated_at = CURRENT_TIMESTAMP
WHERE id = $1 AND updated_at = $2  -- Check timestamp
```

### Idempotency
```sql
-- Confirmation codes ensure idempotent bookings
INSERT INTO bookings (...) 
ON CONFLICT (confirmation_code) DO NOTHING;
```

## 🔍 Common Queries

### 1. Find Available Rides
```sql
SELECT r.*, u.name as driver_name, v.make || ' ' || v.model as vehicle
FROM rides r
JOIN users u ON u.id = r.publisher_id
JOIN vehicles v ON v.id = r.vehicle_id
WHERE r.from_city ILIKE '%London%'
  AND r.to_city ILIKE '%Manchester%'
  AND r.departure_date >= CURRENT_DATE
  AND r.available_seats >= 1
  AND r.status = 'scheduled'
ORDER BY r.price_per_seat ASC;
```

### 2. User Ride History
```sql
SELECT 
  r.from_city || ' → ' || r.to_city as route,
  r.departure_date,
  b.seats_booked,
  b.total_price,
  b.booking_status
FROM bookings b
JOIN rides r ON r.id = b.ride_id
WHERE b.passenger_id = $1
ORDER BY r.departure_date DESC;
```

### 3. Driver Earnings
```sql
SELECT 
  DATE_TRUNC('month', t.completed_at) as month,
  SUM(t.net_amount) as earnings,
  COUNT(DISTINCT t.booking_id) as completed_bookings
FROM transactions t
WHERE t.to_user_id = $1
  AND t.transaction_type = 'payout'
  AND t.status = 'completed'
GROUP BY month
ORDER BY month DESC;
```

## 🎯 Key Constraints

### Business Logic Enforced by DB

1. ✅ Drivers/Customers MUST have license_number
2. ✅ Passengers CANNOT have vehicles
3. ✅ Available seats ≤ total seats
4. ✅ One review per user per ride
5. ✅ Ratings must be 1-5
6. ✅ Future departure dates only
7. ✅ Unique license plates
8. ✅ Unique confirmation codes

---

**Complete database schema with 13 tables, 3 views, and automated triggers! 🚀**

