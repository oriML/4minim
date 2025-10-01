'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CustomSetBuilder } from './CustomSetBuilder';
import { getProductsByCategory, getProductsAction } from '@/features/products/actions';
import { Product } from '@/core/types';

export function SetBuilderWrapper() {
  const searchParams = useSearchParams();
  const setId = searchParams.get('setId');
  const setPrice = searchParams.get('setPrice');
  const [preselectedSetProducts, setPreselectedSetProducts] = useState<Product[] | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("SetBuilderWrapper useEffect: Starting fetchData");
      const products = await getProductsByCategory();
      setProductsByCategory(products);
      console.log("SetBuilderWrapper useEffect: productsByCategory loaded", products);

      const storedProductsJson = localStorage.getItem('preselectedSetProducts');
      console.log("SetBuilderWrapper useEffect: storedProductsJson from localStorage", storedProductsJson);

      if (storedProductsJson) {
        try {
          const preselectedProductsMap: Record<string, { qty: number }> = JSON.parse(storedProductsJson);
          console.log("SetBuilderWrapper useEffect: preselectedProductsMap", preselectedProductsMap);

          const allProducts = await getProductsAction(); // Fetch all products
          console.log("SetBuilderWrapper useEffect: allProducts loaded", allProducts);

          const preselected: Product[] = [];

          Object.keys(preselectedProductsMap).forEach(productId => {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
              preselected.push(product);
            }
          });
          console.log("SetBuilderWrapper useEffect: preselected products array", preselected);
          setPreselectedSetProducts(preselected);
        } catch (e) {
          console.error("Failed to parse preselectedSetProducts from localStorage", e);
        } finally {
          localStorage.removeItem('preselectedSetProducts'); // Clear after use
        }
      }
    };
    fetchData();
  }, []);

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
