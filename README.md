# Humanoid Project

## MongoDB Integration for Email Collection

This project uses MongoDB to store emails collected from the waiting list form.

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variable with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/humanoid?retryWrites=true&w=majority
   ```

3. Run the development server:
```bash
pnpm dev
```

### How It Works

1. The `WaitingList` component collects emails from users.
2. The emails are sent to the `/api/subscribe` endpoint.
3. The `subscribeToWaitingList` function in `lib/email-service.ts` handles the submission to MongoDB.
4. Emails are stored in the `AHR` collection in MongoDB.

### Admin Dashboard

An admin dashboard is available at `/admin` to view all collected emails. 

- Access the admin page at: http://localhost:3000/admin (when running locally)
- Password: AHR2025

The admin dashboard features:
- Password protection
- List of all emails collected
- Timestamps for when users joined the waiting list

### Production Deployment

For production deployment, make sure to:

1. Set up a MongoDB Atlas account and create a database
2. Create a collection named `AHR` to store the emails
3. Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
4. Consider implementing rate limiting to prevent abuse of the email submission endpoint
5. Consider using a more secure authentication method for the admin page in production