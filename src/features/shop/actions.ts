'use server';

import { Cart, CustomerInfo, Order } from '@/core/types';
import { redirect } from 'next/navigation';
import { customerService } from '@/features/customers/service';
import { productService } from '@/features/products/service';
import { orderService } from '@/features/orders/service';

export async function createSingleProductOrder(cart: Cart, customerInfo: CustomerInfo) {
  let newOrderId;
  try {
    // 1. Find or create the customer
    let customer = (await customerService.getCustomers()).find(
      (c) => c.phone === customerInfo.phone
    );

    if (!customer) {
      // Create a customer object without the notes for saving
      const customerData = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address
      };
      customer = await customerService.createCustomer(customerData);
    }

    // 2. Calculate total price and prepare products JSON
    const products = await productService.getProducts();
    let totalPrice = 0;
    const productsInOrder: Record<string, { qty: number }> = {};

    for (const productId in cart) {
      const cartItem = cart[productId];
      const product = products.find(p => p.id === productId);

      if (product) {
        totalPrice += product.price * cartItem.qty;
        productsInOrder[productId] = { qty: cartItem.qty };
      } else {
        console.warn(`Product with ID ${productId} not found while creating order.`);
      }
    }

    // 3. Create the complete order object, including notes
    const orderData: Omit<Order, 'orderId' | 'orderDate' | 'status' | 'userId'> = {
      customerId: customer.customerId,
      productsJSON: JSON.stringify(productsInOrder),
      totalPrice: totalPrice,
      notes: customerInfo.notes, // Pass the notes here
      deliveryRequired: customerInfo.deliveryRequired,
    };

    // 4. Add the order using the generic addOrder function
    const newOrder = await orderService.createOrder(orderData);
    newOrderId = newOrder.orderId;
    // The redirect needs to be called outside the try/catch block

  } catch (error) {
    console.error('Failed to create single product order:', error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    if (error instanceof Error) {
      throw new Error(`Failed to create single product order: ${error.message}`);
    }
    throw new Error('Failed to create single product order due to an unknown error.');
  }
  if (newOrderId) {
    redirect(`/order-confirmation/${newOrderId}`);
  }
}
