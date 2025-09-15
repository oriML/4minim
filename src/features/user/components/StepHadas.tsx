import React from 'react';
import { Product } from '@/core/types';
import { ProductCard } from '@/ui/components/ProductCard';

const hadasim: Omit<Product, 'category'>[] = [
  { id: 'HADAS-1', name: 'הדס רגיל', description: 'צרור של שלושה ענפי הדס כשרים.', price: 10, imageUrl: '/images/hadas1.jpg' },
];

interface StepProps {
  selected: Product | null;
  onSelect: (product: Product) => void;
}

export const StepHadas: React.FC<StepProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6">3. בחר הדס</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
        {hadasim.map(hadas => (
          <div key={hadas.id} className="md:col-start-2">
            <ProductCard 
              {...hadas} 
              isSelected={selected?.id === hadas.id}
              onSelect={() => onSelect({ ...hadas, category: 'custom' })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
