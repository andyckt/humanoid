# Humanoid Project

## MongoDB Atlas Integration for Email Collection

This project uses MongoDB Atlas to store emails collected from the waiting list form.

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   ```
   - Replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your MongoDB Atlas credentials
   - You can copy the connection string from your MongoDB Atlas dashboard

3. Set up the MongoDB collections and indexes:

Run the setup script to create the necessary collections and indexes:
```bash
pnpm run setup-db
```

This script will:
- Create a `waiting_list` collection if it doesn't exist
- Set up a unique index on the email field to prevent duplicates
- Configure any other necessary database settings

4. Run the development server:
```bash
pnpm dev
```

### How It Works

1. The `WaitingList` component collects emails from users.
2. The `subscribeToWaitingList` function in `lib/email-service.ts` handles the submission to MongoDB.
3. Emails are stored in the `waiting_list` collection in MongoDB Atlas.

### Admin Dashboard

The project includes an admin dashboard to view all collected emails:

1. Access the admin dashboard at `/admin`
2. Enter the password: `AHR2025` to log in
3. View all collected emails in a table format
4. Export the email list to CSV for external use

The admin page is protected with a password to ensure only authorized users can access the collected data.

### Production Deployment

For production deployment, make sure to:

1. Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Consider changing the admin password for better security
3. Consider implementing rate limiting to prevent abuse of the email submission endpoint 