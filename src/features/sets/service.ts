import { googleSheetService } from '@/services/google-sheets';
import { Set } from '@/features/sets/types';
import { getUserId, getRequiredUserId } from '@/core/utils/user-context';

export const setService = {
  getSets: async (): Promise<Set[]> => {
    const userId = await getUserId();
    return googleSheetService.getSets(userId);
  },

  createSet: async (set: Omit<Set, 'id' | 'userId'>): Promise<Set> => {
    const userId = await getRequiredUserId();
    return googleSheetService.addSet(set, userId);
  },

  updateSet: async (id: string, updates: Partial<Omit<Set, 'id' | 'userId'>>): Promise<Set> => {
    const userId = await getRequiredUserId();
    return googleSheetService.updateSet(id, updates, userId);
  },

  deleteSet: async (id: string): Promise<void> => {
    const userId = await getRequiredUserId();
    return googleSheetService.deleteSet(id, userId);
  },
};
