import { getCollection } from './mongodb';
import { COLLECTIONS, WaitingListSubscriber } from './schemas';
import { MongoServerError } from 'mongodb';

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

export interface EmailListResponse {
  success: boolean;
  data?: WaitingListSubscriber[];
  error?: string;
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

/**
 * Retrieves all emails from the waiting list in MongoDB
 */
export async function getAllEmails(): Promise<EmailListResponse> {
  try {
    // Get the waiting list collection
    const collection = await getCollection(COLLECTIONS.WAITING_LIST);
    
    // Fetch all emails, sorted by subscription date (newest first)
    const emails = await collection.find({}).sort({ subscribed_at: -1 }).toArray();

    return {
      success: true,
      data: emails as WaitingListSubscriber[]
    };
  } catch (error) {
    console.error('Error retrieving emails from waiting list:', error);
    return {
      success: false,
      error: 'Failed to retrieve emails from the waiting list.'
    };
  }
} 