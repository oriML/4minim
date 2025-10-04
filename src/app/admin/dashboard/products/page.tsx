import { ProductTable } from '@/features/admin/components/ProductTable';
import { productService } from '@/features/products/service';
import { getAdminUser, resolveShopForAdmin } from '@/core/utils/user-context';
import { redirect } from 'next/navigation';

export const revalidate = 0;

async function AdminProductsPage() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    return <div>לא נמצאה חנות למנהל</div>;
  }

  const products = await productService.getProductsByShop(shop.id);

  return (
    <div className="mt-6">
      <ProductTable products={products} />
    </div>
  );
}

export default AdminProductsPage;