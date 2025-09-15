import React from 'react';
import Image from 'next/image';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, imageUrl, isSelected, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg p-4 bg-white cursor-pointer transition-all ${isSelected ? 'border-olive shadow-2xl scale-105' : 'shadow-md hover:shadow-lg'}`}
      onClick={onSelect}
    >
      <div className="relative h-40 w-full mb-4">
        <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" className="rounded-md" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
      <p className="text-gray-500 text-sm mb-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-md font-semibold text-olive">₪{price}</span>
        <button 
          className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors ${isSelected ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {isSelected ? 'נבחר' : 'בחר'}
        </button>
      </div>
    </div>
  );
};
