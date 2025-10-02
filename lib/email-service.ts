import { getCollection } from './mongodb';
import { COLLECTIONS, WaitingListSubscriber } from './schemas';
import { MongoServerError } from 'mongodb';

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

    // Get the waiting list collection
    const collection = await getCollection(COLLECTIONS.WAITING_LIST);
    
    // Create the subscriber document
    const subscriber: WaitingListSubscriber = {
      email,
      subscribed_at: new Date(),
      created_at: new Date()
    };

    // Insert the email into the 'waiting_list' collection
    await collection.insertOne(subscriber);

    return {
      success: true,
      message: "We'll notify you when we launch."
    };
  } catch (error) {
    // Check if it's a duplicate email error (MongoDB duplicate key error)
    if (error instanceof MongoServerError && error.code === 11000) {
      return {
        success: false,
        message: 'This email is already on our waiting list.'
      };
    }
    
    console.error('Error subscribing to waiting list:', error);
    return {
      success: false,
      message: 'Failed to join the waiting list. Please try again later.'
    };
  }
} 