
import { OrderTable } from '@/features/admin/components/OrderTable';
import { orderService } from '@/features/orders/service';
import { customerService } from '@/features/customers/service';
import { productService } from '@/features/products/service';
import { Order, Customer, OrderProduct, UIOrder, UIProduct } from '@/core/types';

export const revalidate = 0;

async function AdminOrdersPage() {
  const [orders, customers, products] = await Promise.all([
    orderService.getOrders(),
    customerService.getCustomers(),
    productService.getProducts(),
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
      customerId: order.customerId,
      customerName: customer?.fullName || 'Unknown Customer',
      customerPhone: customer?.phone || 'N/A',
      products: enrichedProducts,
      totalPrice: order.totalPrice,
      createdAt: new Date(order.orderDate),
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryRequired: order.deliveryRequired,
    };
  });

  return (
    <div className="mt-6">
      <OrderTable orders={uiOrders} />
    </div>
  );
}

export default AdminOrdersPage;
