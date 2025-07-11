# Humanoid Project

## Supabase Integration for Email Collection

This project uses Supabase to store emails collected from the waiting list form.

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (optional for development):
   - Create a `.env.local` file in the root directory
   - Add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://fxspesehsgkddmdltwca.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4c3Blc2Voc2drZGRtZGx0d2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMDQ3OTEsImV4cCI6MjA2Nzc4MDc5MX0.FdICwXx92Hdnh77Wz6YuIWdrLOXTDA0UM3XkUO4kA3c
   ```
   - For development, these values are also hardcoded as fallbacks in `lib/supabase.ts`

3. Set up the Supabase table:

There are two ways to create the required database table:

**Option 1**: Run the setup script (requires Supabase RPC setup):
```bash
pnpm run setup-db
```

**Option 2**: Manually run the SQL in the Supabase SQL Editor:
```sql
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
```

4. Run the development server:
```bash
pnpm dev
```

### How It Works

1. The `WaitingList` component collects emails from users.
2. The `subscribeToWaitingList` function in `lib/email-service.ts` handles the submission to Supabase.
3. Emails are stored in the `waiting_list` table in Supabase.

### Production Deployment

For production deployment, make sure to:

1. Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Remove the hardcoded fallback values in `lib/supabase.ts` before deploying to production
3. Consider implementing rate limiting to prevent abuse of the email submission endpoint 