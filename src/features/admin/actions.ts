'use server';

import { googleSheetService } from '@/services/google-sheets';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Product } from '@/core/types';

export const createProductAction = async (formData: FormData) => {
  const productData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl') as string,
    category: formData.get('category') as 'set' | 'custom',
  };

  await googleSheetService.addProduct(productData);
  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
};

export const updateProductAction = async (id: string, formData: FormData) => {
  const productData: Partial<Omit<Product, 'id'>> = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    imageUrl: formData.get('imageUrl') as string,
    category: formData.get('category') as 'set' | 'custom',
  };

  await googleSheetService.updateProduct(id, productData);
  revalidatePath('/admin/dashboard');
  redirect('/admin/dashboard');
};

export const deleteProductAction = async (id: string) => {
  await googleSheetService.deleteProduct(id);
  revalidatePath('/admin/dashboard');
};
