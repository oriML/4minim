import { SetsClientPage } from './SetsClientPage';
import { setService } from '@/features/sets/service';
import { googleSheetService } from '@/services/google-sheets';
import { log } from 'console';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const shop = await googleSheetService.getShopBySlug(shopId);

  if (!shop) {
    notFound();
  }

  const sets = await setService.getSetsByShop(shop.id);

  return <SetsClientPage sets={sets} />;
}