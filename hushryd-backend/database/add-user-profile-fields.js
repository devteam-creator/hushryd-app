const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hushryd',
};

async function addProfileFields() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Check if columns exist before adding them
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [dbConfig.database]);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    console.log('Existing columns:', existingColumns);

    // Add columns that don't exist
    const columnsToAdd = [
      { name: 'emergency_contact', sql: 'ALTER TABLE users ADD COLUMN emergency_contact VARCHAR(20)' },
      { name: 'address', sql: 'ALTER TABLE users ADD COLUMN address TEXT' },
      { name: 'city', sql: 'ALTER TABLE users ADD COLUMN city VARCHAR(100)' },
      { name: 'state', sql: 'ALTER TABLE users ADD COLUMN state VARCHAR(100)' },
      { name: 'pincode', sql: 'ALTER TABLE users ADD COLUMN pincode VARCHAR(10)' },
      { name: 'bio', sql: 'ALTER TABLE users ADD COLUMN bio TEXT' },
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        await connection.query(column.sql);
        console.log(`✅ Added column: ${column.name}`);
      } else {
        console.log(`⏭️  Column already exists: ${column.name}`);
      }
    }

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addProfileFields();
