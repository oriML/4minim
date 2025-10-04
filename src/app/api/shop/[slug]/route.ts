import { NextResponse } from 'next/server';
import { googleSheetService } from '@/services/google-sheets';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const awaitedParams = await params;
    const { slug } = awaitedParams;
    const shop = await googleSheetService.getShopBySlug(slug);

    if (!shop) {
      return NextResponse.json({ message: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (error) {
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
