'use client';

import { createContext, useContext } from 'react';
import { Shop } from '@/core/types';

interface ShopContextType {
  shop: Shop;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children, shop }: { children: React.ReactNode; shop: Shop }) {
  return (
    <ShopContext.Provider value={{ shop }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
