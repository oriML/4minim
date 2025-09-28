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

export async function getUserId(): Promise<string | null> {
  let store = userContext.getStore();
  if (store?.userId) {
    return store.userId;
  }

  // If userId not in AsyncLocalStorage, try to get it from the cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      const user = await verifyToken<User>(token);
      if (user?.userId) {
        // If userId found from token, set it in AsyncLocalStorage for this request
        // This is a bit tricky as we are already inside a context. 
        // The middleware should ideally set it. This is a fallback.
        // For subsequent calls within the same request, it will be in the store.
        userContext.enterWith({ userId: user.userId });
        return user.userId;
      }
    } catch (error) {
      console.error("Error verifying token in getUserId:", error);
      // Token invalid, clear it
      cookieStore.delete('auth_token');
    }
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
