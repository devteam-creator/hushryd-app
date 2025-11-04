-- HushRyd Database Schema (PostgreSQL)
-- Complete database for ride-sharing platform with three roles

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

CREATE TYPE user_role AS ENUM ('driver', 'customer', 'passenger');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending', 'banned');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'active',
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    
    -- Driver & Customer specific
    license_number VARCHAR(50) UNIQUE,
    license_expiry DATE,
    license_verified BOOLEAN DEFAULT FALSE,
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United Kingdom',
    
    -- Emergency contact (for passengers)
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Stats
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    total_rides INTEGER DEFAULT 0,
    completed_rides INTEGER DEFAULT 0,
    cancelled_rides INTEGER DEFAULT 0,
    
    -- Settings
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_license CHECK (
        (role IN ('driver', 'customer') AND license_number IS NOT NULL) OR 
        (role = 'passenger')
    )
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_license ON users(license_number);

-- =============================================
-- VEHICLES
-- =============================================

CREATE TYPE vehicle_type AS ENUM ('sedan', 'suv', 'van', 'luxury', 'economy', 'bus');
CREATE TYPE vehicle_status AS ENUM ('active', 'inactive', 'pending_verification', 'rejected');

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Info
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50) NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    
    -- Specifications
    vehicle_type vehicle_type NOT NULL,
    seating_capacity INTEGER NOT NULL,
    fuel_type VARCHAR(50),
    transmission VARCHAR(50),
    
    -- Documents
    registration_number VARCHAR(100) NOT NULL,
    registration_expiry DATE NOT NULL,
    insurance_number VARCHAR(100) NOT NULL,
    insurance_expiry DATE NOT NULL,
    insurance_provider VARCHAR(255),
    
    -- Photos
    photo_front TEXT,
    photo_back TEXT,
    photo_left TEXT,
    photo_right TEXT,
    photo_interior TEXT,
    
    -- Verification
    status vehicle_status DEFAULT 'pending_verification',
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    
    -- Stats
    total_rides INTEGER DEFAULT 0,
    total_distance_km DECIMAL(10,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_year CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    CONSTRAINT valid_capacity CHECK (seating_capacity >= 1 AND seating_capacity <= 60)
);

CREATE INDEX idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- =============================================
-- RIDES
-- =============================================

CREATE TYPE ride_type AS ENUM ('carpool', 'bus', 'private');
CREATE TYPE ride_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled', 'no_show');

CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publisher_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    
    -- Route
    from_city VARCHAR(255) NOT NULL,
    from_address TEXT,
    from_latitude DECIMAL(10,8),
    from_longitude DECIMAL(11,8),
    to_city VARCHAR(255) NOT NULL,
    to_address TEXT,
    to_latitude DECIMAL(10,8),
    to_longitude DECIMAL(11,8),
    
    -- Schedule
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    estimated_arrival_time TIME,
    actual_departure_time TIMESTAMP,
    actual_arrival_time TIMESTAMP,
    
    -- Pricing
    price_per_seat DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    
    -- Details
    ride_type ride_type NOT NULL,
    distance_km DECIMAL(10,2),
    duration_minutes INTEGER,
    status ride_status DEFAULT 'scheduled',
    
    -- Preferences
    allows_smoking BOOLEAN DEFAULT FALSE,
    allows_pets BOOLEAN DEFAULT TRUE,
    allows_music BOOLEAN DEFAULT TRUE,
    chattiness VARCHAR(20) DEFAULT 'moderate', -- quiet, moderate, chatty
    
    -- Additional
    description TEXT,
    special_instructions TEXT,
    luggage_space VARCHAR(50),
    wifi_available BOOLEAN DEFAULT FALSE,
    ac_available BOOLEAN DEFAULT TRUE,
    
    -- Stats
    booking_count INTEGER DEFAULT 0,
    confirmed_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    CONSTRAINT valid_seats CHECK (available_seats <= total_seats AND available_seats >= 0),
    CONSTRAINT valid_price CHECK (price_per_seat >= 0),
    CONSTRAINT future_departure CHECK (departure_date >= CURRENT_DATE)
);

CREATE INDEX idx_rides_publisher ON rides(publisher_id);
CREATE INDEX idx_rides_vehicle ON rides(vehicle_id);
CREATE INDEX idx_rides_route ON rides(from_city, to_city);
CREATE INDEX idx_rides_date ON rides(departure_date);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_type ON rides(ride_type);

-- =============================================
-- BOOKINGS
-- =============================================

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID NOT NULL REFERENCES rides(id),
    passenger_id UUID NOT NULL REFERENCES users(id),
    
    -- Booking Details
    seats_booked INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    
    -- Pickup & Drop
    pickup_location TEXT,
    pickup_latitude DECIMAL(10,8),
    pickup_longitude DECIMAL(11,8),
    dropoff_location TEXT,
    dropoff_latitude DECIMAL(10,8),
    dropoff_longitude DECIMAL(11,8),
    
    -- Status
    booking_status booking_status DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    
    -- Special Requests
    special_requests TEXT,
    luggage_count INTEGER DEFAULT 0,
    
    -- Confirmation
    confirmation_code VARCHAR(10) UNIQUE,
    qr_code_url TEXT,
    
    -- Cancellation
    cancelled_at TIMESTAMP,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    refund_amount DECIMAL(10,2),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT valid_seats_booked CHECK (seats_booked > 0),
    CONSTRAINT valid_total_price CHECK (total_price > 0)
);

CREATE INDEX idx_bookings_ride ON bookings(ride_id);
CREATE INDEX idx_bookings_passenger ON bookings(passenger_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_code);

-- =============================================
-- PAYMENTS & TRANSACTIONS
-- =============================================

CREATE TYPE transaction_type AS ENUM ('booking', 'refund', 'payout', 'cancellation_fee', 'platform_fee');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'reversed');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    
    -- Parties
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    
    -- Transaction Details
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status transaction_status DEFAULT 'pending',
    
    -- Payment Method
    payment_method VARCHAR(50), -- card, bank_transfer, wallet, etc.
    payment_provider VARCHAR(100), -- stripe, paypal, etc.
    provider_transaction_id VARCHAR(255),
    
    -- Fees
    platform_fee DECIMAL(10,2) DEFAULT 0,
    processing_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    
    -- Metadata
    description TEXT,
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP,
    failure_reason TEXT,
    
    CONSTRAINT valid_amount CHECK (amount >= 0)
);

CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_from_user ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user ON transactions(to_user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- =============================================
-- REVIEWS & RATINGS
-- =============================================

CREATE TYPE review_type AS ENUM ('driver_review', 'passenger_review', 'ride_review');

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID NOT NULL REFERENCES rides(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Parties
    from_user_id UUID NOT NULL REFERENCES users(id),
    to_user_id UUID NOT NULL REFERENCES users(id),
    
    -- Review Details
    review_type review_type NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    
    -- Detailed Ratings (optional)
    punctuality_rating INTEGER,
    cleanliness_rating INTEGER,
    communication_rating INTEGER,
    safety_rating INTEGER,
    
    -- Moderation
    is_visible BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    moderated_by UUID REFERENCES users(id),
    moderated_at TIMESTAMP,
    
    -- Response
    response TEXT,
    response_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT valid_detailed_ratings CHECK (
        (punctuality_rating IS NULL OR (punctuality_rating >= 1 AND punctuality_rating <= 5)) AND
        (cleanliness_rating IS NULL OR (cleanliness_rating >= 1 AND cleanliness_rating <= 5)) AND
        (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)) AND
        (safety_rating IS NULL OR (safety_rating >= 1 AND safety_rating <= 5))
    ),
    CONSTRAINT unique_review UNIQUE (ride_id, from_user_id, to_user_id)
);

CREATE INDEX idx_reviews_ride ON reviews(ride_id);
CREATE INDEX idx_reviews_from_user ON reviews(from_user_id);
CREATE INDEX idx_reviews_to_user ON reviews(to_user_id);
CREATE INDEX idx_reviews_type ON reviews(review_type);

-- =============================================
-- VERIFICATION DOCUMENTS
-- =============================================

CREATE TYPE document_type AS ENUM ('drivers_license', 'vehicle_registration', 'insurance', 'id_card', 'selfie', 'other');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

CREATE TABLE verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    
    -- Document Details
    document_type document_type NOT NULL,
    document_number VARCHAR(100),
    document_url TEXT NOT NULL,
    document_back_url TEXT,
    
    -- Verification
    status document_status DEFAULT 'pending',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Expiry
    expiry_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT user_or_vehicle CHECK (
        (user_id IS NOT NULL AND vehicle_id IS NULL) OR 
        (user_id IS NULL AND vehicle_id IS NOT NULL)
    )
);

CREATE INDEX idx_verification_user ON verification_documents(user_id);
CREATE INDEX idx_verification_vehicle ON verification_documents(vehicle_id);
CREATE INDEX idx_verification_status ON verification_documents(status);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TYPE notification_type AS ENUM ('booking', 'cancellation', 'review', 'payment', 'verification', 'ride_reminder', 'system');
CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Notification Details
    type notification_type NOT NULL,
    priority notification_priority DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Action
    action_url TEXT,
    action_label VARCHAR(100),
    
    -- Related Entities
    related_ride_id UUID REFERENCES rides(id),
    related_booking_id UUID REFERENCES bookings(id),
    related_user_id UUID REFERENCES users(id),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    
    -- Delivery Channels
    push_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- =============================================
-- CHAT MESSAGES
-- =============================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID REFERENCES rides(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Participants
    participant1_id UUID NOT NULL REFERENCES users(id),
    participant2_id UUID NOT NULL REFERENCES users(id),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_message_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_conversation UNIQUE (ride_id, participant1_id, participant2_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    
    -- Message Content
    message TEXT NOT NULL,
    attachment_url TEXT,
    attachment_type VARCHAR(50),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- =============================================
-- FAVORITES & PREFERENCES
-- =============================================

CREATE TABLE favorite_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    from_city VARCHAR(255) NOT NULL,
    to_city VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_favorite_route UNIQUE (user_id, from_city, to_city)
);

CREATE TABLE blocked_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    blocked_user_id UUID NOT NULL REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_block UNIQUE (user_id, blocked_user_id),
    CONSTRAINT no_self_block CHECK (user_id != blocked_user_id)
);

-- =============================================
-- AUDIT LOGS
-- =============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- =============================================
-- VIEWS FOR ANALYTICS
-- =============================================

-- User Statistics View
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.rating,
    u.review_count,
    COUNT(DISTINCT CASE WHEN u.role IN ('driver', 'customer') THEN r.id END) as rides_published,
    COUNT(DISTINCT CASE WHEN u.role = 'passenger' THEN b.id END) as rides_booked,
    COALESCE(SUM(CASE WHEN t.to_user_id = u.id THEN t.amount END), 0) as total_earned,
    COALESCE(SUM(CASE WHEN t.from_user_id = u.id THEN t.amount END), 0) as total_spent
FROM users u
LEFT JOIN rides r ON r.publisher_id = u.id
LEFT JOIN bookings b ON b.passenger_id = u.id
LEFT JOIN transactions t ON t.from_user_id = u.id OR t.to_user_id = u.id
GROUP BY u.id;

-- Ride Performance View
CREATE VIEW ride_performance AS
SELECT 
    r.id,
    r.from_city,
    r.to_city,
    r.departure_date,
    r.price_per_seat,
    r.total_seats,
    r.available_seats,
    (r.total_seats - r.available_seats) as seats_booked,
    ROUND((r.total_seats - r.available_seats)::DECIMAL / r.total_seats * 100, 2) as occupancy_rate,
    COUNT(b.id) as total_bookings,
    SUM(b.total_price) as total_revenue
FROM rides r
LEFT JOIN bookings b ON b.ride_id = r.id AND b.booking_status = 'confirmed'
GROUP BY r.id;

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update user rating when new review is added
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM reviews
        WHERE to_user_id = NEW.to_user_id AND is_visible = TRUE
    ),
    review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE to_user_id = NEW.to_user_id AND is_visible = TRUE
    )
    WHERE id = NEW.to_user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_on_review AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Update available seats when booking is confirmed
CREATE OR REPLACE FUNCTION update_available_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_status = 'confirmed' AND (OLD IS NULL OR OLD.booking_status != 'confirmed') THEN
        UPDATE rides
        SET available_seats = available_seats - NEW.seats_booked
        WHERE id = NEW.ride_id;
    ELSIF OLD.booking_status = 'confirmed' AND NEW.booking_status = 'cancelled' THEN
        UPDATE rides
        SET available_seats = available_seats + NEW.seats_booked
        WHERE id = NEW.ride_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seats_on_booking AFTER INSERT OR UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_available_seats();

