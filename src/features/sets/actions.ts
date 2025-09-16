'use server';

import { Set } from '@/features/sets/types';
import { googleSheetService } from '@/services/google-sheets';

/**
 * Server Action: Fetches all sets from Google Sheets.
 * @returns A promise that resolves to an array of all sets.
 */
export const getSetsAction = async (): Promise<Set[]> => {
  try {
    const sets = await googleSheetService.getSets();
    return sets;
  } catch (error) {
    console.error("Failed to fetch sets:", error);
    return []; // Return an empty array in case of an error
  }
};
