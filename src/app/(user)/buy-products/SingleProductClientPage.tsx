'use client';

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/core/types';
import { ProductCard } from '@/features/shop/components/ProductCard';
import { CartSummary } from '@/features/shop/components/CartSummary';
import { createSingleProductOrder } from '@/features/shop/actions';

interface SingleProductClientPageProps {
  products: Product[];
}

export function SingleProductClientPage({ products }: SingleProductClientPageProps) {
  const [cart, setCart] = useState<{ [productId: string]: { qty: number } }>({});

  useEffect(() => {
    const preselectedSetProducts = localStorage.getItem('preselectedSetProducts');
    if (preselectedSetProducts) {
      try {
        const parsedProducts = JSON.parse(preselectedSetProducts);
        setCart(parsedProducts);
        localStorage.removeItem('preselectedSetProducts'); // Clear after use
      } catch (e) {
        console.error("Failed to parse preselectedSetProducts from localStorage", e);
      }
    }
  }, []);

  const updateQty = (productId: string, qty: number) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (qty <= 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = { qty };
      }
      return newCart;
    });
  };

  const groupedProducts = useMemo(() => {
    const groups: { [category: string]: Product[] } = {};
    products.forEach((product) => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [products]);

  return (
    <div className="container mx-auto py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-center text-olive mb-8">קנה מוצרים בודדים</h1>

      {Object.entries(groupedProducts).map(([category, productsInCategory]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-right">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsInCategory.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qty={cart[product.id]?.qty || 0}
                onQtyChange={(q) => updateQty(product.id, q)}
              />
            ))}
          </div>
        </section>
      ))}

      <CartSummary cart={cart} products={products} createOrderAction={createSingleProductOrder} />
    </div>
  );
}
