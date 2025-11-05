# HushRyd - Multi-Role Ride Sharing Platform

A comprehensive ride-sharing and carpooling platform built with React Native and Expo, featuring **three distinct user roles** with role-specific authentication and functionality.

## 🎭 User Roles

### 1. 🚗 Driver
- **Professional drivers** who can manage and offer rides with multiple vehicles
- **Requirements:**
  - Valid driver's license (unique and mandatory)
  - Vehicle registration and insurance
  - Background verification
- **Features:**
  - Add and manage multiple vehicles
  - Publish carpool and bus rides
  - View booking requests
  - Earn from rides

### 2. 🚙 Customer
- **Private vehicle owners** who offer rides with their own vehicles
- **Requirements:**
  - Valid driver's license
  - Personal vehicle information (make, model, license plate)
  - Vehicle registration and insurance
  - Identity verification
- **Features:**
  - Start private rides with own vehicle
  - Set custom pricing
  - Flexible scheduling
  - Manage single or multiple vehicles

### 3. 🎫 Passenger
- **Travelers** who book rides from pickup to drop location
- **Requirements:**
  - Passenger details and verification
  - Valid contact information
  - Profile authentication
- **Features:**
  - Search and book rides
  - View ride history
  - Rate drivers and customers
  - Manage bookings

## 🚀 Features

### Core Functionality
- **🔐 Role-Based Authentication**: Separate login/registration for each role
- **🔍 Smart Search**: Search rides by location, date, passengers, and type
- **🚗 Multiple Ride Types**:
  - Carpool (drivers sharing rides)
  - Private (customers offering rides)
  - Bus (commercial services)
- **📝 Ride Management**:
  - Drivers/Customers: Publish and manage rides
  - Passengers: Book and track rides
- **🚙 Vehicle Management**:
  - Add multiple vehicles (drivers)
  - Register vehicle details (customers)
  - Vehicle verification system
- **⭐ Reviews & Ratings**: Comprehensive review system for all users
- **💺 Seat Management**: Real-time seat availability and booking
- **👤 User Profiles**: Role-specific profile pages with stats

### Authentication System
- **Multi-role registration** with role-specific forms
- **License verification** for drivers and customers
- **Vehicle validation** for customers at signup
- **Profile management** with role badges

### Vehicle System
- **Vehicle types**: Economy, Sedan, SUV, Van, Luxury
- **Registration details**: License plate, insurance, capacity
- **Verification workflow**: Admin approval process
- **Multiple vehicles**: Drivers can manage a fleet

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hushryd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   npm run web      # Web browser
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   ```

## 🎨 Design Features

- **Modern UI**: Clean, role-aware interface
- **Dark/Light Mode**: Full theme support
- **Custom Color Scheme**: 
  - Primary: #00AFF5 (Vibrant blue)
  - Secondary: #084F8D (Deep blue)
  - Accent: #FF6C00 (Orange)
- **Role Indicators**: Visual badges for user roles
- **Responsive Design**: Adapts to all screen sizes

## 📱 App Structure

```
app/
├── (tabs)/
│   ├── index.tsx      # Home/Search screen
│   ├── rides.tsx      # My Rides screen (role-aware)
│   ├── publish.tsx    # Publish Ride (drivers/customers)
│   └── profile.tsx    # User Profile (role-specific)
├── auth/
│   ├── login.tsx      # Role-based login
│   └── register.tsx   # Role-specific registration
├── vehicles/
│   ├── manage.tsx     # Vehicle management
│   └── add.tsx        # Add new vehicle
├── search.tsx         # Search Results
└── ride/[id].tsx      # Ride Details

types/
└── models.ts          # Complete type definitions with roles

services/
└── mockData.ts        # Mock data with role support
```

## 🔐 Role-Specific Features

### Driver Features
- ✅ Multiple vehicle management
- ✅ Publish carpool and bus rides
- ✅ Professional driver badge
- ✅ Higher visibility in search
- ✅ Fleet management tools

### Customer Features
- ✅ Register personal vehicle
- ✅ Offer private rides
- ✅ Custom pricing control
- ✅ Flexible scheduling
- ✅ Private ride badge

### Passenger Features
- ✅ Search all ride types
- ✅ Book rides instantly
- ✅ Rate experiences
- ✅ View ride history
- ✅ Manage bookings

## 🛡️ Authentication & Verification

### Driver Authentication
```typescript
- Email & Password
- Full Name
- Phone Number
- Driver License Number (unique, mandatory)
- License Expiry Date
- Background check pending
```

### Customer Authentication
```typescript
- Email & Password
- Full Name
- Phone Number
- Driver License Number (mandatory)
- Vehicle Information:
  - Make & Model
  - License Plate
  - Registration Number
  - Insurance Details
```

### Passenger Authentication
```typescript
- Email & Password
- Full Name
- Phone Number
- Emergency Contact
- Profile Verification
```

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver' | 'customer' | 'passenger';
  rating: number;
  verified: boolean;
  licenseNumber?: string; // For drivers/customers
  // ... additional fields
}
```

### Vehicle Model
```typescript
interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  licensePlate: string;
  capacity: number;
  vehicleType: 'sedan' | 'suv' | 'van' | 'luxury' | 'economy';
  verified: boolean;
  // ... additional fields
}
```

### Ride Model
```typescript
interface Ride {
  publisherId: string;
  publisher: User;
  publisherRole: 'driver' | 'customer';
  type: 'carpool' | 'bus' | 'private';
  vehicleId: string;
  vehicle: Vehicle;
  // ... location, pricing, etc.
}
```

## 🎯 Usage Examples

### As a Driver
1. Register with driver role
2. Add license information
3. Add vehicles to your fleet
4. Publish rides (carpool/bus)
5. Manage bookings

### As a Customer
1. Register with customer role
2. Provide license & vehicle details
3. Vehicle verification
4. Start private rides
5. Set your own prices

### As a Passenger
1. Register with passenger role
2. Complete profile
3. Search for rides
4. Book seats
5. Rate your experience

## 🔧 Configuration

### Role-Based Access
The app automatically shows/hides features based on user role:
- **Navigation tabs** adapt to role capabilities
- **Profile page** displays role-specific options
- **Vehicle management** only for drivers/customers
- **Publishing** restricted to drivers/customers

## 🚀 Future Enhancements

- **Real Authentication**: Backend integration with JWT
- **Payment Processing**: Secure payment gateway
- **Real-time Tracking**: GPS integration
- **Chat System**: In-app messaging
- **Push Notifications**: Booking updates
- **Advanced Verification**: KYC integration
- **Admin Dashboard**: User and ride management
- **Analytics**: Earnings and trip statistics

## 📄 License

This project is open source and available for educational and commercial use.

## 👨‍💻 Developer Notes

- **Hot Reload**: Enabled for instant preview
- **Type Safety**: Full TypeScript support
- **Cross-Platform**: Single codebase for all platforms
- **Role System**: Fully implemented with mock data
- **Authentication Flow**: Ready for backend integration

---

**Built with ❤️ using Expo and React Native**

## 🌟 Key Differentiators

✅ **Three distinct user roles** with unique capabilities  
✅ **Professional drivers** can manage vehicle fleets  
✅ **Customers** can offer private rides with their vehicles  
✅ **Passengers** enjoy a simplified booking experience  
✅ **Comprehensive verification** system for all roles  
✅ **Role-aware UI** that adapts to user permissions  
✅ **Complete vehicle management** for drivers and customers  

Perfect for building a production-ready ride-sharing platform! 🚀
