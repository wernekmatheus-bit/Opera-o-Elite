import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('pmpr_authenticated')?.value === 'true';
  const path = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const isPublicRoute = 
    path === '/' || 
    path === '/login' || 
    path === '/onboarding' || 
    path.startsWith('/api/');

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login or onboarding
  if (isAuthenticated && (path === '/login' || path === '/onboarding')) {
    return NextResponse.redirect(new URL('/qg', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
