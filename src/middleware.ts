import { NextRequest, NextResponse } from 'next/server';

// All existing pages remain fully public — no auth required.
// Auth middleware only activates for explicitly protected API routes
// that require a database connection (tenant management, billing, etc.).
const protectedApiPrefixes = [
  '/api/configurations',
  '/api/procurements',
  '/api/tenants',
  '/api/billing',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept explicitly protected API routes
  const isProtected = protectedApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // For protected routes, check for session token
  const token = request.cookies.get('aerospec-session')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized — login required' },
      { status: 401 }
    );
  }

  // Token exists — let request through (full verification in route handler)
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
