# HushRyd - Three Role System Documentation

## Overview

HushRyd implements a sophisticated three-role system where each user type has distinct capabilities, requirements, and workflows.

---

## 🚗 Role 1: DRIVER

### Description
Professional drivers who offer rides using multiple registered vehicles. Drivers are the backbone of the platform, providing reliable transportation services.

### Authentication Requirements (Unique & Mandatory)
- ✅ **Driver License Number** - Unique identifier, must be valid
- ✅ **License Expiry Date** - Must be current
- ✅ **Email & Password** - Standard authentication
- ✅ **Phone Number** - For contact and verification
- ✅ **Full Name** - Legal name matching license

### Unique Features
1. **Multiple Vehicle Management**
   - Add unlimited vehicles to account
   - Each vehicle requires:
     - Make & Model
     - Year & Color
     - License Plate (unique)
     - Registration Number
     - Insurance Expiry
     - Seating Capacity
     - Vehicle Type (Economy, Sedan, SUV, Van, Luxury)

2. **Ride Publishing**
   - Publish carpool rides (shared seats)
   - Publish bus rides (large capacity)
   - Set pricing per seat
   - Define route and schedule
   - Set ride preferences (pets, smoking, music, chattiness)

3. **Professional Badge**
   - "🚗 Professional Driver" indicator on rides
   - Higher trust rating display
   - Priority in search results

4. **Vehicle Verification Process**
   - Submit documents for each vehicle
   - Admin review within 24 hours
   - Verified badge on approved vehicles
   - Only verified vehicles can be used for rides

### User Flow
```
1. Register → Select "Driver" role
2. Enter personal details + License info
3. Login to account
4. Navigate to Profile → "My Vehicles"
5. Add first vehicle with all details
6. Wait for vehicle verification
7. Once verified → Publish rides
8. Manage bookings and earn money
```

### Example Use Case
**James** is a professional driver with a Toyota Prius and a Ford Transit van. He:
- Registers as a driver with his license DL123456
- Adds both vehicles to his account
- Publishes daily carpool rides (London-Manchester) with the Prius
- Publishes weekend bus trips (London-Paris) with the van
- Manages multiple bookings across both vehicles
- Earns revenue from both services

---

## 🚙 Role 2: CUSTOMER

### Description
Private vehicle owners who start rides with their personal vehicles. Customers offer private, premium ride services.

### Authentication Requirements (Unique & Mandatory)
- ✅ **Driver License Number** - Must be valid and unique
- ✅ **License Expiry Date** - Must be current
- ✅ **Personal Vehicle Information** - Mandatory at signup:
  - Vehicle Make (e.g., Mercedes)
  - Vehicle Model (e.g., E-Class)
  - License Plate Number (unique)
  - Registration Number
  - Insurance Details
  - Seating Capacity
  - Vehicle Type
- ✅ **Email & Password** - Standard authentication
- ✅ **Phone Number** - Contact verification
- ✅ **Full Name** - Identity verification

### Unique Features
1. **Private Ride Service**
   - Offer premium, private rides
   - Direct point-to-point service
   - No shared seats with strangers
   - Custom pricing control
   - Flexible scheduling

2. **Single/Multiple Vehicle Registration**
   - Register primary vehicle at signup
   - Can add more vehicles later
   - Each vehicle needs verification
   - Vehicle must be personally owned

3. **Private Ride Badge**
   - "🚙 Private Ride" indicator
   - Premium service designation
   - Higher price point justified

4. **Ride Publishing**
   - Publish "private" type rides
   - Full control over routes
   - Set custom rates
   - Choose clients

### User Flow
```
1. Register → Select "Customer" role
2. Enter personal details + License info
3. Add vehicle details (mandatory):
   - Make: Mercedes
   - Model: E-Class
   - License Plate: LUX 001
   - Etc.
4. Submit for verification
5. Once verified → Start private rides
6. Accept booking requests
7. Provide premium service
```

### Example Use Case
**Emma** owns a luxury Mercedes E-Class and wants to earn extra income. She:
- Registers as a customer with license DL345678
- Provides complete vehicle details during registration
- Waits for vehicle verification (24 hours)
- Starts private rides (Birmingham-Heathrow Airport)
- Charges premium rates for luxury service
- Accepts pre-booked rides only
- Manages single vehicle operations

### Key Difference from Driver
- **Customers** use their personal vehicle
- **Drivers** can operate a fleet
- **Customers** offer private rides (no shared seats)
- **Drivers** offer carpool rides (shared seats)

---

## 🎫 Role 3: PASSENGER

### Description
Users who book and travel on rides. Passengers are the consumers of the platform, using rides from drivers and customers.

### Authentication Requirements (Mandatory)
- ✅ **Passenger Details** - Complete profile:
  - Full Name
  - Email & Password
  - Phone Number
  - Profile Photo (optional)
  - Emergency Contact Name
  - Emergency Contact Phone
- ✅ **Identity Verification** - Profile authentication
- ✅ **Contact Information** - Must be reachable

### Unique Features
1. **Ride Booking**
   - Search all ride types (carpool, bus, private)
   - Filter by:
     - Pickup location
     - Drop location
     - Date & time
     - Number of passengers
     - Price range
     - Ride type
   - Book multiple seats
   - Instant confirmation

2. **Booking Management**
   - View upcoming rides
   - Cancel bookings (with policy)
   - Track ride status
   - Contact driver/customer

3. **Review System**
   - Rate drivers and customers
   - Write detailed reviews
   - View others' reviews
   - Build trust score

4. **Safety Features**
   - Share ride details with emergency contact
   - SOS button access
   - Trip tracking
   - Driver/vehicle verification check

### User Flow
```
1. Register → Select "Passenger" role
2. Enter personal details
3. Add emergency contact
4. Complete profile
5. Search for rides
6. Select ride and book seats
7. Make payment
8. Get ride details
9. Complete journey
10. Rate experience
```

### Example Use Case
**David** needs to travel from London to Manchester for a business meeting. He:
- Registers as a passenger
- Searches for rides on Oct 10
- Finds 3 options:
  1. Carpool by driver Sarah - ₹25/seat
  2. Private ride by customer Emma - ₹45/seat
  3. Bus service by driver Michael - ₹35/seat
- Books carpool with Sarah (cheapest)
- Receives ride confirmation
- Shares trip details with wife (emergency contact)
- Completes journey
- Rates Sarah 5 stars

---

## Comparison Table

| Feature | Driver 🚗 | Customer 🚙 | Passenger 🎫 |
|---------|----------|------------|-------------|
| **License Required** | ✅ Yes (Unique) | ✅ Yes (Unique) | ❌ No |
| **Vehicle Info** | ✅ Multiple | ✅ At Signup | ❌ Not Required |
| **Can Publish Rides** | ✅ Yes | ✅ Yes | ❌ No |
| **Can Book Rides** | ❌ No* | ❌ No* | ✅ Yes |
| **Ride Types Offered** | Carpool, Bus | Private | N/A |
| **Multiple Vehicles** | ✅ Yes | ✅ Yes** | ❌ No |
| **Verification** | Background + Vehicles | License + Vehicle | Profile Only |
| **Earnings** | ✅ Yes | ✅ Yes | ❌ No |
| **Reviews** | Received | Received | Give Only |
| **Vehicle Management** | Full Fleet | Own Vehicles | N/A |

\* *Can use passenger account separately*  
\** *Less common, usually 1-2 vehicles*

---

## Authentication Validation Rules

### Driver
```typescript
{
  email: required, unique, valid format
  password: required, min 8 chars
  name: required
  phone: required, valid format
  licenseNumber: required, unique, alphanumeric
  licenseExpiry: required, future date
}
```

### Customer
```typescript
{
  email: required, unique, valid format
  password: required, min 8 chars
  name: required
  phone: required, valid format
  licenseNumber: required, unique, alphanumeric
  licenseExpiry: required, future date
  vehicle: {
    make: required
    model: required
    licensePlate: required, unique
    registrationNumber: required
    capacity: required, number
    insuranceExpiry: required, future date
  }
}
```

### Passenger
```typescript
{
  email: required, unique, valid format
  password: required, min 8 chars
  name: required
  phone: required, valid format
  emergencyContact: {
    name: required
    phone: required
  }
}
```

---

## Security & Verification

### Driver Verification Process
1. Submit driver license number
2. Upload license photo
3. Background check initiated
4. Add vehicle details
5. Upload vehicle documents:
   - Registration certificate
   - Insurance certificate
   - Vehicle photos (4 angles)
6. Admin review (24-48 hours)
7. Approval notification
8. Can start publishing rides

### Customer Verification Process
1. Submit driver license at registration
2. Provide vehicle details immediately
3. Upload vehicle documents:
   - Registration certificate
   - Insurance certificate
   - Ownership proof
4. Admin review (24 hours)
5. Approval notification
6. Can start private rides

### Passenger Verification Process
1. Email verification link
2. Phone OTP verification
3. Profile photo review (optional)
4. Emergency contact validation
5. Can immediately book rides (with limits)
6. Full verification for unlimited bookings

---

## Business Logic

### Who Can Do What

**Publish Rides:**
- ✅ Driver (with verified vehicle)
- ✅ Customer (with verified vehicle)
- ❌ Passenger

**Book Rides:**
- ❌ Driver (must use passenger account)
- ❌ Customer (must use passenger account)
- ✅ Passenger

**Earn Money:**
- ✅ Driver (from published rides)
- ✅ Customer (from private rides)
- ❌ Passenger

**Manage Vehicles:**
- ✅ Driver (unlimited)
- ✅ Customer (own vehicles)
- ❌ Passenger

**Leave Reviews:**
- ✅ Driver (about passengers)
- ✅ Customer (about passengers)
- ✅ Passenger (about drivers/customers)

---

## Role Selection Guidelines

### Choose DRIVER if:
- You want to be a professional driver
- You have multiple vehicles
- You want to offer carpool AND bus services
- You plan to make significant income
- You can commit to regular routes

### Choose CUSTOMER if:
- You own a nice vehicle
- You want to offer premium private rides
- You prefer direct point-to-point service
- You want flexible scheduling
- You're looking for part-time income

### Choose PASSENGER if:
- You need to travel somewhere
- You want affordable transportation
- You don't have a vehicle
- You prefer not to drive
- You want to save money

---

## Implementation Status

✅ **Completed:**
- Three role data models
- Role-based authentication screens
- Vehicle management system
- Role-specific profile pages
- Ride publishing by roles
- Mock data with all roles
- Role indicators in UI

🚀 **Ready for Backend Integration:**
- JWT token-based auth
- Role permissions middleware
- Vehicle verification workflow
- Payment processing
- Real-time booking system

---

**This role system ensures clear separation of responsibilities while providing flexibility for users to operate in their preferred capacity!** 🎯

