import { supabase } from './supabase';

export interface SubscriptionResponse {
  success: boolean;
  message: string;
}

/**
 * Adds an email to the waiting list in Supabase
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

    // Insert the email into the 'waiting_list' table
    const { error } = await supabase
      .from('waiting_list')
      .insert([{ email, subscribed_at: new Date().toISOString() }]);

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === '23505') {
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

    return {
      success: true,
      message: 'Successfully joined the waiting list!'
    };
  } catch (error) {
    console.error('Unexpected error during subscription:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    };
  }
} 