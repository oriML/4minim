'use server';

import { DBOrder, UIOrder, UIProduct, Order, Product, Customer } from "@/core/types";
import { googleSheetService } from "@/services/google-sheets";

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
    products: enrichedProducts,
    createdAt: order.createdAt,
    customerPhone: customer?.phone ?? '',
    status: order.status,
    paymentStatus: order.paymentStatus,
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
      googleSheetService.getOrders(),
      googleSheetService.getProducts(),
      googleSheetService.getCustomers(),
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
    console.error("Failed to fetch or process order from Google Sheets:", error);
    // Depending on the error, you might want to throw it or handle it differently
    return null;
  }
};

