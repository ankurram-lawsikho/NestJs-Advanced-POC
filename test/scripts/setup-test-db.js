const { Client } = require('pg');
require('dotenv').config();

async function createTestDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const testDbName = (process.env.DATABASE_NAME || 'nestjs_adv_poc') + '_test';
    
    // Check if test database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [testDbName]
    );

    if (result.rows.length === 0) {
      // Create test database
      await client.query(`CREATE DATABASE "${testDbName}"`);
      console.log(`✅ Test database '${testDbName}' created successfully`);
    } else {
      console.log(`✅ Test database '${testDbName}' already exists`);
    }

  } catch (error) {
    console.error('Error setting up test database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTestDatabase();
