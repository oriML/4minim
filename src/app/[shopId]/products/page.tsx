import { SingleProductClientPage } from './SingleProductClientPage';
import { productService } from '@/features/products/service';
import { googleSheetService } from '@/services/google-sheets';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const shop = await googleSheetService.getShopBySlug(shopId);
  if (!shop) {
    notFound();
  }


  const products = await productService.getProductsByShop(shop.id);

  return <SingleProductClientPage products={products} />;
}
