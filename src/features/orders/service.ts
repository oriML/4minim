import { googleSheetService } from '@/services/google-sheets';
import { Order } from '@/core/types';
import { getUserId, getRequiredUserId } from '@/core/utils/user-context';
import { sendWhatsAppNotification } from './actions'; // New import
import { customerService } from '@/features/customers/service'; // Needed to get customer phone

// Removed: const SELLER_PHONE_NUMBER = process.env.SELLER_PHONE_NUMBER || '';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const userId = await getUserId();
    return googleSheetService.getOrders(userId);
  },

  createOrder: async (order: Omit<Order, 'orderId' | 'orderDate' | 'status' | 'paymentStatus' | 'userId'> & { status?: 'בהמתנה' | 'בוצעה' | 'בוטלה', paymentStatus?: 'שולם' | 'לא שולם' }): Promise<Order> => {
    const userId = await getRequiredUserId(); // This is the seller's userId
    const newOrder = await googleSheetService.addOrder(order, userId);

    // Send WhatsApp notification to seller (logged-in user) for new order
    const sellerCustomer = await customerService.getCustomerByUserId(userId);
    if (sellerCustomer && sellerCustomer.phone) {
      const orderDetails = `Order ID: ${newOrder.orderId}
Customer: ${newOrder.customerName}
Total: ₪${newOrder.totalPrice}
Items: ${Object.values(newOrder.products).map(p => p.name + ' x' + p.qty).join(', ')}`;
      await sendWhatsAppNotification(
        sellerCustomer.phone,
        `הזמנה חדשה התקבלה!
${orderDetails}`,
        newOrder.orderId,
        'seller_notification'
      );
    } else {
      console.warn(`Seller's phone number not found for userId: ${userId}. WhatsApp notification not sent.`);
    }

    return newOrder;
  },

  updateOrder: async (id: string, updates: Partial<Omit<Order, 'orderId' | 'userId'>>): Promise<Order> => {
    const userId = await getRequiredUserId();
    const updatedOrder = await googleSheetService.updateOrder(id, updates, userId);

    // Send WhatsApp notification to customer if status or paymentStatus changed
    if (updates.status || updates.paymentStatus) {
      const customer = await customerService.getCustomerById(updatedOrder.customerId);
      if (customer && customer.phone) {
        let message = `שלום ${customer.fullName},
`;
        if (updates.status) {
          message += `סטטוס הזמנה #${updatedOrder.orderId} עודכן ל: ${updates.status}.
`;
        }
        if (updates.paymentStatus) {
          message += `סטטוס התשלום עבור הזמנה #${updatedOrder.orderId} עודכן ל: ${updates.paymentStatus}.
`;
        }
        message += `תודה רבה!`;

        await sendWhatsAppNotification(
          customer.phone,
          message,
          updatedOrder.orderId,
          'customer_status_update'
        );
      }
    }

    return updatedOrder;
  },
};
