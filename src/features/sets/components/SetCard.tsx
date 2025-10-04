'use client';

import React from 'react';
import Image from 'next/image';
import { Set } from '@/features/sets/types';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useShop } from '@/app/[shopId]/ShopContext';

interface SetCardProps {
  set: Set;
  shopSlug: string; // Change to shopSlug
}

export const SetCard: React.FC<SetCardProps> = ({ set, shopSlug }) => {
  const router = useRouter(); // Initialize useRouter

  const handleSelectSet = () => {
    // Save productsJson to localStorage
    localStorage.setItem('preselectedSetProducts', JSON.stringify(set.productsJson));
    // Navigate to the build-a-set page
    router.push(`/${shopSlug}/build-a-set?setId=${set.id}&setPrice=${set.price}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border-2 border-brand-brown transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        {set?.imageUrl ? (
          <Image src={set.imageUrl} alt={set.title} layout="fill" objectFit="cover" />
        ) : (
          <span className="text-sm text-gray-400">No Image</span>
        )}
      </div>

      <div className="p-5 flex flex-col h-[200px]">
        <h3 className="text-xl font-bold text-brand-dark mb-2">{set.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow overflow-hidden text-ellipsis">{set.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-brand-dark">₪{set.price.toFixed(2)}</span>
          <button
            onClick={handleSelectSet} // Add onClick handler
            className="px-4 py-2 cursor-pointer rounded-lg bg-green-800 text-white font-bold uppercase tracking-wider transform transition-transform duration-200 hover:bg-brand-gold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
            aria-label={`בחר סט ${set.title}`} // Update aria-label
          >
            בחר
          </button>
        </div>
      </div>
    </div>
  );
};