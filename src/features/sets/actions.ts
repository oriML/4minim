'use server';

import { revalidatePath } from 'next/cache';
import { getAdminUser, resolveShopForAdmin } from '@/core/utils/user-context';
import { googleSheetService } from '@/services/google-sheets';
import { setImageService } from '@/services/set-image';
import { Set } from './types';
import { ApiResponse } from '@/core/types/responses';
import { sendSystemErrorEmail } from '@/core/utils/email';

async function getShopIdForAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error('Admin user not found.');
  }
  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }
  return shop.id;
}

export async function getSetsAction(): Promise<ApiResponse<Set[]>> {
  try {
    const shopId = await getShopIdForAdmin();
    const sets = await googleSheetService.getSetsByShop(shopId);
    return { success: true, data: sets };
  } catch (error) {
    console.error("Failed to get sets:", error);
    await sendSystemErrorEmail({ error, context: 'getSetsAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}

export async function getSetAction(id: string): Promise<ApiResponse<Set | null>> {
  try {
    const shopId = await getShopIdForAdmin();
    const sets = await googleSheetService.getSetsByShop(shopId);
    const set = sets.find(set => set.id === id) || null;
    return { success: true, data: set };
  } catch (error) {
    console.error("Failed to get set:", error);
    await sendSystemErrorEmail({ error, context: 'getSetAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}

export async function addSetAction(formData: FormData): Promise<ApiResponse> {
  try {
    const shopId = await getShopIdForAdmin();
    const setData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string,
      productsJson: JSON.parse(formData.get('productsJson') as string),
    };

    const newSet = await googleSheetService.addSet(setData, shopId);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await setImageService.uploadSetImage(imageFile, newSet.id, shopId);
    }

    revalidatePath('/admin/dashboard/sets');
    return { success: true, message: 'הסט נוסף בהצלחה!' };
  } catch (error) {
    console.error("Failed to create set:", error);
    await sendSystemErrorEmail({ error, context: 'addSetAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}

export async function updateSetAction(formData: FormData): Promise<ApiResponse> {
  try {
    const shopId = await getShopIdForAdmin();
    const setId = formData.get('setId') as string;
    const setData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string,
      productsJson: JSON.parse(formData.get('productsJson') as string),
    };

    // @ts-ignore
    await googleSheetService.updateSet(setId, setData, shopId);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await setImageService.uploadSetImage(imageFile, setId, shopId);
    }

    revalidatePath('/admin/dashboard/sets');
    revalidatePath(`/admin/dashboard/sets/${setId}/edit`);
    return { success: true, message: 'הסט עודכן בהצלחה!' };
  } catch (error) {
    console.error("Failed to update set:", error);
    await sendSystemErrorEmail({ error, context: 'updateSetAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}

export async function deleteSetAction(id: string): Promise<ApiResponse> {
  try {
    const shopId = await getShopIdForAdmin();
    // @ts-ignore
    await googleSheetService.deleteSet(id, shopId);
    revalidatePath('/admin/dashboard/sets');
    return { success: true, message: 'הסט נמחק בהצלחה!' };
  } catch (error) {
    console.error("Failed to delete set:", error);
    await sendSystemErrorEmail({ error, context: 'deleteSetAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
}
