import { googleSheetService } from '@/services/google-sheets';
import { Customer } from '@/core/types';

export const customerService = {
  getCustomersByShop: async (shopId: string): Promise<Customer[]> => {
    return googleSheetService.getCustomersByShop(shopId);
  },

  createCustomerForShop: async (customer: Omit<Customer, 'customerId' | 'shopId'>, shopId: string): Promise<Customer> => {
    // @ts-ignore
    return googleSheetService.addCustomer(customer, shopId);
  },

  updateCustomer: async (id: string, updates: Partial<Omit<Customer, 'customerId' | 'shopId'>>, shopId: string): Promise<Customer> => {
    // @ts-ignore
    return googleSheetService.updateCustomer(id, updates, shopId);
  },
};