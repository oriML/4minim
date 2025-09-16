import { Product } from '@/core/types';
import { googleSheetService } from '@/services/google-sheets';
import { ProductCard } from '@/features/shop/components/ProductCard';
import { CartSummary } from '@/features/shop/components/CartSummary';
import { SingleProductClientPage } from './SingleProductClientPage';

export const revalidate = 0; // Make it dynamic

export default async function SingleProductPage() {
  const products = await googleSheetService.getProducts();

  return (
    <SingleProductClientPage products={products} />
  );
}
