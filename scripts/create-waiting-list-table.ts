import clientPromise, { getDatabase } from '../lib/mongodb';
import { COLLECTIONS, INDEXES } from '../lib/schemas';

async function setupMongoDB() {
  try {
    console.log('Setting up MongoDB collections and indexes...');
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = await getDatabase();
    
    // Create the waiting list collection if it doesn't exist
    const collections = await db.listCollections({ name: COLLECTIONS.WAITING_LIST }).toArray();
    
    if (collections.length === 0) {
      console.log(`Creating ${COLLECTIONS.WAITING_LIST} collection...`);
      await db.createCollection(COLLECTIONS.WAITING_LIST);
    }
    
    // Create indexes
    console.log(`Setting up indexes for ${COLLECTIONS.WAITING_LIST} collection...`);
    const waitingListCollection = db.collection(COLLECTIONS.WAITING_LIST);
    
    // Create unique index on email field
    const waitingListIndexes = INDEXES[COLLECTIONS.WAITING_LIST];
    for (const indexSpec of waitingListIndexes) {
      await waitingListCollection.createIndex(indexSpec.key, { unique: indexSpec.unique });
    }
    
    console.log('MongoDB setup completed successfully!');
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
  } finally {
    // Close the connection
    const client = await clientPromise;
    await client.close();
    process.exit(0);
  }
}

setupMongoDB(); 