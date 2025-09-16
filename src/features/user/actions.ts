'use server';

import { googleSheetService } from '@/services/google-sheets';
import type { Order, CustomerInfo, Product } from '@/core/types';
import { redirect } from 'next/navigation';

// Define the shape of the custom set object
interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

export async function createCustomSetOrder(set: CustomSet, customerInfo: CustomerInfo) {
  let newOrderId;
  try {
    // 1. Find or create the customer
    let customer = (await googleSheetService.getCustomers()).find(
      (c) => c.phone === customerInfo.phone
    );

    if (!customer) {
      const customerData = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address
      };
      customer = await googleSheetService.addCustomer(customerData);
    }

    // 2. Calculate total price and prepare products JSON from the CustomSet
    const selectedProducts = Object.values(set).filter(p => p !== null) as Product[];
    const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price, 0);

    const productsInOrder: Record<string, { qty: number }> = {};
    selectedProducts.forEach(product => {
      productsInOrder[product.id] = { qty: 1 }; // Each item in a set has a quantity of 1
    });

    // 3. Create the complete order object
    const orderData: Omit<Order, 'orderId' | 'orderDate' | 'status'> = {
      customerId: customer.customerId,
      productsJSON: JSON.stringify(productsInOrder),
      totalPrice: totalPrice,
      notes: customerInfo.notes,
    };

    // 4. Add the order using the generic addOrder function
    const newOrder = await googleSheetService.addOrder(orderData);
    newOrderId = newOrder.orderId;
    // 5. Redirect to the confirmation page

  } catch (error) {
    console.error('Failed to create custom set order:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create custom set order: ${error.message}`);
    }
    throw new Error('Failed to create custom set order due to an unknown error.');
  }
  
  if (newOrderId) {
    redirect(`/order-confirmation/${newOrderId}`);
  }
}