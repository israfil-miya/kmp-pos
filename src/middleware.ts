import { authConfig } from '@/auth.config';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/api/auth/*']; // Public routes
const ROOT = '/login'; // Root path

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route)); // Use some() for wildcard matching

  // Handle protected routes
  if (!isPublicRoute) {
    if (!isAuthenticated) {
      // Redirect to login for non-authenticated users
      return NextResponse.redirect(new URL(ROOT, nextUrl));
    }
  }

  if (isAuthenticated && pathname === ROOT) {
    // Redirect to home for authenticated users
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // No redirect needed for public routes and authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|images/khalek-molla-high-resolution-logo-transparent.png|_next/image|icon.ico).*)',
  ],
};
