import { NextResponse } from 'next/server'
import { subscribeToWaitingList } from '@/lib/email-service'

// Mark as server-side only
export const runtime = 'nodejs';

// API endpoint to subscribe to the waiting list
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }
    
    const response = await subscribeToWaitingList(email)
    
    if (response.success) {
      return NextResponse.json({ 
        success: true, 
        message: response.message 
      })
    } else {
      return NextResponse.json(
        { success: false, message: response.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in subscribe:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}