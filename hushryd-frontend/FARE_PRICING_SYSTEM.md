# Fare Pricing System - Complete Guide

## Overview

The Fare Pricing System allows administrators to create, manage, and customize fare rules for the HushRyd ride-sharing platform. This system supports dynamic pricing, surge pricing, vehicle-specific rates, geographic restrictions, and time-based rules.

## Table of Contents

1. [Features](#features)
2. [Database Schema](#database-schema)
3. [Admin Panel Usage](#admin-panel-usage)
4. [API Service](#api-service)
5. [Fare Calculation Logic](#fare-calculation-logic)
6. [Examples](#examples)

---

## Features

### Core Features

- ✅ **Create, Update, Delete** fare pricing rules
- ✅ **Multiple Calculation Types**:
  - Fixed fare
  - Per kilometer
  - Per minute
  - Combined (per km + per minute)
- ✅ **Vehicle Type Specific** pricing (sedan, SUV, luxury, etc.)
- ✅ **Geographic Restrictions** (cities, states)
- ✅ **Time-based Rules** (dates, times, days of week)
- ✅ **Surge Pricing** with custom multipliers
- ✅ **Priority System** for rule precedence
- ✅ **Booking and Platform Fees** (fixed or percentage)
- ✅ **Minimum Fare** enforcement
- ✅ **Free Distance/Time** allowances

### Advanced Features

- 🔄 **Bulk Updates** for multiple rules
- 📊 **Statistics & Analytics**
- 📤 **Export/Import** (CSV format)
- 🔁 **Duplicate Rules** for quick setup
- ✅ **Validation** before saving
- 📝 **Audit Trail** (coming soon)

---

## Database Schema

### Main Tables

#### 1. `fare_pricing` Table

Stores all fare pricing rules with the following key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `name` | VARCHAR | Rule name (e.g., "Standard Sedan Pricing") |
| `calculation_type` | ENUM | fixed, per_km, per_minute, per_km_plus_time |
| `vehicle_type` | VARCHAR | sedan, suv, van, luxury, economy, bus (null = all) |
| `base_fare` | DECIMAL | Starting fare for the ride |
| `minimum_fare` | DECIMAL | Minimum charge regardless of distance/time |
| `price_per_km` | DECIMAL | Rate per kilometer |
| `price_per_minute` | DECIMAL | Rate per minute |
| `booking_fee` | DECIMAL | Fixed booking fee |
| `platform_fee` | DECIMAL | Fixed platform fee |
| `surge_multiplier` | DECIMAL | Multiplier for surge pricing (1.0 = no surge) |
| `surge_enabled` | BOOLEAN | Whether surge pricing is active |
| `status` | ENUM | active, inactive, scheduled |
| `priority` | INTEGER | Higher number = higher priority |

#### 2. `fare_special_rules` Table

Stores special pricing rules for events, holidays, promotions:

- Discount percentages or amounts
- Promo codes
- Usage limits
- Time validity periods
- Geographic and vehicle type restrictions

#### 3. `fare_calculations` Table

Audit log of all fare calculations:

- Tracks which rules were applied
- Stores calculation breakdown
- Links to rides and bookings
- Useful for analytics and dispute resolution

### Database Setup

```bash
# Run the schema creation script
psql -U your_username -d your_database -f database/fare_pricing_schema.sql

# Or use Prisma migrations
npx prisma migrate dev --name add_fare_pricing
```

---

## Admin Panel Usage

### Accessing the Fare Pricing Panel

1. Log in to the admin panel
2. Navigate to **Dashboard** → **Fare Pricing** (💵 icon)
3. Or go to **Finance** → **Fare Pricing** (for finance admins)

### Creating a New Fare Rule

1. Click **"+ Add Fare Rule"** button
2. Fill in the form:

#### Basic Information
- **Rule Name** (required): e.g., "Weekend Surge Pricing"
- **Description** (optional): Brief explanation
- **Vehicle Type**: Select specific type or "All"

#### Pricing Details
- **Base Fare**: Starting charge for the ride
- **Minimum Fare**: Minimum total charge
- **Price per KM**: Rate for each kilometer
- **Price per Minute**: Rate for each minute
- **Booking Fee**: Fixed booking charge
- **Platform Fee**: Fixed platform charge

#### Surge Pricing
- Toggle **"Enable Surge Pricing"**
- Set **Surge Multiplier** (e.g., 1.5 for 50% increase)

#### Status & Priority
- **Status**: active, inactive, or scheduled
- **Priority**: Higher numbers take precedence (0-100 recommended)

3. Click **"Create"** to save

### Editing a Fare Rule

1. Click on a fare rule row in the table, or
2. Click the **"Edit"** button on the rule
3. Modify the fields as needed
4. Click **"Update"** to save changes

### Deleting a Fare Rule

1. Click the **"Delete"** button on the rule
2. Confirm the deletion
3. ⚠️ **Warning**: This action cannot be undone

### Enabling/Disabling Rules

- Click the **"Enable"** or **"Disable"** button
- Rules can be disabled without deletion for future use

### Filtering and Searching

- **Search**: Type in the search bar to filter by name/description
- **Vehicle Type Filter**: Select specific vehicle types
- **Status Filter**: Filter by active, inactive, or scheduled

---

## API Service

### farePricingService Methods

```typescript
import { farePricingService } from './services/farePricingService';

// Get all fares
const fares = await farePricingService.getAllFares({
  status: 'active',
  vehicleType: 'sedan'
});

// Get single fare
const fare = await farePricingService.getFareById('fare-id');

// Create new fare
const newFare = await farePricingService.createFare({
  name: 'New Fare Rule',
  calculationType: 'per_km_plus_time',
  baseFare: 50,
  minimumFare: 80,
  // ... other fields
});

// Update fare
const updatedFare = await farePricingService.updateFare('fare-id', {
  baseFare: 60,
  status: 'active'
});

// Delete fare
await farePricingService.deleteFare('fare-id');

// Calculate fare
const calculation = await farePricingService.calculateFareEstimate({
  vehicleType: 'sedan',
  distanceKm: 15.5,
  durationMinutes: 35,
  city: 'Mumbai',
  date: new Date()
});

console.log(`Total Fare: ${calculation.totalFare}`);
console.log('Breakdown:', calculation.breakdown);
```

---

## Fare Calculation Logic

### Calculation Flow

1. **Find Applicable Rule**
   - Match vehicle type (or null for all)
   - Check geographic restrictions (city/state)
   - Verify time constraints (date range, time range, day of week)
   - Select highest priority rule that matches

2. **Calculate Base Components**
   ```
   Base Fare: Fixed starting amount
   + Distance Fare: (distance - free_km) × price_per_km
   + Time Fare: (duration - free_minutes) × price_per_minute
   ```

3. **Apply Surge Pricing** (if enabled)
   ```
   Subtotal × surge_multiplier
   ```

4. **Add Fees**
   ```
   + Booking Fee (fixed + percentage of subtotal)
   + Platform Fee (fixed + percentage of subtotal)
   ```

5. **Apply Discounts** (if applicable)
   ```
   - Discount Amount or Percentage
   ```

6. **Enforce Minimum Fare**
   ```
   Final Amount = MAX(calculated_total, minimum_fare)
   ```

### Priority System

When multiple rules match, the system uses **priority** to determine which rule to apply:

- **Higher priority number** = Takes precedence
- If priorities are equal, **most recently created** rule wins
- **Recommended priority ranges**:
  - 0-10: Standard pricing
  - 11-50: Regional/vehicle-specific pricing
  - 51-100: Special events/surge pricing

---

## Examples

### Example 1: Standard Sedan Pricing

```typescript
{
  name: "Standard Sedan Pricing",
  calculationType: "per_km_plus_time",
  vehicleType: "sedan",
  baseFare: 50,          // ₹50 base
  minimumFare: 80,       // Minimum ₹80
  pricePerKm: 12,        // ₹12 per km
  pricePerMinute: 2,     // ₹2 per minute
  bookingFee: 10,        // ₹10 booking fee
  platformFee: 15,       // ₹15 platform fee
  surgeMultiplier: 1.0,  // No surge
  status: "active",
  priority: 5
}

// For a 10km, 25-minute ride:
// Base: ₹50
// Distance: 10km × ₹12 = ₹120
// Time: 25min × ₹2 = ₹50
// Booking Fee: ₹10
// Platform Fee: ₹15
// Total: ₹245
```

### Example 2: Weekend Surge Pricing

```typescript
{
  name: "Weekend Surge Pricing",
  calculationType: "per_km_plus_time",
  vehicleType: null,     // Applies to all vehicles
  baseFare: 60,
  minimumFare: 100,
  pricePerKm: 15,
  pricePerMinute: 2.5,
  bookingFee: 12,
  platformFee: 18,
  surgeMultiplier: 1.5,  // 50% surge
  surgeEnabled: true,
  validDaysOfWeek: ["saturday", "sunday"],
  status: "active",
  priority: 50           // High priority to override standard pricing
}
```

### Example 3: Luxury Vehicle Pricing

```typescript
{
  name: "Luxury Vehicle Premium",
  calculationType: "per_km_plus_time",
  vehicleType: "luxury",
  baseFare: 150,
  minimumFare: 250,
  pricePerKm: 25,
  pricePerMinute: 5,
  bookingFee: 25,
  platformFee: 30,
  surgeMultiplier: 1.0,
  freeKm: 2,             // First 2km free
  freeMinutes: 10,       // First 10min free
  applicableCities: ["Mumbai", "Delhi"],
  status: "active",
  priority: 10
}
```

### Example 4: Night Time Pricing

```typescript
{
  name: "Night Time Surcharge",
  calculationType: "per_km_plus_time",
  vehicleType: null,
  baseFare: 70,
  minimumFare: 120,
  pricePerKm: 18,
  pricePerMinute: 3,
  bookingFee: 15,
  platformFee: 20,
  surgeMultiplier: 1.3,  // 30% surge
  surgeEnabled: true,
  validFromTime: "22:00:00",
  validToTime: "06:00:00",
  status: "active",
  priority: 40
}
```

---

## Best Practices

### 1. Priority Management
- Keep standard pricing at priority 0-10
- Use 11-50 for vehicle/location specific
- Reserve 51+ for temporary/event pricing

### 2. Testing
- Always create new rules as **"inactive"** first
- Test calculations thoroughly before activating
- Use **"scheduled"** status for future pricing

### 3. Documentation
- Use clear, descriptive names
- Add detailed descriptions
- Include notes about why the rule was created

### 4. Geographic Restrictions
- Start with city-level restrictions
- Expand to state-level only if needed
- Leave empty for nationwide rules

### 5. Surge Pricing
- Use moderately (1.2x - 2.0x recommended)
- Clearly communicate to users
- Monitor customer feedback

---

## Troubleshooting

### Issue: Multiple rules matching

**Solution**: Check priority values. Higher priority wins.

### Issue: Fare lower than expected

**Solution**: Check if minimum fare is being applied.

### Issue: Rule not applying

**Solution**: Verify:
- Status is "active"
- Geographic restrictions match
- Time constraints are correct
- Vehicle type matches (or is null)

### Issue: Calculation discrepancies

**Solution**: Review the `fare_calculations` table for audit trail.

---

## Future Enhancements

- [ ] Dynamic surge based on demand
- [ ] Weather-based pricing
- [ ] Route-specific pricing
- [ ] Customer segment pricing
- [ ] Loyalty discounts
- [ ] Corporate contracts
- [ ] API rate limiting
- [ ] Real-time pricing updates
- [ ] A/B testing for pricing

---

## Support

For questions or issues:
- Email: admin@hushryd.com
- Internal Documentation: `/docs/fare-pricing`
- Slack Channel: #pricing-support

---

## Change Log

### Version 1.0.0 (2024-10-15)
- Initial release
- Basic CRUD operations
- Fare calculation engine
- Admin panel interface
- Database schema
- API service

---

**Last Updated**: October 15, 2024  
**Version**: 1.0.0  
**Maintained by**: HushRyd Platform Team

