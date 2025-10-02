// Mark this file as server-only to prevent it from being bundled on the client
// This prevents "Can't resolve 'tls'" and similar errors
export const dynamic = 'force-dynamic';

import { MongoClient, ServerApiVersion } from 'mongodb';

// Use environment variables for MongoDB configuration
const mongoUri = process.env.MONGODB_URI!;

// Check if environment variables are set
if (!mongoUri) {
  console.error('Missing MongoDB environment variables. Please check your .env.local file.');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connection pool
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database instance
export async function getDatabase(dbName: string = 'humanoid') {
  const client = await clientPromise;
  return client.db(dbName);
}

// Helper function to get a collection
export async function getCollection(collectionName: string, dbName: string = 'humanoid') {
  const db = await getDatabase(dbName);
  return db.collection(collectionName);
}
