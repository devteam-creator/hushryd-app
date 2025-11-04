-- =============================================
-- FARE PRICING SYSTEM
-- =============================================
-- This schema manages dynamic fare pricing for rides
-- Allows admin to configure base rates, distance/time rates,
-- and special pricing rules

CREATE TYPE fare_calculation_type AS ENUM ('fixed', 'per_km', 'per_minute', 'per_km_plus_time');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE fare_rule_status AS ENUM ('active', 'inactive', 'scheduled');

-- Main Fare Pricing Table
CREATE TABLE fare_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calculation_type fare_calculation_type NOT NULL DEFAULT 'per_km_plus_time',
    
    -- Vehicle Type Specific (optional)
    vehicle_type VARCHAR(50), -- 'sedan', 'suv', 'van', 'luxury', 'economy', 'bus', null = applies to all
    
    -- Base Pricing
    base_fare DECIMAL(10,2) NOT NULL DEFAULT 0,
    minimum_fare DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Distance-based
    price_per_km DECIMAL(10,2) DEFAULT 0,
    free_km DECIMAL(5,2) DEFAULT 0, -- First X km free
    
    -- Time-based
    price_per_minute DECIMAL(10,2) DEFAULT 0,
    free_minutes INTEGER DEFAULT 0, -- First X minutes free
    
    -- Booking Fee
    booking_fee DECIMAL(10,2) DEFAULT 0,
    booking_fee_percentage DECIMAL(5,2) DEFAULT 0, -- % of total fare
    
    -- Platform Fee
    platform_fee DECIMAL(10,2) DEFAULT 0,
    platform_fee_percentage DECIMAL(5,2) DEFAULT 0, -- % of total fare
    
    -- Surge/Dynamic Pricing
    surge_multiplier DECIMAL(5,2) DEFAULT 1.00,
    surge_enabled BOOLEAN DEFAULT FALSE,
    
    -- Geographic Constraints
    applicable_cities TEXT[], -- Array of city names, null = all cities
    applicable_states TEXT[], -- Array of state names, null = all states
    
    -- Time Constraints
    valid_from_date DATE,
    valid_to_date DATE,
    valid_from_time TIME,
    valid_to_time TIME,
    valid_days_of_week day_of_week[], -- Array of days, null = all days
    
    -- Status & Priority
    status fare_rule_status DEFAULT 'active',
    priority INTEGER DEFAULT 0, -- Higher priority rules override lower ones
    
    -- Metadata
    notes TEXT,
    created_by UUID, -- Reference to admin who created it
    updated_by UUID, -- Reference to admin who last updated it
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_base_fare CHECK (base_fare >= 0),
    CONSTRAINT valid_minimum_fare CHECK (minimum_fare >= 0),
    CONSTRAINT valid_surge CHECK (surge_multiplier > 0)
);

-- Indexes for performance
CREATE INDEX idx_fare_pricing_vehicle_type ON fare_pricing(vehicle_type);
CREATE INDEX idx_fare_pricing_status ON fare_pricing(status);
CREATE INDEX idx_fare_pricing_priority ON fare_pricing(priority DESC);
CREATE INDEX idx_fare_pricing_dates ON fare_pricing(valid_from_date, valid_to_date);

-- Special Pricing Rules (for events, holidays, etc.)
CREATE TABLE fare_special_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Info
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rule_type VARCHAR(50) NOT NULL, -- 'holiday', 'event', 'weather', 'demand', 'promotional'
    
    -- Pricing Adjustments
    discount_percentage DECIMAL(5,2) DEFAULT 0, -- Negative for surcharge
    discount_amount DECIMAL(10,2) DEFAULT 0,
    surge_multiplier DECIMAL(5,2) DEFAULT 1.00,
    
    -- Conditions
    applicable_cities TEXT[],
    applicable_vehicle_types TEXT[],
    min_distance_km DECIMAL(10,2),
    max_distance_km DECIMAL(10,2),
    
    -- Validity
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    
    -- Status
    status fare_rule_status DEFAULT 'active',
    priority INTEGER DEFAULT 0,
    
    -- Usage Limits
    max_uses_per_user INTEGER,
    total_max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    
    -- Promo Code (if applicable)
    promo_code VARCHAR(50) UNIQUE,
    
    -- Metadata
    created_by UUID,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_dates CHECK (valid_to > valid_from)
);

CREATE INDEX idx_fare_special_rules_status ON fare_special_rules(status);
CREATE INDEX idx_fare_special_rules_dates ON fare_special_rules(valid_from, valid_to);
CREATE INDEX idx_fare_special_rules_promo ON fare_special_rules(promo_code);

-- Fare Calculation History (for auditing)
CREATE TABLE fare_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ride_id UUID REFERENCES rides(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Applied Rules
    base_fare_rule_id UUID REFERENCES fare_pricing(id),
    special_rules_applied JSONB, -- Array of applied special rule IDs and adjustments
    
    -- Calculation Breakdown
    base_fare DECIMAL(10,2) NOT NULL,
    distance_fare DECIMAL(10,2) DEFAULT 0,
    time_fare DECIMAL(10,2) DEFAULT 0,
    booking_fee DECIMAL(10,2) DEFAULT 0,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    surge_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_fare DECIMAL(10,2) NOT NULL,
    
    -- Trip Details
    distance_km DECIMAL(10,2),
    duration_minutes INTEGER,
    vehicle_type VARCHAR(50),
    
    -- Applied Multipliers
    surge_multiplier DECIMAL(5,2) DEFAULT 1.00,
    
    -- Timestamps
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_total CHECK (total_fare >= 0)
);

CREATE INDEX idx_fare_calculations_ride ON fare_calculations(ride_id);
CREATE INDEX idx_fare_calculations_booking ON fare_calculations(booking_id);
CREATE INDEX idx_fare_calculations_date ON fare_calculations(calculated_at);

-- Update trigger for fare_pricing
CREATE TRIGGER update_fare_pricing_updated_at 
BEFORE UPDATE ON fare_pricing 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Update trigger for fare_special_rules
CREATE TRIGGER update_fare_special_rules_updated_at 
BEFORE UPDATE ON fare_special_rules 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- View for active fare rules
CREATE VIEW active_fare_rules AS
SELECT 
    fp.*,
    CASE 
        WHEN fp.valid_from_date IS NOT NULL AND CURRENT_DATE < fp.valid_from_date THEN FALSE
        WHEN fp.valid_to_date IS NOT NULL AND CURRENT_DATE > fp.valid_to_date THEN FALSE
        WHEN fp.status != 'active' THEN FALSE
        ELSE TRUE
    END as is_currently_valid
FROM fare_pricing fp
WHERE fp.status = 'active'
ORDER BY fp.priority DESC;

-- View for fare pricing summary
CREATE VIEW fare_pricing_summary AS
SELECT 
    vehicle_type,
    COUNT(*) as total_rules,
    COUNT(*) FILTER (WHERE status = 'active') as active_rules,
    AVG(base_fare) as avg_base_fare,
    AVG(price_per_km) as avg_price_per_km,
    AVG(minimum_fare) as avg_minimum_fare
FROM fare_pricing
GROUP BY vehicle_type;

-- Function to get applicable fare for a ride
CREATE OR REPLACE FUNCTION get_applicable_fare(
    p_vehicle_type VARCHAR,
    p_city VARCHAR,
    p_state VARCHAR,
    p_distance_km DECIMAL,
    p_date DATE,
    p_time TIME,
    p_day_of_week day_of_week
)
RETURNS TABLE (
    fare_id UUID,
    fare_name VARCHAR,
    base_fare DECIMAL,
    price_per_km DECIMAL,
    price_per_minute DECIMAL,
    minimum_fare DECIMAL,
    surge_multiplier DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fp.id,
        fp.name,
        fp.base_fare,
        fp.price_per_km,
        fp.price_per_minute,
        fp.minimum_fare,
        fp.surge_multiplier
    FROM fare_pricing fp
    WHERE fp.status = 'active'
        AND (fp.vehicle_type IS NULL OR fp.vehicle_type = p_vehicle_type)
        AND (fp.applicable_cities IS NULL OR p_city = ANY(fp.applicable_cities))
        AND (fp.applicable_states IS NULL OR p_state = ANY(fp.applicable_states))
        AND (fp.valid_from_date IS NULL OR p_date >= fp.valid_from_date)
        AND (fp.valid_to_date IS NULL OR p_date <= fp.valid_to_date)
        AND (fp.valid_from_time IS NULL OR p_time >= fp.valid_from_time)
        AND (fp.valid_to_time IS NULL OR p_time <= fp.valid_to_time)
        AND (fp.valid_days_of_week IS NULL OR p_day_of_week = ANY(fp.valid_days_of_week))
    ORDER BY fp.priority DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

