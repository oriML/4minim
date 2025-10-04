import { NextResponse } from 'next/server';
import { getAdminUser, resolveShopForAdmin } from '@/core/utils/user-context';

export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const shop = await resolveShopForAdmin(admin.userId);
    if (!shop) {
      return NextResponse.json({ message: 'Shop not found for admin' }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
