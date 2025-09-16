'use server';

import { Cart, CustomerInfo } from '@/core/types';
import { googleSheetService } from '@/services/google-sheets';
import { redirect } from 'next/navigation';

export async function createSingleProductOrder(cart: Cart, customerInfo: CustomerInfo) {
  try {
    // Check if customer exists, if not, add them
    let customer = (await googleSheetService.getCustomers()).find(
      (c) => c.phone === customerInfo.phone
    );

    if (!customer) {
      customer = await googleSheetService.addCustomer(customerInfo);
    }

    const newOrder = await googleSheetService.addSingleProductOrder(
      cart,
      customer.customerId,
      'Pending' // Default status
    );

    // Redirect to payment options (placeholder for now)
    redirect(`/order-confirmation/${newOrder.orderId}`);
  } catch (error) {
    console.error('Failed to create single product order:', error);
    return { success: false, error: 'Failed to create order.' };
  }
}
