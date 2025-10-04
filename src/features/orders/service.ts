import { googleSheetService } from '@/services/google-sheets';
import { Order } from '@/core/types';

export const orderService = {
  getOrdersByShop: async (shopId: string): Promise<Order[]> => {
    return googleSheetService.getOrdersByShop(shopId);
  },

  createOrderForShop: async (order: Omit<Order, 'orderId' | 'shopId'>, shopId: string): Promise<Order> => {
    return googleSheetService.createOrderForShop(order, shopId);
  },

  updateOrder: async (id: string, updates: Partial<Omit<Order, 'orderId' | 'shopId'>>, shopId: string): Promise<Order> => {
    // @ts-ignore
    return googleSheetService.updateOrder(id, updates, shopId);
  },
};