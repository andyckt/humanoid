// This script helps set up the MongoDB collection
// Run with: node scripts/setup-mongodb.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function setupMongoDB() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set. Please check your .env.local file.');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB successfully!');

    // Get the database
    const db = client.db();
    console.log(`Using database: ${db.databaseName}`);

    // Check if the AHR collection exists
    const collections = await db.listCollections({ name: 'AHR' }).toArray();
    
    if (collections.length === 0) {
      // Create the AHR collection
      await db.createCollection('AHR');
      console.log('Created AHR collection successfully!');
      
      // Create an index on the email field to ensure uniqueness
      await db.collection('AHR').createIndex({ email: 1 }, { unique: true });
      console.log('Created unique index on email field.');
    } else {
      console.log('AHR collection already exists.');
      
      // Check if the email index exists
      const indexes = await db.collection('AHR').indexes();
      const hasEmailIndex = indexes.some(index => 
        index.key && index.key.email && index.unique === true
      );
      
      if (!hasEmailIndex) {
        await db.collection('AHR').createIndex({ email: 1 }, { unique: true });
        console.log('Created unique index on email field.');
      } else {
        console.log('Email index already exists.');
      }
    }

    // Add a test email if requested
    const addTestEmail = process.argv.includes('--add-test');
    if (addTestEmail) {
      const testEmail = `test-${new Date().getTime()}@example.com`;
      const result = await db.collection('AHR').insertOne({
        email: testEmail,
        subscribed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });
      
      console.log(`Added test email: ${testEmail}`);
      console.log(`Document ID: ${result.insertedId}`);
    }

    console.log('\nMongoDB setup completed successfully!');
    console.log('\nTo add a test email, run:');
    console.log('node scripts/setup-mongodb.js --add-test');

  } catch (error) {
    console.error('Error setting up MongoDB:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

setupMongoDB();
