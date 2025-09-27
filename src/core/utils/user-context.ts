import { AsyncLocalStorage } from 'async_hooks';
import { cookies } from 'next/headers';
import { verifyToken } from '@/core/auth/jwt';
import { User } from '@/core/types';

interface UserContext {
  userId: string;
}

const userContext = new AsyncLocalStorage<UserContext>();

export function withUserContext<R>(context: UserContext, callback: () => R): R {
  return userContext.run(context, callback);
}

export async function getUser(): Promise<User | null> {
  let store = userContext.getStore();
  if (store?.userId) {
    // If userId is in store, we might need to fetch full user details if not already stored
    // For now, we'll re-verify token to get full user object
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      const user = await verifyToken<User>(token);
      if (user) {
        userContext.enterWith({ userId: user.userId }); // Ensure userId is in context
        return user;
      }
    } catch (error) {
      console.error("Error verifying token in getUser:", error);
      cookieStore.delete('auth_token');
    }
  }

  // Fallback for development or unauthenticated users
  // In a real app, this might return null or throw an error
  return { userId: 'USR001', username: 'Guest', email: 'guest@example.com', passwordHash: '', role: 'user', status: 'active' };
}

export async function getUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.userId || null;
}

export async function getRequiredUserId(): Promise<string> {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User ID not found in context. Authentication is required.');
  }
  return userId;
}
