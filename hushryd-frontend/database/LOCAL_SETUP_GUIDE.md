# HushRyd Local MySQL Setup Guide

This guide will help you set up the HushRyd database on your local MySQL server with phpMyAdmin.

## 🗄️ Prerequisites

- **Apache Server** running locally
- **MySQL Server** running on localhost:3306
- **phpMyAdmin** accessible at http://localhost/phpmyadmin
- **Node.js** and npm installed

## 📋 Step-by-Step Setup

### 1. Create Database in phpMyAdmin

1. **Open phpMyAdmin**
   - Navigate to http://localhost/phpmyadmin
   - Login with your MySQL credentials (usually root with no password)

2. **Create Database**
   - Click "New" in the left sidebar
   - Database name: `hushryd`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

3. **Verify Database**
   - You should see "hushryd" in the database list
   - Click on it to enter the database

### 2. Configure Environment Variables

1. **Copy Environment File**
   ```bash
   cp database/env.local.txt .env
   ```

2. **Edit Configuration** (if needed)
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=hushryd
   DB_USER=root
   DB_PASSWORD=
   ```

3. **Alternative for XAMPP/WAMP**
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=hushryd
   DB_USER=root
   DB_PASSWORD=
   ```

### 3. Install Dependencies

```bash
npm install mysql2
```

### 4. Initialize Database Schema

Run the setup script:

```bash
# Using Node.js
node -r ts-node/register database/setup-local.ts

# Or using npm script (if configured)
npm run setup:database
```

### 5. Verify Setup

1. **Check phpMyAdmin**
   - Refresh phpMyAdmin
   - You should see all the tables created:
     - `users`
     - `emergency_contacts`
     - `rides`
     - `bookings`
     - `sos_alerts`
     - `admins`
     - `migrations`

2. **Test Connection**
   ```typescript
   import { checkDatabaseHealth } from './database';
   
   const isHealthy = await checkDatabaseHealth();
   console.log('Database health:', isHealthy);
   ```

## 🔧 Common Issues & Solutions

### Issue 1: Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**
- Ensure MySQL server is running
- Check if port 3306 is correct
- Verify MySQL service is started

### Issue 2: Access Denied
```
Error: Access denied for user 'root'@'localhost'
```

**Solutions:**
- Check username/password in .env file
- Try with empty password: `DB_PASSWORD=`
- Use phpMyAdmin credentials

### Issue 3: Database Not Found
```
Error: Unknown database 'hushryd'
```

**Solutions:**
- Create database in phpMyAdmin first
- Check database name spelling
- Ensure database exists

### Issue 4: Permission Denied
```
Error: Access denied for user 'root'@'localhost' to database 'hushryd'
```

**Solutions:**
- Grant permissions in MySQL:
  ```sql
  GRANT ALL PRIVILEGES ON hushryd.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

## 📊 Database Schema Overview

The setup creates the following tables:

### Users Table
- `id` - Primary key
- `email` - User email (unique)
- `first_name`, `last_name` - User names
- `phone` - Phone number
- `role` - User role (user, driver, admin, superadmin)
- `is_verified`, `is_active` - Status flags

### Emergency Contacts Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `name`, `phone` - Contact details
- `relationship` - Relationship type
- `is_primary` - Primary contact flag

### Rides Table
- `id` - Primary key
- `driver_id` - Foreign key to users
- `from_location`, `to_location` - Location data
- `departure_time`, `arrival_time` - Timing
- `price`, `currency` - Pricing
- `vehicle_info` - Vehicle details

### Bookings Table
- `id` - Primary key
- `user_id`, `ride_id` - Foreign keys
- `passenger_count` - Number of passengers
- `total_price` - Total cost
- `status` - Booking status
- `payment_status` - Payment status

### SOS Alerts Table
- `id` - Primary key
- `user_id`, `ride_id` - Foreign keys
- `location` - Alert location
- `type` - Emergency type
- `status` - Alert status
- `priority` - Priority level

### Admins Table
- `id` - Primary key
- `email` - Admin email
- `first_name`, `last_name` - Admin names
- `role` - Admin role
- `permissions` - JSON permissions
- `is_active` - Status flag

## 🚀 Usage Examples

### Basic Database Operations

```typescript
import { createDatabaseService } from './database';

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

// Get user by email
const foundUser = await dbService.getUserByEmail('john@example.com');

// Create emergency contact
const contact = await dbService.createEmergencyContact({
  userId: user.id,
  name: 'Emergency Contact',
  phone: '+919876543220',
  relationship: 'Family',
  isPrimary: true
});
```

### Query Operations

```typescript
import { select, insert, update } from './database';
import { getConnection } from './database';

const connection = await getConnection();

// Select users
const users = await select()
  .from('users')
  .where('role = ?', 'admin')
  .execute(connection);

// Insert new record
await insert()
  .into('users')
  .columns(['email', 'first_name', 'last_name', 'role'])
  .values(['admin@hushryd.com', 'Admin', 'User', 'admin'])
  .execute(connection);
```

## 🔍 Monitoring & Maintenance

### Check Database Health
```typescript
import { checkDatabaseHealth } from './database';

const isHealthy = await checkDatabaseHealth();
console.log('Database status:', isHealthy ? 'Healthy' : 'Unhealthy');
```

### View Data in phpMyAdmin
1. Open http://localhost/phpmyadmin
2. Select "hushryd" database
3. Browse tables to view data
4. Use SQL tab for custom queries

### Backup Database
```bash
# Export database
mysqldump -u root -p hushryd > hushryd_backup.sql

# Import database
mysql -u root -p hushryd < hushryd_backup.sql
```

## 📈 Performance Tips

1. **Index Optimization**
   - Ensure proper indexes on frequently queried columns
   - Monitor slow query log

2. **Connection Pooling**
   - Adjust pool settings in .env file
   - Monitor connection usage

3. **Query Optimization**
   - Use prepared statements
   - Limit result sets
   - Use proper WHERE clauses

## 🆘 Support

If you encounter issues:

1. **Check MySQL Logs**
   - Look for error messages in MySQL error log
   - Check Apache error log

2. **Verify Configuration**
   - Double-check .env file settings
   - Test connection with MySQL client

3. **Common Solutions**
   - Restart MySQL service
   - Clear MySQL cache
   - Check firewall settings

## 🎉 Success!

Once setup is complete, you'll have:
- ✅ Local MySQL database "hushryd"
- ✅ All required tables created
- ✅ Sample data inserted
- ✅ Database service ready for use
- ✅ Full CRUD operations available

Your HushRyd application is now ready to use the local MySQL database! 🚀
