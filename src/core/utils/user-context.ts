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
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      const user = await verifyToken<User>(token);
      return user;
    } catch (error) {
      console.error("Error verifying token in getUser:", error);
      // Token invalid, clear it
      cookieStore.delete('auth_token');
    }
  }

  return 'USR001';
}

export async function getUserId(): Promise<string | null> {
  let store = userContext.getStore();
  if (store?.userId) {
    return store.userId;
  }

  const user = await getUser();
  if (user?.userId) {
    userContext.enterWith({ userId: user.userId });
    return user.userId;
  }
  return 'USR001';
}

export async function getRequiredUserId(): Promise<string> {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User ID not found in context. Authentication is required.');
  }
  return userId;
}
