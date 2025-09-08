const { Client } = require('pg');

async function resetTestDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: 'nestjs_adv_poc_test', // Connect to default database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');


    // Drop the test database if it exists
    await client.query('DROP DATABASE IF EXISTS nestjs_adv_poc_test');
    console.log('✅ Dropped test database');

    // Create the test database
    await client.query('CREATE DATABASE nestjs_adv_poc_test');
    console.log('✅ Created test database');

    console.log('🎉 Test database reset completed');
  } catch (error) {
    console.error('Error resetting test database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetTestDatabase();
