'use server';

import { compare } from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signToken } from './jwt';

// In a real app, fetch this from a database
const ADMIN_EMAIL = 'admin@example.com';
// Hash for "admin123". In a real app, use env variables.
const ADMIN_PASSWORD_HASH = '$2b$10$f.8.jW/YgC8C0h3.G/E.Y.eZ.a9.Z/e.Z.e.Z.e.Z.e'; 

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email !== ADMIN_EMAIL) {
    return { error: 'Invalid email or password' };
  }

  const passwordMatch = await compare(password, ADMIN_PASSWORD_HASH);

  if (!passwordMatch) {
    return { error: 'Invalid email or password' };
  }

  const token = await signToken({ email, role: 'admin' });

  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 hours
  });

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  cookies().delete('auth_token');
  redirect('/login');
}
