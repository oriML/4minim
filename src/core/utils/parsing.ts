import { UIProduct, OrderProduct } from '@/core/types';

export function parseProductsJson(productsJson: string): UIProduct[] {
  try {
    const parsed = JSON.parse(productsJson) as Record<string, OrderProduct>;
    return Object.entries(parsed).map(([productId, productData]) => ({
      ...productData,
      productId,
      name: productData.name || 'Unknown Product',
      imageUrl: productData.imageUrl || '',
    }));
  } catch (error) {
    console.error('Failed to parse products JSON:', error);
    return [];
  }
}
