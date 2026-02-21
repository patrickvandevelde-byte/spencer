import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/auth/utils';

export async function POST(request: NextRequest) {
  try {
    // Clear session cookie
    await clearSessionCookie();

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
