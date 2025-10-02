import { NextResponse } from 'next/server'
import { getAllEmails } from '@/lib/email-service'

// Mark as server-side only
export const runtime = 'nodejs';

// API endpoint to get all emails
export async function GET(request: Request) {
  try {
    // Validate admin password from header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (token !== 'AHR2025') {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get all emails
    const emails = await getAllEmails();
    
    return NextResponse.json({ 
      success: true, 
      data: emails 
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}