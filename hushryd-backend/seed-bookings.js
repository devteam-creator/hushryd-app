const mysql = require('mysql2/promise');

async function seedBookings() {
  let connection;
  
  try {
    // Connect to MySQL server
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '', // Empty password for localhost
      database: 'hushryd'
    });

    console.log('✅ Connected to MySQL database');

    // First, get some existing user IDs and ride IDs
    const [users] = await connection.query('SELECT id FROM users LIMIT 5');
    const [rides] = await connection.query('SELECT id FROM rides LIMIT 3');
    
    if (users.length === 0) {
      console.log('❌ No users found. Please create users first.');
      return;
    }
    
    if (rides.length === 0) {
      console.log('❌ No rides found. Please create rides first.');
      return;
    }

    console.log(`📋 Found ${users.length} users and ${rides.length} rides`);

    // Mock booking data
    const mockBookings = [
      {
        id: 'b1',
        user_id: users[0].id,
        ride_id: rides[0].id,
        passenger_count: 2,
        total_price: 1040.00,
        currency: 'INR',
        status: 'completed',
        payment_status: 'paid',
        payment_method: 'UPI',
        special_requests: 'Need AC car with WiFi'
      },
      {
        id: 'b2',
        user_id: users.length > 1 ? users[1].id : users[0].id,
        ride_id: rides[0].id,
        passenger_count: 1,
        total_price: 520.00,
        currency: 'INR',
        status: 'completed',
        payment_status: 'paid',
        payment_method: 'Cash',
        special_requests: null
      },
      {
        id: 'b3',
        user_id: users.length > 2 ? users[2].id : users[0].id,
        ride_id: rides.length > 1 ? rides[1].id : rides[0].id,
        passenger_count: 1,
        total_price: 460.00,
        currency: 'INR',
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'Card',
        special_requests: 'Window seat preferred'
      },
      {
        id: 'b4',
        user_id: users.length > 3 ? users[3].id : users[0].id,
        ride_id: rides.length > 1 ? rides[1].id : rides[0].id,
        passenger_count: 2,
        total_price: 920.00,
        currency: 'INR',
        status: 'pending',
        payment_status: 'pending',
        payment_method: null,
        special_requests: null
      },
      {
        id: 'b5',
        user_id: users.length > 4 ? users[4].id : users[0].id,
        ride_id: rides.length > 2 ? rides[2].id : rides[0].id,
        passenger_count: 1,
        total_price: 600.00,
        currency: 'INR',
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'UPI',
        special_requests: null
      }
    ];

    // Check which bookings already exist
    const [existingBookings] = await connection.query('SELECT id FROM bookings');
    const existingIds = existingBookings.map(b => b.id);
    
    // Filter out existing bookings
    const newBookings = mockBookings.filter(b => !existingIds.includes(b.id));

    if (newBookings.length === 0) {
      console.log('✅ All bookings already exist in the database');
      return;
    }

    // Insert bookings
    for (const booking of newBookings) {
      const query = `
        INSERT INTO bookings (
          id, user_id, ride_id, passenger_count, total_price, currency, 
          status, payment_status, payment_method, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.query(query, [
        booking.id,
        booking.user_id,
        booking.ride_id,
        booking.passenger_count,
        booking.total_price,
        booking.currency,
        booking.status,
        booking.payment_status,
        booking.payment_method,
        booking.special_requests
      ]);
      
      console.log(`✅ Inserted booking: ${booking.id}`);
    }

    console.log(`\n✅ Successfully inserted ${newBookings.length} bookings`);

    // Show summary
    const [count] = await connection.query('SELECT COUNT(*) as total FROM bookings');
    console.log(`📊 Total bookings in database: ${count[0].total}`);

  } catch (error) {
    console.error('❌ Error seeding bookings:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedBookings();
