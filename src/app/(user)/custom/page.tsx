import { CustomSetBuilder } from '@/features/user/components/CustomSetBuilder';
import { productService } from '@/features/products/service';

export default async function CustomSetPage() {
  const products = await productService.getProducts();

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return <CustomSetBuilder productsByCategory={productsByCategory} />;
}
