import React from 'react';
import { Product } from '@/core/types';
import { ProductCard } from '@/ui/components/ProductCard';

interface StepProps {
  title: string;
  products: Product[];
  selected: Product | null;
  onSelect: (product: Product) => void;
}

export const Step: React.FC<StepProps> = ({ title, products, selected, onSelect }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            name={product.productName_HE}
            {...product}
            isSelected={selected?.id === product.id}
            onSelect={() => onSelect(product)}
          />
        ))}
      </div>
    </div>
  );
};