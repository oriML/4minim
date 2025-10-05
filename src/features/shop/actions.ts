'use server';

import { Cart, CustomerInfo, Order } from '@/core/types';
import { redirect } from 'next/navigation';
import { googleSheetService } from '@/services/google-sheets';
import { log } from 'console';

export async function createOrderForShop(shopId: string, shopSlug: string, cart: Cart, customerInfo: CustomerInfo, totalPrice: number) {
  let newOrderId;
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

    // 2. Calculate total price and prepare products JSON
    const products = await googleSheetService.getProductsByShop(shopId);
    const productsInOrder: Record<string, { qty: number }> = {};

    for (const productId in cart) {
      const cartItem = cart[productId];
      const product = products.find(p => p.id === productId);

      if (product) {
        productsInOrder[productId] = { qty: cartItem.qty };
      } else {
        console.warn(`Product with ID ${productId} not found while creating order.`);
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
    newOrderId = newOrder.orderId;

  } catch (error) {
    console.error('Failed to create single product order:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create single product order: ${error.message}`);
    }
    throw new Error('Failed to create single product order due to an unknown error.');
  }
  if (newOrderId) {
    redirect(encodeURI(`/${shopSlug}/order-confirmation/${newOrderId}`));
  }
}