# HushRyd Database Setup Guide

This guide will help you set up the database layer for the HushRyd application with support for MySQL, PostgreSQL, and Oracle databases.

## 🗄️ Supported Databases

- **MySQL** 5.7+ / 8.0+
- **PostgreSQL** 12+
- **Oracle** 12c+ / 19c+

## 📋 Prerequisites

### For MySQL:
```bash
npm install mysql2
```

### For PostgreSQL:
```bash
npm install pg
npm install @types/pg
```

### For Oracle:
```bash
npm install oracledb
```

## ⚙️ Configuration

### 1. Environment Setup

Copy the example environment file:
```bash
cp database/env.example.txt .env
```

### 2. Database Configuration

Edit your `.env` file with your database settings:

#### MySQL Configuration:
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hushryd
DB_USER=root
DB_PASSWORD=your_password
DB_CHARSET=utf8mb4
DB_TIMEZONE=UTC
```

#### PostgreSQL Configuration:
```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hushryd
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
```

#### Oracle Configuration:
```env
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_NAME=hushryd
DB_USER=system
DB_PASSWORD=your_password
DB_SERVICE_NAME=orcl
# OR
DB_SID=orcl
```

## 🚀 Quick Start

### 1. Initialize Database

```typescript
import { initializeDatabase, checkDatabaseHealth } from './database';

// Check database health
const isHealthy = await checkDatabaseHealth();
console.log('Database health:', isHealthy);

// Initialize database with migrations
await initializeDatabase();
```

### 2. Basic Usage

```typescript
import { createDatabaseService, select, insert } from './database';

// Create database service
const dbService = await createDatabaseService();

// Create a user
const user = await dbService.createUser({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+919876543210',
  role: 'user',
  isVerified: true,
  isActive: true
});

// Query users
const users = await select()
  .from('users')
  .where('role = ?', 'user')
  .limit(10)
  .execute(await getConnection());

console.log('Users:', users.rows);
```

## 📊 Database Schema

The application includes the following main tables:

- **users** - User accounts and profiles
- **emergency_contacts** - Emergency contact information
- **rides** - Ride information and scheduling
- **bookings** - Ride bookings and reservations
- **sos_alerts** - Emergency SOS alerts
- **admins** - Admin user accounts

## 🔧 Advanced Usage

### Custom Queries

```typescript
import { select, insert, update, del } from './database';

// Complex query with joins
const ridesWithDrivers = await select(['r.*', 'u.first_name', 'u.last_name'])
  .from('rides r')
  .join('users u', 'r.driver_id = u.id')
  .where('r.status = ?', 'scheduled')
  .where('r.available_seats > ?', 0)
  .orderBy('r.departure_time', 'ASC')
  .execute(connection);

// Insert multiple records
await insert()
  .into('emergency_contacts')
  .columns(['user_id', 'name', 'phone', 'relationship', 'is_primary'])
  .values([
    ['user-001', 'Emergency Contact 1', '+919876543220', 'Family', true],
    ['user-001', 'Emergency Contact 2', '+919876543221', 'Friend', false]
  ])
  .execute(connection);

// Update with conditions
await update()
  .table('rides')
  .set('status', 'active')
  .set('updated_at', new Date())
  .where('id = ?', rideId)
  .execute(connection);
```

### Transactions

```typescript
import { dbManager } from './database';

const connection = await dbManager.connect();

await connection.transaction(async (trx) => {
  // Create booking
  const booking = await trx.query(
    'INSERT INTO bookings (id, user_id, ride_id, passenger_count, total_price) VALUES (?, ?, ?, ?, ?)',
    [bookingId, userId, rideId, passengerCount, totalPrice]
  );

  // Update available seats
  await trx.query(
    'UPDATE rides SET available_seats = available_seats - ? WHERE id = ?',
    [passengerCount, rideId]
  );

  // If any query fails, the entire transaction will be rolled back
});
```

### Database Service Layer

```typescript
import { createDatabaseService } from './database';

const dbService = await createDatabaseService();

// User operations
const user = await dbService.createUser(userData);
const userById = await dbService.getUserById(userId);
const userByEmail = await dbService.getUserByEmail(email);
const updatedUser = await dbService.updateUser(userId, updates);

// Ride operations
const ride = await dbService.createRide(rideData);
const driverRides = await dbService.getRidesByDriver(driverId);
const nearbyRides = await dbService.getRidesByLocation(lat, lng, toLat, toLng, radius);

// SOS operations
const sosAlert = await dbService.createSOSAlert(alertData);
const activeAlerts = await dbService.getActiveSOSAlerts();
const resolvedAlert = await dbService.updateSOSAlertStatus(alertId, 'resolved', adminId);
```

## 🔄 Migrations

### Running Migrations

```typescript
import { MigrationManager, createInitialSchemaMigration } from './database';

const connection = await dbManager.connect();
const migrationManager = new MigrationManager(connection, 'mysql');

// Run all pending migrations
await migrationManager.runMigrations([
  createInitialSchemaMigration('mysql'),
  // Add more migrations here
]);
```

### Creating Custom Migrations

```typescript
const customMigration = {
  version: '003',
  name: 'add_user_preferences',
  up: async (connection) => {
    await connection.query(`
      ALTER TABLE users 
      ADD COLUMN preferences JSON,
      ADD COLUMN notification_settings JSON
    `);
  },
  down: async (connection) => {
    await connection.query(`
      ALTER TABLE users 
      DROP COLUMN preferences,
      DROP COLUMN notification_settings
    `);
  }
};
```

## 🛠️ Database-Specific Notes

### MySQL
- Uses `mysql2` package for better performance
- Supports JSON columns for flexible data storage
- Uses `utf8mb4` charset for full Unicode support

### PostgreSQL
- Uses native `pg` package
- Supports JSONB for efficient JSON operations
- Uses UUID for primary keys (auto-generated)

### Oracle
- Uses `oracledb` package
- Uses VARCHAR2 and CLOB for text storage
- Supports JSON as CLOB (parse manually)

## 🔍 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Increase `DB_POOL_IDLE` value
   - Check network connectivity
   - Verify database server is running

2. **Authentication Failed**
   - Verify username/password
   - Check database user permissions
   - Ensure database exists

3. **Migration Errors**
   - Check database schema conflicts
   - Verify foreign key constraints
   - Review migration order

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
```

## 📈 Performance Tips

1. **Connection Pooling**
   - Adjust pool size based on load
   - Monitor connection usage
   - Use connection timeouts

2. **Query Optimization**
   - Use proper indexes
   - Limit result sets
   - Use prepared statements

3. **Database Monitoring**
   - Monitor slow queries
   - Track connection usage
   - Set up alerts for failures

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong passwords
   - Rotate credentials regularly

2. **Database Access**
   - Use least privilege principle
   - Enable SSL/TLS connections
   - Implement proper authentication

3. **Query Security**
   - Use parameterized queries
   - Validate input data
   - Implement rate limiting

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Oracle Database Documentation](https://docs.oracle.com/en/database/)
- [Node.js Database Best Practices](https://nodejs.org/en/docs/guides/database/)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review database logs
3. Verify configuration settings
4. Test with minimal examples