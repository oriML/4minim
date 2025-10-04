import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/core/auth/jwt';
import { User } from './core/types';

const ADMIN_LOGIN = '/admin/login';
const ADMIN_DASHBOARD = '/admin/dashboard';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Paths that do not require authentication or user context
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/auth/me')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    // If no token, allow access to login page, otherwise redirect to login
    if (pathname.includes('/login')) {
      return NextResponse.next();
    }
    // For /api/auth/me, if no token, it means not authenticated, which is a valid state
    if (pathname === '/api/auth/me') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
  }

  const user = await verifyToken<User>(token);

  if (!user) {
    // Invalid token, clear cookie and redirect to login
    const response = NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
    response.cookies.delete('auth_token');
    return response;
  }

  // Admin specific checks
  if (pathname.startsWith('/admin')) {
    if (user.role !== 'admin') {
      const response = NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
      response.cookies.delete('auth_token');
      return response;
    }

    if (pathname.includes('/login')) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD, req.url));
    }
  }

  // For /api/auth/me, if authenticated, proceed
  if (pathname === '/api/auth/me') {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/me', '/', '/:shopId/:path*'],
};