import { Product, Order, Customer, UIOrder, OrderProduct, UIProduct } from '@/core/types';
import { ProductTable } from '@/features/admin/components/ProductTable';
import { OrderTable } from '@/features/admin/components/OrderTable';
import { SummaryDashboard } from '@/features/admin/components/SummaryDashboard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { productService } from '@/features/products/service';
import { orderService } from '@/features/orders/service';
import { customerService } from '@/features/customers/service';

export const revalidate = 0; // Make it dynamic

async function AdminDashboardPage() {
  const [products, orders, customers] = await Promise.all([
    productService.getProducts(),
    orderService.getOrders(),
    customerService.getCustomers(),
  ]);

  const uiOrders: UIOrder[] = orders.map((order: Order) => {
    const customer = customers.find((c: Customer) => c.customerId === order.customerId);
    const parsedProducts: Record<string, OrderProduct> = JSON.parse(order.productsJSON || '{}');

    const enrichedProducts: UIProduct[] = Object.entries(parsedProducts).map(([productId, item]) => {
      const productDetails = products.find(p => p.id === productId);
      return {
        productId: productId, // Explicitly add productId
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
    };
  });

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 bg-white p-2 rounded-lg shadow-md">
          <TabsTrigger value="products" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">מוצרים</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">הזמנות</TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">סיכום</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <OrderTable orders={uiOrders} />
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <ProductTable products={products} />
        </TabsContent>
        <TabsContent value="summary" className="mt-6">
          <SummaryDashboard orders={uiOrders} products={products} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboardPage;