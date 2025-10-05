'use server';

import { Cart, CustomerInfo, Order } from '@/core/types';
import { ApiResponse } from '@/core/types/responses';
import { googleSheetService } from '@/services/google-sheets';
import { sendSystemErrorEmail } from '@/core/utils/email';

export async function createOrderForShop(shopId: string, shopSlug: string, cart: Cart, customerInfo: CustomerInfo, totalPrice: number): Promise<ApiResponse<{ redirectPath: string }>> {
  try {
    // 1. Find or create the customer
    let customers = await googleSheetService.getCustomersByShop(shopId);
    let customer = customers.find(
      (c) => c.phone === customerInfo.phone
    );

    if (!customer) {
      const customerData = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address
      };
      // @ts-ignore
      customer = await googleSheetService.addCustomer(customerData, shopId);
    }

    // 2. Prepare products JSON
    const products = await googleSheetService.getProductsByShop(shopId);
    const productsInOrder: Record<string, { qty: number }> = {};

    for (const productId in cart) {
      const cartItem = cart[productId];
      const product = products.find(p => p.id === productId);

      if (product) {
        productsInOrder[productId] = { qty: cartItem.qty };
      } else {
        console.warn(`Product with ID ${productId} not found while creating order.`);
        // Returning a validation error to the client
        return { success: false, error: `Product with ID ${productId} not found.` };
      }
    }

    // 3. Create the complete order object, including notes
    const orderData: Omit<Order, 'orderId' | 'shopId'> = {
      customerId: customer.customerId,
      productsJSON: JSON.stringify(productsInOrder),
      totalPrice: totalPrice,
      notes: customerInfo.notes,
      deliveryRequired: customerInfo.deliveryRequired,
      paymentStatus: 'לא שולם',
      orderDate: new Date().toISOString(),
      status: 'בהמתנה',
    };

    // 4. Add the order using the generic addOrder function
    const newOrder = await googleSheetService.createOrderForShop(orderData, shopId);
    const newOrderId = newOrder.orderId;

    if (newOrderId) {
      return { success: true, data: { orderId: newOrderId, shopSlug: shopSlug }, message: 'ההזמנה בוצעה בהצלחה!' };
    }

    return { success: false, error: 'Failed to create order.' };

  } catch (error) {
    console.error('Failed to create single product order:', error);
    await sendSystemErrorEmail({ error, context: 'createOrderForShop' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}