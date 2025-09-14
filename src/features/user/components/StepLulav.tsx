import React from 'react';
import { Product } from '@/core/types';
import { ProductCard } from '@/ui/components/ProductCard';

const lulavim: Omit<Product, 'category'>[] = [
  { id: 'LULAV-1', name: 'Standard Lulav', description: 'A quality, standard lulav.', price: 15, imageUrl: '/images/lulav1.jpg' },
  { id: 'LULAV-2', name: 'לולב דרי', description: 'לולב מהודר הידוע ביושרו.', price: 25, imageUrl: '/images/lulav2.jpg' },
];

interface StepProps {
  selected: Product | null;
  onSelect: (product: Product) => void;
}

export const StepLulav: React.FC<StepProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6">1. בחר לולב</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lulavim.map(lulav => (
          <ProductCard 
            key={lulav.id} 
            {...lulav} 
            category="custom"
            isSelected={selected?.id === lulav.id}
            onSelect={() => onSelect({ ...lulav, category: 'custom' })}
          />
        ))}
      </div>
    </div>
  );
};
