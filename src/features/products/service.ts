import { googleSheetService } from '@/services/google-sheets';
import { Product } from '@/core/types';
import { getUserId, getRequiredUserId } from '@/core/utils/user-context';

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const userId = await getUserId();
    return googleSheetService.getProducts(userId);
  },

  createProduct: async (product: Omit<Product, 'id' | 'userId'>): Promise<Product> => {
    const userId = await getRequiredUserId();
    return googleSheetService.addProduct(product, userId);
  },

  updateProduct: async (id: string, updates: Partial<Omit<Product, 'id' | 'userId'>>): Promise<Product> => {
    const userId = await getRequiredUserId();
    return googleSheetService.updateProduct(id, updates, userId);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const userId = await getRequiredUserId();
    return googleSheetService.deleteProduct(id, userId);
  },
};
