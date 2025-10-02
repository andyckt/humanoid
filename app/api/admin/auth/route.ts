import { NextResponse } from 'next/server'

// Mark as server-side only
export const runtime = 'nodejs';

// Simple password validation endpoint
export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    // Check if password matches
    if (password === 'AHR2025') {
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful' 
      })
    }
    
    // Return error for incorrect password
    return NextResponse.json(
      { success: false, message: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error in admin auth:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}