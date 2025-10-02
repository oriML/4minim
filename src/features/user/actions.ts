'use server';

import type { Order, CustomerInfo, Product, User } from '@/core/types';
import { redirect } from 'next/navigation';
import { customerService } from '@/features/customers/service';
import { orderService } from '@/features/orders/service';
import { googleSheetService } from '@/services/google-sheets';
import { sendSellerNotificationEmail } from '../../core/utils/email';

// Define the shape of the custom set object
interface CustomSet {
  lulav: Product | null;
  etrog: Product | null;
  hadas: Product | null;
  arava: Product | null;
}

export async function createCustomSetOrder(set: CustomSet, customerInfo: CustomerInfo, setId: string | null | undefined, totalPriceArg: number) {
  let newOrderId;
  try {
    // 1. Find or create the customer
    let customer = (await customerService.getCustomers()).find(
      (c) => c.phone === customerInfo.phone
    );

    if (!customer) {
      const customerData = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address
      };
      customer = await customerService.createCustomer(customerData);
    }

    // 2. Prepare products JSON from the CustomSet
    const selectedProducts = Object.values(set).filter(p => p !== null) as Product[];

    const productsInOrder: Record<string, { qty: number }> = {};
    selectedProducts.forEach(product => {
      productsInOrder[product.id] = { qty: 1 }; // Each item in a set has a quantity of 1
    });

    // 3. Create the complete order object
    const orderData: Omit<Order, 'orderId' | 'orderDate' | 'status' | 'userId'> = {
      customerId: customer.customerId,
      productsJSON: JSON.stringify(productsInOrder),
      totalPrice: totalPriceArg,
      notes: customerInfo.notes,
      deliveryRequired: customerInfo.deliveryRequired,
      paymentStatus: 'לא שולם',
      ...(setId && { originalSetId: setId }), // Add originalSetId if available
    };

    // 4. Add the order using the generic addOrder function
    const newOrder = await orderService.createOrder(orderData);
    newOrderId = newOrder.orderId;

    // 5. Send email notification to the seller
    if (newOrder.userId) {
      const allUsers = await googleSheetService.getUsers();
      const seller = allUsers.find(u => u.userId === newOrder.userId);

      if (seller && seller.email) {
        await sendSellerNotificationEmail({
          sellerEmail: seller.email,
          order: newOrder,
          customerInfo: customerInfo,
          seller: seller,
        });
      }
    }

    // 6. Redirect to the confirmation page

  } catch (error) {
    console.error('Failed to create custom set order:', error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    if (error instanceof Error) {
      throw new Error(`Failed to create custom set order: ${error.message}`);
    }
    throw new Error('Failed to create custom set order due to an unknown error.');
  }
  
  if (newOrderId) {
    redirect(`/order-confirmation/${newOrderId}`);
  }
}