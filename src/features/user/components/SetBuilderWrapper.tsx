'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CustomSetBuilder } from './CustomSetBuilder';
import { getProductsByCategory } from '@/features/products/actions';
import { Product } from '@/core/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function SetBuilderWrapper({ shopId }: { shopId: string }) {
  const searchParams = useSearchParams();
  const setId = searchParams.get('setId');
  const setPrice = searchParams.get('setPrice');
  const [preselectedSetProducts, setPreselectedSetProducts] = useState<Product[] | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProductsByCategory(shopId);
      if (response.success) {
        const productsByCategoryData = response.data || {};
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
      } else {
        toast.error(response.error);
      }
    };
    fetchData();
  }, [shopId]);

  if (!productsByCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-4 rtl:space-x-reverse mb-8">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-0.5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-0.5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
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