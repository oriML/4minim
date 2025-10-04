import { googleSheetService } from '@/services/google-sheets';
import { Set } from '@/core/types';

export const setService = {
  getSetsByShop: async (shopId: string): Promise<Set[]> => {
    return googleSheetService.getSetsByShop(shopId);
  },

  createSet: async (set: Omit<Set, 'id' | 'shopId'>, shopId: string): Promise<Set> => {
    return googleSheetService.addSet(set, shopId);
  },

  updateSet: async (id: string, updates: Partial<Omit<Set, 'id' | 'shopId'>>, shopId: string): Promise<Set> => {
    // @ts-ignore
    return googleSheetService.updateSet(id, updates, shopId);
  },

  deleteSet: async (id: string, shopId: string): Promise<void> => {
    // @ts-ignore
    return googleSheetService.deleteSet(id, shopId);
  },
};