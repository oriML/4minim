'use server';

import { googleSheetService } from '@/services/google-sheets';
import type { Order } from '@/core/types';

export const submitOrder = async (orderData: Omit<Order, 'id' | 'timestamp'>): Promise<Order> => {
  try {
    const newOrder = await googleSheetService.addOrder(orderData);
    return newOrder;
  } catch (error) {
    console.error('Order submission failed:', error);
    // In a real app, you'd want more robust error handling and logging
    throw new Error('Failed to submit order.');
  }
};
