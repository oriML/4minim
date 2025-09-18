import { ProductTable } from '@/features/admin/components/ProductTable';
import { productService } from '@/features/products/service';

export const revalidate = 0; // Make it dynamic

async function AdminProductsPage() {
  const products = await productService.getProducts();

  return (
    <div>
      <ProductTable products={products} />
    </div>
  );
}

export default AdminProductsPage;
