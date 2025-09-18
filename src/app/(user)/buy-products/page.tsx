import { Product } from '@/core/types';
import { ProductCard } from '@/features/shop/components/ProductCard';
import { CartSummary } from '@/features/shop/components/CartSummary';
import { SingleProductClientPage } from './SingleProductClientPage';
import { productService } from '@/features/products/service';

export const revalidate = 0; // Make it dynamic

export default async function SingleProductPage() {
  const products = await productService.getProducts();

  return (
    <SingleProductClientPage products={products} />
  );
}
