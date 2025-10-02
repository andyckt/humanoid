'use server';

import { subscribeToWaitingList } from '@/lib/email-service';
import type { SubscriptionResponse } from '@/lib/email-service';

/**
 * Server action to subscribe an email to the waiting list
 */
export async function subscribeEmail(email: string): Promise<SubscriptionResponse> {
  return await subscribeToWaitingList(email);
}
