import React from 'react';
import { Product } from '@/core/types';
import { ProductCard } from '@/ui/components/ProductCard';

const aravot: Omit<Product, 'category'>[] = [
  { id: 'ARAVA-1', name: 'ערבה רגילה', description: 'צרור של שני ענפי ערבה כשרים.', price: 5, imageUrl: '/images/arava1.jpg' },
];

interface StepProps {
  selected: Product | null;
  onSelect: (product: Product) => void;
}

export const StepArava: React.FC<StepProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6">4. בחר ערבה</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
        {aravot.map(arava => (
          <div key={arava.id} className="md:col-start-2">
            <ProductCard 
              {...arava} 
              category="custom"
              isSelected={selected?.id === arava.id}
              onSelect={() => onSelect({ ...arava, category: 'custom' })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
