
import { ProductTable } from '@/features/admin/components/ProductTable';
import { productService } from '@/features/products/service';

export const revalidate = 0;

async function AdminProductsPage() {
  const products = await productService.getProducts();

  return (
    <div className="mt-6">
      <ProductTable products={products} />
    </div>
  );
}

export default AdminProductsPage;
