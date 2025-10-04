'use client';

import React from 'react';
import { Set } from '@/core/types';
import { SetCard } from '@/features/sets/components/SetCard';
import { useShop } from '../ShopContext';

interface SetsClientPageProps {
  sets: Set[];
}

export function SetsClientPage({ sets }: SetsClientPageProps) {
  const { shop } = useShop();

  return (
    <div dir="rtl">
      <main className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark">סטים מוכנים</h1>
          <p className="text-lg text-gray-600 mt-2">בחרו מתוך מגוון הסטים המוכנים שלנו.</p>
        </div>

        {sets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sets.map((set) => (
              <SetCard key={set.id} set={set} shopSlug={shop.slug} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xl py-20">
            אין סטים זמינים כרגע.
          </div>
        )}
      </main>
    </div>
  );
}

