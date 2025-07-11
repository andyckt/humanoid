import { supabase } from '../lib/supabase';

async function createWaitingListTable() {
  try {
    console.log('Creating waiting_list table...');
    
    // Using the SQL query feature of Supabase to create the table
    const { error } = await supabase.rpc('create_waiting_list_table', {});
    
    if (error) {
      console.error('Error creating table:', error);
      
      // If the RPC doesn't exist, provide SQL to run manually
      console.log('\nIf the RPC method is not set up, run the following SQL in the Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS public.waiting_list (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anonymous users
CREATE POLICY "Allow anonymous inserts to waiting_list" ON public.waiting_list 
FOR INSERT WITH CHECK (true);

-- Create policy to allow the service role to read all emails
CREATE POLICY "Allow service role to read waiting_list" ON public.waiting_list 
FOR SELECT USING (auth.role() = 'service_role');
      `);
    } else {
      console.log('Table created successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    process.exit(0);
  }
}

createWaitingListTable(); 