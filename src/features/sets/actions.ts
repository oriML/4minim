'use server';

import { revalidatePath } from 'next/cache';
import { getAdminUser, resolveShopForAdmin } from '@/core/utils/user-context';
import { googleSheetService } from '@/services/google-sheets';
import { setImageService } from '@/services/set-image';
import { Set } from './types';
import { redirect } from 'next/navigation';

async function getShopIdForAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }
  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }
  return shop.id;
}

export async function getSetsAction(): Promise<Set[]> {
  const shopId = await getShopIdForAdmin();
  return googleSheetService.getSetsByShop(shopId);
}

export async function getSetAction(id: string): Promise<Set | null> {
  const shopId = await getShopIdForAdmin();
  const sets = await googleSheetService.getSetsByShop(shopId);
  return sets.find(set => set.id === id) || null;
}

export async function addSetAction(formData: FormData): Promise<void> {
  const shopId = await getShopIdForAdmin();
  const setData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl') as string,
    productsJson: JSON.parse(formData.get('productsJson') as string),
  };

  try {
    const newSet = await googleSheetService.addSet(setData, shopId);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await setImageService.uploadSetImage(imageFile, newSet.id, shopId);
    }

    revalidatePath('/admin/dashboard/sets');
  } catch (error) {
    console.error("Failed to create set:", error);
    // Handle error appropriately
  }
  redirect('/admin/dashboard/sets');
}

export async function updateSetAction(formData: FormData): Promise<void> {
  const shopId = await getShopIdForAdmin();
  const setId = formData.get('setId') as string;
  const setData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl') as string,
    productsJson: JSON.parse(formData.get('productsJson') as string),
  };

  try {
    // @ts-ignore
    await googleSheetService.updateSet(setId, setData, shopId);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await setImageService.uploadSetImage(imageFile, setId, shopId);
    }

    revalidatePath('/admin/dashboard/sets');
    revalidatePath(`/admin/dashboard/sets/${setId}/edit`);
  } catch (error) {
    console.error("Failed to update set:", error);
    // Handle error appropriately
  }
  redirect('/admin/dashboard/sets');
}

export async function deleteSetAction(id: string): Promise<void> {
  const shopId = await getShopIdForAdmin();
  // @ts-ignore
  await googleSheetService.deleteSet(id, shopId);
  revalidatePath('/admin/dashboard/sets');
}
