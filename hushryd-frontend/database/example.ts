import {
    checkDatabaseHealth,
    createDatabaseService,
    getDatabaseConfig,
    initializeDatabase
} from './database';

// Example usage of the database layer
async function exampleUsage() {
  try {
    // 1. Check database health
    console.log('Checking database health...');
    const isHealthy = await checkDatabaseHealth();
    console.log('Database health:', isHealthy);

    if (!isHealthy) {
      console.error('Database is not healthy. Please check your configuration.');
      return;
    }

    // 2. Initialize database (run migrations)
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    // 3. Create database service
    console.log('Creating database service...');
    const dbService = await createDatabaseService();

    // 4. Example: Create a user
    console.log('Creating a sample user...');
    const user = await dbService.createUser({
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+919876543210',
      role: 'user',
      isVerified: true,
      isActive: true
    });
    console.log('Created user:', user);

    // 5. Example: Create emergency contacts
    console.log('Creating emergency contacts...');
    const emergencyContact1 = await dbService.createEmergencyContact({
      userId: user.id,
      name: 'Emergency Contact 1',
      phone: '+919876543220',
      relationship: 'Family',
      isPrimary: true
    });

    const emergencyContact2 = await dbService.createEmergencyContact({
      userId: user.id,
      name: 'Emergency Contact 2',
      phone: '+919876543221',
      relationship: 'Friend',
      isPrimary: false
    });

    console.log('Created emergency contacts:', { emergencyContact1, emergencyContact2 });

    // 6. Example: Create a ride
    console.log('Creating a sample ride...');
    const ride = await dbService.createRide({
      driverId: 'driver-001', // Assuming this driver exists
      fromLocation: {
        latitude: 17.3850,
        longitude: 78.4867,
        address: 'Hyderabad Central',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India'
      },
      toLocation: {
        latitude: 13.0827,
        longitude: 80.2707,
        address: 'Chennai Central',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India'
      },
      departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      price: 2500,
      currency: 'INR',
      maxPassengers: 4,
      availableSeats: 3,
      status: 'scheduled',
      vehicleInfo: {
        make: 'Toyota',
        model: 'Innova',
        year: 2022,
        color: 'White',
        licensePlate: 'TS09AB1234',
        capacity: 7,
        features: ['AC', 'Music System', 'GPS']
      }
    });
    console.log('Created ride:', ride);

    // 7. Example: Create a booking
    console.log('Creating a booking...');
    const booking = await dbService.createBooking({
      userId: user.id,
      rideId: ride.id,
      passengerCount: 2,
      totalPrice: 5000,
      currency: 'INR',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      specialRequests: 'Please pick up from main gate'
    });
    console.log('Created booking:', booking);

    // 8. Example: Create an SOS alert
    console.log('Creating an SOS alert...');
    const sosAlert = await dbService.createSOSAlert({
      userId: user.id,
      rideId: ride.id,
      location: {
        latitude: 17.3850,
        longitude: 78.4867,
        address: 'Hyderabad Central',
        city: 'Hyderabad',
        state: 'Telangana',
        country: 'India'
      },
      type: 'medical',
      message: 'Passenger feeling unwell',
      status: 'active',
      priority: 'high'
    });
    console.log('Created SOS alert:', sosAlert);

    // 9. Example: Query operations
    console.log('Querying data...');
    
    // Get user by email
    const foundUser = await dbService.getUserByEmail('john.doe@example.com');
    console.log('Found user:', foundUser);

    // Get emergency contacts for user
    const contacts = await dbService.getEmergencyContactsByUser(user.id);
    console.log('Emergency contacts:', contacts);

    // Get active SOS alerts
    const activeAlerts = await dbService.getActiveSOSAlerts();
    console.log('Active SOS alerts:', activeAlerts);

    // Get rides by driver
    const driverRides = await dbService.getRidesByDriver('driver-001');
    console.log('Driver rides:', driverRides);

    // Get bookings by user
    const userBookings = await dbService.getBookingsByUser(user.id);
    console.log('User bookings:', userBookings);

    console.log('All examples completed successfully!');

  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

// Example of database configuration
function showDatabaseConfig() {
  const config = getDatabaseConfig();
  console.log('Database Configuration:');
  console.log('- Type:', config.type);
  console.log('- Host:', config.host);
  console.log('- Port:', config.port);
  console.log('- Database:', config.database);
  console.log('- Username:', config.username);
  console.log('- Pool Min:', config.pool?.min);
  console.log('- Pool Max:', config.pool?.max);
}

// Run examples if this file is executed directly
if (require.main === module) {
  showDatabaseConfig();
  exampleUsage().catch(console.error);
}

export { exampleUsage, showDatabaseConfig };
