import { googleSheetService } from '@/services/google-sheets';
import { Customer } from '@/core/types';
import { getUserId, getRequiredUserId } from '@/core/utils/user-context';

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const userId = await getUserId();
    return googleSheetService.getCustomers(userId);
  },

  createCustomer: async (customer: Omit<Customer, 'customerId' | 'userId'>): Promise<Customer> => {
    const userId = await getRequiredUserId();
    return googleSheetService.addCustomer(customer, userId);
  },

  updateCustomer: async (id: string, updates: Partial<Omit<Customer, 'customerId' | 'userId'>>): Promise<Customer> => {
    const userId = await getRequiredUserId();
    return googleSheetService.updateCustomer(id, updates, userId);
  },
};
