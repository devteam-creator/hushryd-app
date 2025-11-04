-- HushRyd Database Seed Data
-- Sample data for testing and development

-- =============================================
-- SEED USERS
-- =============================================

-- Driver 1
INSERT INTO users (
  id, email, phone, password_hash, name, role,
  license_number, license_expiry, license_verified,
  rating, review_count, is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'sarah.driver@hushryd.com',
  '+447700900001',
  '$2b$10$dummy.hash.for.testing.only',
  'Sarah Johnson',
  'driver',
  'DL123456',
  '2028-12-31',
  TRUE,
  4.8,
  127,
  TRUE
);

-- Driver 2
INSERT INTO users (
  id, email, phone, password_hash, name, role,
  license_number, license_expiry, license_verified,
  rating, review_count, is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'michael.driver@hushryd.com',
  '+447700900002',
  '$2b$10$dummy.hash.for.testing.only',
  'Michael Chen',
  'driver',
  'DL789012',
  '2027-06-30',
  TRUE,
  4.9,
  203,
  TRUE
);

-- Customer 1
INSERT INTO users (
  id, email, phone, password_hash, name, role,
  license_number, license_expiry, license_verified,
  rating, review_count, is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'emma.customer@hushryd.com',
  '+447700900003',
  '$2b$10$dummy.hash.for.testing.only',
  'Emma Wilson',
  'customer',
  'DL345678',
  '2029-03-15',
  TRUE,
  4.7,
  89,
  TRUE
);

-- Passenger 1
INSERT INTO users (
  id, email, phone, password_hash, name, role,
  emergency_contact_name, emergency_contact_phone,
  rating, review_count, is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'david.passenger@hushryd.com',
  '+447700900004',
  '$2b$10$dummy.hash.for.testing.only',
  'David Brown',
  'passenger',
  'Jane Brown',
  '+447700900014',
  4.6,
  45,
  TRUE
);

-- Passenger 2
INSERT INTO users (
  id, email, phone, password_hash, name, role,
  emergency_contact_name, emergency_contact_phone,
  rating, review_count, is_verified
) VALUES (
  '550e8400-e29b-41d4-a716-446655440005',
  'lisa.passenger@hushryd.com',
  '+447700900005',
  '$2b$10$dummy.hash.for.testing.only',
  'Lisa Anderson',
  'passenger',
  'Mark Anderson',
  '+447700900015',
  4.5,
  32,
  TRUE
);

-- =============================================
-- SEED VEHICLES
-- =============================================

-- Vehicle 1 (Driver 1)
INSERT INTO vehicles (
  id, owner_id, make, model, year, color, license_plate,
  vehicle_type, seating_capacity, registration_number,
  registration_expiry, insurance_number, insurance_expiry,
  status, verified_at
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'Toyota', 'Prius', 2020, 'Silver', 'ABC 123',
  'sedan', 4, 'REG123456', '2025-12-31', 'INS789012', '2025-12-31',
  'active', CURRENT_TIMESTAMP
);

-- Vehicle 2 (Driver 2)
INSERT INTO vehicles (
  id, owner_id, make, model, year, color, license_plate,
  vehicle_type, seating_capacity, registration_number,
  registration_expiry, insurance_number, insurance_expiry,
  status, verified_at
) VALUES (
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440002',
  'Honda', 'Civic', 2021, 'Blue', 'XYZ 789',
  'sedan', 4, 'REG789012', '2026-06-30', 'INS345678', '2026-06-30',
  'active', CURRENT_TIMESTAMP
);

-- Vehicle 3 (Customer 1)
INSERT INTO vehicles (
  id, owner_id, make, model, year, color, license_plate,
  vehicle_type, seating_capacity, registration_number,
  registration_expiry, insurance_number, insurance_expiry,
  status, verified_at
) VALUES (
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003',
  'Mercedes', 'E-Class', 2022, 'Black', 'LUX 001',
  'luxury', 4, 'REG345678', '2026-12-31', 'INS901234', '2026-12-31',
  'active', CURRENT_TIMESTAMP
);

-- Vehicle 4 (Driver 1 - Bus)
INSERT INTO vehicles (
  id, owner_id, make, model, year, color, license_plate,
  vehicle_type, seating_capacity, registration_number,
  registration_expiry, insurance_number, insurance_expiry,
  status, verified_at
) VALUES (
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  'Ford', 'Transit', 2019, 'White', 'VAN 456',
  'van', 8, 'REG456789', '2025-08-31', 'INS567890', '2025-08-31',
  'active', CURRENT_TIMESTAMP
);

-- =============================================
-- SEED RIDES
-- =============================================

-- Ride 1 (Carpool - Future)
INSERT INTO rides (
  id, publisher_id, vehicle_id, from_city, to_city,
  departure_date, departure_time, price_per_seat,
  total_seats, available_seats, ride_type,
  distance_km, duration_minutes, allows_smoking, allows_pets,
  description, status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'London', 'Manchester',
  CURRENT_DATE + INTERVAL '3 days', '09:00', 25.00,
  3, 2, 'carpool',
  320, 270, FALSE, TRUE,
  'Comfortable ride with air conditioning. Can make short stops if needed.',
  'scheduled'
);

-- Ride 2 (Carpool - Future)
INSERT INTO rides (
  id, publisher_id, vehicle_id, from_city, to_city,
  departure_date, departure_time, price_per_seat,
  total_seats, available_seats, ride_type,
  distance_km, duration_minutes, allows_smoking, allows_pets,
  status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440002',
  'Manchester', 'London',
  CURRENT_DATE + INTERVAL '3 days', '14:30', 28.00,
  3, 3, 'carpool',
  320, 255, FALSE, FALSE,
  'scheduled'
);

-- Ride 3 (Private - Future)
INSERT INTO rides (
  id, publisher_id, vehicle_id, from_city, to_city,
  departure_date, departure_time, price_per_seat,
  total_seats, available_seats, ride_type,
  distance_km, duration_minutes, allows_smoking, allows_pets,
  description, status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440003',
  'Birmingham', 'London',
  CURRENT_DATE + INTERVAL '4 days', '08:00', 45.00,
  3, 2, 'private',
  200, 150, FALSE, FALSE,
  'Luxury private ride service. Professional and comfortable.',
  'scheduled'
);

-- Ride 4 (Bus - Future)
INSERT INTO rides (
  id, publisher_id, vehicle_id, from_city, to_city,
  departure_date, departure_time, price_per_seat,
  total_seats, available_seats, ride_type,
  distance_km, duration_minutes, wifi_available,
  description, status
) VALUES (
  '770e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440004',
  'London', 'Paris',
  CURRENT_DATE + INTERVAL '5 days', '07:00', 35.00,
  45, 23, 'bus',
  450, 450, TRUE,
  'Direct bus service with WiFi and restroom facilities.',
  'scheduled'
);

-- =============================================
-- SEED BOOKINGS
-- =============================================

-- Booking 1
INSERT INTO bookings (
  id, ride_id, passenger_id, seats_booked, total_price,
  booking_status, payment_status, confirmation_code,
  confirmed_at
) VALUES (
  '880e8400-e29b-41d4-a716-446655440001',
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440004',
  1, 25.00,
  'confirmed', 'paid', 'HR12345',
  CURRENT_TIMESTAMP
);

-- Booking 2
INSERT INTO bookings (
  id, ride_id, passenger_id, seats_booked, total_price,
  booking_status, payment_status, confirmation_code
) VALUES (
  '880e8400-e29b-41d4-a716-446655440002',
  '770e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440005',
  1, 45.00,
  'pending', 'pending', 'HR67890'
);

-- =============================================
-- SEED TRANSACTIONS
-- =============================================

-- Transaction 1 (Booking payment)
INSERT INTO transactions (
  id, booking_id, from_user_id, to_user_id,
  transaction_type, amount, platform_fee, processing_fee, net_amount,
  status, payment_method, completed_at
) VALUES (
  '990e8400-e29b-41d4-a716-446655440001',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  'booking', 25.00, 2.50, 0.50, 22.00,
  'completed', 'card', CURRENT_TIMESTAMP
);

-- =============================================
-- SEED REVIEWS
-- =============================================

-- Review 1
INSERT INTO reviews (
  id, ride_id, booking_id, from_user_id, to_user_id,
  review_type, rating, comment,
  punctuality_rating, cleanliness_rating, communication_rating, safety_rating
) VALUES (
  'aa0e8400-e29b-41d4-a716-446655440001',
  '770e8400-e29b-41d4-a716-446655440001',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  'driver_review', 5, 'Great driver! Very punctual and friendly. Smooth ride.',
  5, 5, 5, 5
);

-- Review 2
INSERT INTO reviews (
  id, ride_id, booking_id, from_user_id, to_user_id,
  review_type, rating, comment,
  punctuality_rating, cleanliness_rating, communication_rating, safety_rating
) VALUES (
  'aa0e8400-e29b-41d4-a716-446655440002',
  '770e8400-e29b-41d4-a716-446655440001',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440004',
  'passenger_review', 5, 'Great passenger! On time and friendly.',
  5, 5, 5, 5
);

-- =============================================
-- SEED FAVORITE ROUTES
-- =============================================

INSERT INTO favorite_routes (user_id, from_city, to_city, nickname) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', 'London', 'Manchester', 'Work Commute'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Birmingham', 'London', 'Weekend Trip');

-- =============================================
-- SEED NOTIFICATIONS
-- =============================================

INSERT INTO notifications (
  user_id, type, priority, title, message,
  related_booking_id, is_read
) VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'booking', 'high',
  'Booking Confirmed',
  'Your ride from London to Manchester is confirmed!',
  '880e8400-e29b-41d4-a716-446655440001',
  FALSE
);

-- =============================================
-- VERIFICATION
-- =============================================

-- Check counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Rides', COUNT(*) FROM rides
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;

-- Verify user roles
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Verify ride types
SELECT ride_type, COUNT(*) as count FROM rides GROUP BY ride_type;

-- Show sample data
SELECT 
  u.name as driver,
  r.from_city || ' → ' || r.to_city as route,
  r.departure_date,
  r.price_per_seat,
  r.available_seats,
  r.ride_type
FROM rides r
JOIN users u ON u.id = r.publisher_id
ORDER BY r.departure_date;

