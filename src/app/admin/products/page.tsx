import { googleSheetService } from '@/services/google-sheets';
import { ProductTable } from '@/features/admin/components/ProductTable';

export const revalidate = 0; // Make it dynamic

async function AdminProductsPage() {
  const products = await googleSheetService.getProducts();

  return (
    <div>
      <ProductTable products={products} />
    </div>
  );
}

export default AdminProductsPage;
