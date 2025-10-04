import { cookies } from 'next/headers';
import { verifyToken } from '@/core/auth/jwt';
import { User, Shop } from '@/core/types';
import { googleSheetService } from '@/services/google-sheets';

export async function getAdminUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      const user = await verifyToken<User>(token);
      return user;
    } catch (error) {
      console.error("Error verifying token in getUser:", error);
      cookieStore.delete('auth_token');
    }
  }

  return null;
}

export async function getShopById(id: string): Promise<Shop | null> {
    const shops = await googleSheetService.getShops();
    return shops.find(shop => shop.id === id) || null;
}

export async function resolveShopForAdmin(userId: string): Promise<Shop | null> {
    const shops = await googleSheetService.getShops();
    return shops.find(shop => shop.userId === userId) || null;
}