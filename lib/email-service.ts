import clientPromise from './mongodb';

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

/**
 * Adds an email to the waiting list in MongoDB
 */
export async function subscribeToWaitingList(email: string): Promise<SubscriptionResponse> {
  try {
    // Validate email format
    if (!email || !email.includes('@') || !email.includes('.')) {
      return {
        success: false,
        message: 'Please provide a valid email address.'
      };
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('AHR');

    // Check if email already exists
    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
      return {
        success: false,
        message: 'This email is already on our waiting list.'
      };
    }

    // Insert the email into the 'AHR' collection
    await collection.insertOne({ 
      email, 
      subscribed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    return {
      success: true,
      message: "We'll notify you when we launch."
    };
  } catch (error) {
    console.error('Unexpected error during subscription:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    };
  }
}

/**
 * Gets all emails from the waiting list
 */
export async function getAllEmails() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('AHR');
    
    const emails = await collection.find({}).sort({ created_at: -1 }).toArray();
    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}