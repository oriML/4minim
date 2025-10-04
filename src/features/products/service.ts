import { googleSheetService } from '@/services/google-sheets';
import { Product } from '@/core/types';

export const productService = {
  getProductsByShop: async (shopId: string): Promise<Product[]> => {
    return googleSheetService.getProductsByShop(shopId);
  },

  createProduct: async (product: Omit<Product, 'id' | 'shopId'>, shopId: string): Promise<Product> => {
    return googleSheetService.addProduct(product, shopId);
  },

  updateProduct: async (id: string, updates: Partial<Omit<Product, 'id' | 'shopId'>>, shopId: string): Promise<Product> => {
    // @ts-ignore
    return googleSheetService.updateProduct(id, updates, shopId);
  },

  deleteProduct: async (id: string, shopId: string): Promise<void> => {
    // @ts-ignore
    return googleSheetService.deleteProduct(id, shopId);
  },
};