'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CustomSetBuilder } from './CustomSetBuilder';
import { getProductsByCategory } from '@/features/products/actions';
import { Product } from '@/core/types';

export function SetBuilderWrapper({ shopId }: { shopId: string }) {
  const searchParams = useSearchParams();
  const setId = searchParams.get('setId');
  const setPrice = searchParams.get('setPrice');
  const [preselectedSetProducts, setPreselectedSetProducts] = useState<Product[] | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const productsByCategoryData = await getProductsByCategory(shopId);
      setProductsByCategory(productsByCategoryData);

      const allProducts: Product[] = Object.values(productsByCategoryData).flat();

      const storedProductsJson = localStorage.getItem('preselectedSetProducts');

      if (storedProductsJson) {
        try {
          const preselectedProductsMap: Record<string, { qty: number }> = JSON.parse(storedProductsJson);

          const preselected: Product[] = [];

          Object.keys(preselectedProductsMap).forEach(productId => {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
              preselected.push(product);
            }
          });
          setPreselectedSetProducts(preselected);
        } catch (e) {
          console.error("Failed to parse preselectedSetProducts from localStorage", e);
        } finally {
          localStorage.removeItem('preselectedSetProducts');
        }
      }
    };
    fetchData();
  }, [shopId]);

  if (!productsByCategory) {
    return <div>Loading products...</div>; // Or a skeleton loader
  }

  return (
    <CustomSetBuilder
      productsByCategory={productsByCategory}
      preselectedSetProducts={preselectedSetProducts}
      setId={setId}
      setPrice={setPrice ? parseFloat(setPrice) : undefined}
    />
  );
}