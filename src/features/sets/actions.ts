'use server';

import { revalidatePath } from 'next/cache';
import { getRequiredUserId, getUserId } from '@/core/utils/user-context';
import { googleSheetService } from '@/services/google-sheets';
import { setImageService } from '@/services/set-image';
import { Set } from './types';
import { redirect } from 'next/navigation';

export async function getSetsAction(): Promise<Set[]> {
  const userId = await getUserId();
  return googleSheetService.getSets(userId);
}

export async function getSetAction(id: string): Promise<Set | null> {
  const userId = await getRequiredUserId();
  const sets = await googleSheetService.getSets(userId);
  return sets.find(set => set.id === id) || null;
}

export async function addSetAction(formData: FormData): Promise<void> {
  const userId = await getRequiredUserId();
  const setData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl') as string,
    productsJson: JSON.parse(formData.get('productsJson') as string),
  };

  try {
    const newSet = await googleSheetService.addSet(setData, userId);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await setImageService.uploadSetImage(imageFile, newSet.id, userId);
    }

    revalidatePath('/admin/dashboard/sets');
  } catch (error) {
    console.error("Failed to create set:", error);
    // Handle error appropriately
  }
  redirect('/admin/dashboard/sets');
}

export async function updateSetAction(formData: FormData): Promise<void> {
  const userId = await getRequiredUserId();
  const setId = formData.get('setId') as string;
  const setData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl') as string,
    productsJson: JSON.parse(formData.get('productsJson') as string),
  };

  try {
    await googleSheetService.updateSet(setId, setData, userId);

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await setImageService.uploadSetImage(imageFile, setId, userId);
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
  const userId = await getRequiredUserId();
  await googleSheetService.deleteSet(id, userId);
  revalidatePath('/admin/dashboard/sets');
}