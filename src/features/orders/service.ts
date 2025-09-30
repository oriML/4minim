import { googleSheetService } from '@/services/google-sheets';
import { Order } from '@/core/types';
import { getUserId, getRequiredUserId } from '@/core/utils/user-context';

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const userId = await getUserId();
    return googleSheetService.getOrders(userId);
  },

  createOrder: async (order: Omit<Order, 'orderId' | 'status' | 'paymentStatus' | 'userId'> & { status?: 'בהמתנה' | 'בוצעה' | 'בוטלה', paymentStatus?: 'שולם' | 'לא שולם', orderDate?: string }): Promise<Order> => {
    const userId = await getRequiredUserId();
    const orderWithDate = { ...order, orderDate: order.orderDate || new Date().toISOString() };
    return googleSheetService.addOrder(orderWithDate, userId);
  },

  updateOrder: async (id: string, updates: Partial<Omit<Order, 'orderId' | 'userId'>>): Promise<Order> => {
    const userId = await getRequiredUserId();
    return googleSheetService.updateOrder(id, updates, userId);
  },
};
