'use server';

import { redirect } from 'next/navigation';
import { signToken } from './jwt';
import { googleSheetService } from '@/services/google-sheets';
import { compare } from 'bcrypt';
import { cookies } from 'next/headers';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = await cookies();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const users = await googleSheetService.getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const passwordMatch = await compare(password, user.passwordHash);
  if (!passwordMatch) {
    return { error: 'Invalid email or password' };
  }

  const token = await signToken({ email: user.email, role: user.role });
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/admin/login');
}
