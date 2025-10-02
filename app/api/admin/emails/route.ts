import { NextRequest, NextResponse } from 'next/server';
import { getAllEmails } from '@/lib/email-service';

// Password for admin access
const ADMIN_PASSWORD = 'AHR2025';

export async function GET(request: NextRequest) {
  try {
    // Check for password in the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid authorization header' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the password
    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid password' },
        { status: 401 }
      );
    }
    
    // Fetch all emails using the service function
    const response = await getAllEmails();
    
    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to fetch emails' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ emails: response.data });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
