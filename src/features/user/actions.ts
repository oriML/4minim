'use server';

import type { Order, CustomerInfo, Product } from '@/core/types';
import { ApiResponse } from '@/core/types/responses';
import { googleSheetService } from '@/services/google-sheets';
import { sendSystemErrorEmail } from '@/core/utils/email';

// Define the shape of the custom set object
interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

export async function createCustomSetOrder(shopId: string, set: CustomSet, customerInfo: CustomerInfo, setId: string | null | undefined, totalPriceArg: number): Promise<ApiResponse<{ redirectPath: string }>> {
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

    if (selectedProducts.length === 0) {
      return { success: false, error: 'לא נבחרו מוצרים.' };
    }

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
    const newOrderId = newOrder.orderId;

    if (newOrderId) {
      const shop = await googleSheetService.getShopById(shopId);
      if (!shop) {
        throw new Error('Shop not found for redirection.');
      }
      return { success: true, data: { orderId: newOrderId, shopSlug: shop.slug }, message: 'ההזמנה בוצעה בהצלחה!' };
    }

    return { success: false, error: 'Failed to create order.' };

  } catch (error) {
    console.error('Failed to create custom set order:', error);
    await sendSystemErrorEmail({ error, context: 'createCustomSetOrder' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}