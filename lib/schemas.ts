// MongoDB schema definitions

// Waiting list subscriber schema
export interface WaitingListSubscriber {
  email: string;
  subscribed_at: Date;
  created_at: Date;
}

// Collection names
export const COLLECTIONS = {
  WAITING_LIST: 'waiting_list'
};

// Indexes configuration for collections
export const INDEXES = {
  [COLLECTIONS.WAITING_LIST]: [
    { key: { email: 1 }, unique: true }
  ]
};
