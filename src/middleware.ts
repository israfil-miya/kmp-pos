import { authConfig } from '@/auth.config';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authorizedRoutes from './routes'; // Ensure the correct path to your routes file

const PUBLIC_ROUTES = ['/login', '/api/auth/*']; // Public routes
const ROOT = '/login'; // Root path

const { auth } = NextAuth(authConfig);

export default auth(async (req: any) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isAuthenticated = !!req.auth; // Check if the user is authenticated
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route)); // Wildcard matching for public routes

  // Access user session
  const session = req.auth; // This contains user session information
  const userRole = session?.user?.role; // Assuming user object contains a role property

  // Handle protected routes
  if (!isPublicRoute) {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(ROOT, nextUrl)); // Redirect to login for non-authenticated users
    }

    // Check if the user has access to the requested route
    const route = authorizedRoutes.find(route => route.href === pathname);
    if (route) {
      const { roles } = route;

      // If the route has roles defined
      if (roles.length > 0 && !roles.includes(userRole)) {
        // Redirect based on user roles if they do not have access
        if (userRole === 'cashier') {
          return NextResponse.redirect(new URL('/pos', nextUrl)); // Redirect to POS for cashiers
        } else if (userRole === 'manager') {
          return NextResponse.redirect(new URL('/expired', nextUrl)); // Redirect to expired for managers
        }

        // If no specific redirect is found, redirect to dashboard or another default page
        return NextResponse.redirect(new URL('/', nextUrl));
      }
      // If roles is empty, the route is accessible to all authenticated users
    }
  }

  // Redirect authenticated users from the login page to the dashboard
  if (isAuthenticated && pathname === ROOT) {
    return NextResponse.redirect(new URL('/', nextUrl)); // Redirect to dashboard
  }

  // No redirect needed for public routes and authenticated users
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|images/khalek-molla-high-resolution-logo-transparent.png|_next/image|icon.ico).*)',
  ],
};
