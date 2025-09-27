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

  getCustomerById: async (customerId: string): Promise<Customer | undefined> => {
    const userId = await getUserId();
    const customers = await googleSheetService.getCustomers(userId);
    return customers.find(c => c.customerId === customerId);
  },

  getCustomerByUserId: async (userId: string): Promise<Customer | undefined> => {
    const customers = await googleSheetService.getCustomers(userId); // Assuming getCustomers can filter by userId if needed, or fetch all and filter
    return customers.find(c => c.userId === userId);
  },
};
