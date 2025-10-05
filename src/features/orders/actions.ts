'use server';

import { DBOrder, UIOrder, UIProduct, Order, Product, Customer } from "@/core/types";
import { orderService } from '@/features/orders/service';
import { productService } from '@/features/products/service';
import { customerService } from '@/features/customers/service';
import { getAdminUser, getShopById } from '@/core/utils/user-context';
import { googleSheetService } from "@/services/google-sheets";
import { redirect } from 'next/navigation';

/**
 * Helper function to transform a raw database order and its associated products
 * into a UI-friendly format.
 * @param order - The raw order object from the database.
 * @param products - A list of all possible products.
 * @param customers - A list of all customers.
 * @returns The transformed order object for the UI.
 */
const mapOrderToUIFormat = (
  order: DBOrder,
  products: Product[],
  customers: Customer[]
): UIOrder => {
  const customer = customers.find((c) => c.customerId === order.customerId);
  let totalPrice = 0;
  const enrichedProducts: UIProduct[] = Object.entries(order.products).map(
    ([productId, orderProductData]) => {
      const productInfo = products.find((p) => p.id === productId);
      totalPrice += productInfo?.price ?? 0;
      return {
        ...orderProductData, // Spread dynamic properties (qty, size, color, etc.)
        productId,
        name: productInfo?.productName_HE || "Product not found",
        imageUrl: productInfo?.imageUrl || "/images/placeholder.png",
      };
    }
  );

  return {
    orderId: order.orderId,
    shopId: order.shopId,
    customerId: order.customerId,
    customerName: customer?.fullName || "Customer not found",
    customerPhone: customer?.phone ?? '',
    customerAddress: customer?.address ?? '', // New: Include customer address
    products: enrichedProducts,
    createdAt: order.createdAt,
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryRequired: order.deliveryRequired, // New: Include deliveryRequired
    notes: order.notes,
    totalPrice
  };
};

/**
 * Server Action: Fetches an order by its ID from Google Sheets and enriches it with product details.
 * @param orderId - The ID of the order to fetch.
 * @returns A promise that resolves to the UI-friendly order object or null if not found.
 */
export const getOrderWithProducts = async (
  orderId: string,
  shopId: string,
): Promise<UIOrder | null> => {
  const shop = await getShopById(shopId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }

  try {
    // Fetch all necessary data from Google Sheets in parallel
    const [orders, allProducts, allCustomers] = await Promise.all([
      orderService.getOrdersByShop(shop.id),
      productService.getProductsByShop(shop.id),
      customerService.getCustomersByShop(shop.id),
    ]);

    const orderFromSheet = orders.find((o) => o.orderId === orderId);

    if (!orderFromSheet) {
      console.error(`Order with ID ${orderId} not found in Google Sheet.`);
      return null;
    }

    // The productsJSON from sheets is a string, parse it.
    // Also, the date from the sheet is a string, convert it to a Date object.
    const dbOrder: DBOrder = {
      ...orderFromSheet,
      products: JSON.parse(orderFromSheet.productsJSON || '{}'),
      createdAt: new Date(orderFromSheet.orderDate),
    };

    // Transform the data for the UI using the existing mapper
    const uiOrder = mapOrderToUIFormat(dbOrder, allProducts, allCustomers);

    return uiOrder;
  } catch (error) {
    console.error(`Failed to get order with products for order ${orderId}:`, error);
    return null;
  }
};

export const updateOrderDeliveryRequired = async (
  orderId: string,
  deliveryRequired: boolean,
  customerAddress?: string // Optional address update
): Promise<UIOrder | null> => {
  'use server';
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await getShopById(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }

  try {
    const updates: Partial<Order> = { deliveryRequired };

    const updatedOrder = await orderService.updateOrder(orderId, updates, shop.id);
    // Re-fetch the full UIOrder to ensure all derived data is correct
    const [allProducts, allCustomers] = await Promise.all([
      productService.getProductsByShop(shop.id),
      customerService.getCustomersByShop(shop.id),
    ]);
    const dbOrder: DBOrder = {
      ...updatedOrder,
      products: JSON.parse(updatedOrder.productsJSON || '{}'),
      createdAt: new Date(updatedOrder.orderDate),
    };
    return mapOrderToUIFormat(dbOrder, allProducts, allCustomers);
  } catch (error) {
    console.error(`Failed to update deliveryRequired for order ${orderId}:`, error);
    return null;
  }
};

export const updateOrderPaymentStatus = async (
  orderId: string,
  paymentStatus: 'שולם' | 'לא שולם'
): Promise<UIOrder | null> => {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await getShopById(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }

  try {
    const updatedOrder = await orderService.updateOrder(orderId, { paymentStatus }, shop.id);
    // Re-fetch the full UIOrder to ensure all derived data is correct
    const [allProducts, allCustomers] = await Promise.all([
      productService.getProductsByShop(shop.id),
      customerService.getCustomersByShop(shop.id),
    ]);
    const dbOrder: DBOrder = {
      ...updatedOrder,
      products: JSON.parse(updatedOrder.productsJSON || '{}'),
      createdAt: new Date(updatedOrder.orderDate),
    };
    return mapOrderToUIFormat(dbOrder, allProducts, allCustomers);
  } catch (error) {
    console.error(`Failed to update payment status for order ${orderId}:`, error);
    return null;
  }
};

/**
 * Server Action: Fetches the delivery fee from the current user's data.
 * @returns A promise that resolves to the delivery fee amount.
 */
export const getDeliveryFeeAction = async (shopId: string): Promise<number> => {
  const shop = await googleSheetService.getShopById(shopId);
  if (!shop) {
    return 0;
  }
  const users = await googleSheetService.getUsers();
  const owner = users.find(u => u.userId === shop.userId);
  if (!owner) {
    return 0;
  }
  return owner.deliveryFee ?? 0;
};