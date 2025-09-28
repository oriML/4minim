'use server';

import { DBOrder, UIOrder, UIProduct, Order, Product, Customer } from "@/core/types";
import { orderService } from '@/features/orders/service';
import { productService } from '@/features/products/service';
import { customerService } from '@/features/customers/service';

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
        imageUrl: productInfo?.imageURL || "/images/placeholder.png",
      };
    }
  );

  return {
    orderId: order.orderId,
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
  orderId: string
): Promise<UIOrder | null> => {

  try {
    // Fetch all necessary data from Google Sheets in parallel
    const [orders, allProducts, allCustomers] = await Promise.all([
      orderService.getOrders(),
      productService.getProducts(),
      customerService.getCustomers(),
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
    console.error(`Failed to send WhatsApp ${type} for order ${orderId} to ${to}:`, error);
  }
};

export const updateOrderDeliveryRequired = async (
  orderId: string,
  deliveryRequired: boolean,
  customerAddress?: string // Optional address update
): Promise<UIOrder | null> => {
  'use server';
  try {
    const updates: Partial<Order> = { deliveryRequired };
    // If customerAddress is provided, we need to update the customer's address.
    // This requires a new action/service call to update the customer.
    // For now, we'll just update the order's deliveryRequired.
    // If address needs to be stored with the order, Order interface needs an address field.
    // Let's assume for now address is part of customer and will be handled separately if needed.

    const updatedOrder = await orderService.updateOrder(orderId, updates);
    // Re-fetch the full UIOrder to ensure all derived data is correct
    const [allProducts, allCustomers] = await Promise.all([
      productService.getProducts(),
      customerService.getCustomers(),
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


