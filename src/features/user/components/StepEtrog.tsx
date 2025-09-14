import React from 'react';
import { Product } from '@/core/types';
import { ProductCard } from '@/ui/components/ProductCard';

const etrogim: Omit<Product, 'category'>[] = [
  { id: 'ETROG-1', name: 'Standard Etrog', description: 'A certified kosher etrog from Israel.', price: 30, imageUrl: '/images/etrog1.jpg' },
  { id: 'ETROG-2', name: 'Yanever Etrog', description: 'A premium etrog with a distinct shape.', price: 50, imageUrl: '/images/etrog2.jpg' },
  { id: 'ETROG-3', name: 'אתרוג ללא פיטם', description: 'אתרוג יפהפה ללא פיטם.', price: 40, imageUrl: '/images/etrog3.jpg' },
];

interface StepProps {
  selected: Product | null;
  onSelect: (product: Product) => void;
}

export const StepEtrog: React.FC<StepProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6">2. בחר אתרוג</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {etrogim.map(etrog => (
          <ProductCard 
            key={etrog.id} 
            {...etrog} 
            category="custom"
            isSelected={selected?.id === etrog.id}
            onSelect={() => onSelect({ ...etrog, category: 'custom' })}
          />
        ))}
      </div>
    </div>
  );
};
