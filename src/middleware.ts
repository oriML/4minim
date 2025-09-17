import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/core/auth/jwt';
import { User } from './core/types';

const ADMIN_LOGIN = '/admin/login';
const ADMIN_DASHBOARD = '/admin/dashboard';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return pathname.includes('/login')
      ? NextResponse.next()
      : NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
  }

  const user = await verifyToken<User>(token);

  if (!user || user.role !== 'admin') {
    const response = NextResponse.redirect(new URL(ADMIN_LOGIN, req.url));
    response.cookies.delete('auth_token');
    return response;
  }

  if (pathname.includes('/login')) {
    return NextResponse.redirect(new URL(ADMIN_DASHBOARD, req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/admin/:path*', '/api/auth/me'],
};