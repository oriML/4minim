import { googleSheetService } from '@/services/google-sheets';
import { notFound } from 'next/navigation';
import { ShopProvider } from './ShopContext';

export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { shopId: string };
}) {
  const awaitedParams = await params; // Await params
  const shopId = awaitedParams.shopId; // Access shopId from awaitedParams
  
  const shop = await googleSheetService.getShopBySlug(shopId);

  if (!shop) {
    console.log('ShopLayout: Shop not found for slug:', shopId);
    notFound();
  }

  console.log('ShopLayout: Found shop:', shop);
  return (
    <ShopProvider shop={shop}>
      {/* TODO: Add Navbar with Exit Shop button */}
      {children}
    </ShopProvider>
  );
}
