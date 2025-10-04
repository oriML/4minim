'use server';

import type { Order, CustomerInfo, Product, User } from '@/core/types';
import { redirect } from 'next/navigation';
import { googleSheetService } from '@/services/google-sheets';

// Define the shape of the custom set object
interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

export async function createCustomSetOrder(shopId: string, set: CustomSet, customerInfo: CustomerInfo, setId: string | null | undefined, totalPriceArg: number) {
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

    // 2. Prepare products JSON from the CustomSet
    const selectedProducts = Object.values(set).filter(p => p !== null) as Product[];

    const productsInOrder: Record<string, { qty: number }> = {};
    selectedProducts.forEach(product => {
      productsInOrder[product.id] = { qty: 1 }; // Each item in a set has a quantity of 1
    });

    // 3. Create the complete order object
    const orderData: Omit<Order, 'orderId' | 'shopId'> = {
      customerId: customer.customerId,
      productsJSON: JSON.stringify(productsInOrder),
      totalPrice: totalPriceArg,
      notes: customerInfo.notes,
      deliveryRequired: customerInfo.deliveryRequired,
      paymentStatus: 'לא שולם',
      orderDate: new Date().toISOString(),
      status: 'בהמתנה',
      ...(setId && { originalSetId: setId }), // Add originalSetId if available
    };

    // 4. Add the order using the generic addOrder function
    const newOrder = await googleSheetService.createOrderForShop(orderData, shopId);
    newOrderId = newOrder.orderId;

  } catch (error) {
    console.error('Failed to create custom set order:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create custom set order: ${error.message}`);
    }
    throw new Error('Failed to create custom set order due to an unknown error.');
  }
  console.log('createCustomSetOrder: New Order ID:', newOrderId);
  if (newOrderId) {
    const shop = await googleSheetService.getShopById(shopId);
    if (!shop) {
      throw new Error('Shop not found for redirection.');
    }
    return`/${shop.slug}/order-confirmation/${newOrderId}`;
  }
}