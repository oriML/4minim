import { SummaryDashboard } from '@/features/admin/components/SummaryDashboard';
import { orderService } from '@/features/orders/service';
import { productService } from '@/features/products/service';
import { customerService } from '@/features/customers/service';
import { Order, Customer, OrderProduct, UIOrder, UIProduct } from '@/core/types';
import { getAdminUser, resolveShopForAdmin } from '@/core/utils/user-context';
import { redirect } from 'next/navigation';

export const revalidate = 0;

async function AdminSummaryPage() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    return <div>לא נמצאה חנות למנהל</div>;
  }

  const [orders, customers, products] = await Promise.all([
    orderService.getOrdersByShop(shop.id),
    customerService.getCustomersByShop(shop.id),
    productService.getProductsByShop(shop.id),
  ]);

  const uiOrders: UIOrder[] = orders.map((order: Order) => {
    const customer = customers.find((c: Customer) => c.customerId === order.customerId);
    const parsedProducts: Record<string, OrderProduct> = JSON.parse(order.productsJSON || '{}');

    const enrichedProducts: UIProduct[] = Object.entries(parsedProducts).map(([productId, item]) => {
      const productDetails = products.find(p => p.id === productId);
      return {
        productId: productId,
        ...item,
        name: productDetails?.productName_HE || 'Unknown Product',
        imageUrl: productDetails?.imageUrl || '',
      };
    });

    return {
      orderId: order.orderId,
      shopId: order.shopId,
      customerId: order.customerId,
      customerName: customer?.fullName || 'Unknown Customer',
      customerPhone: customer?.phone || 'N/A',
      products: enrichedProducts,
      totalPrice: order.totalPrice,
      createdAt: new Date(order.orderDate),
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryRequired: order.deliveryRequired,
      customerAddress: customer?.address,
    };
  });

  return (
    <div className="mt-6">
      <SummaryDashboard orders={uiOrders} products={products} />
    </div>
  );
}

export default AdminSummaryPage;