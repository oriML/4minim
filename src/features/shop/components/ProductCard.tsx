'use client';

import * as React from 'react';
import Image from 'next/image';
import { Product } from '@/core/types';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  qty: number;
  onQtyChange: (qty: number) => void;
}

export function ProductCard({ product, qty, onQtyChange }: ProductCardProps) {
  const handleIncrement = () => {
    onQtyChange(qty + 1);
  };

  const handleDecrement = () => {
    if (qty > 0) {
      onQtyChange(qty - 1);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center text-center">
      {product.imageURL && (
        <Image
          src={product.imageURL}
          alt={product.productName_HE}
          width={150}
          height={150}
          className="mb-4 rounded-md object-cover"
        />
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{product.productName_HE}</h3>
      <p className="mb-3 text-sm text-gray-600 flex-grow">{product.description}</p>
      <div className="flex flex-col items-center w-full mt-auto">
        <span className="text-xl font-bold text-olive mb-2">₪{product.price.toFixed(2)}</span>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handleDecrement} disabled={qty === 0} className="bg-gray-100 hover:bg-gray-200">
            -
          </Button>
          <input
            type="number"
            value={qty}
            onChange={(e) => onQtyChange(parseInt(e.target.value) || 0)}
            className="w-16 text-center border rounded-md py-1 px-2 text-gray-700"
            min="0"
          />
          <Button variant="outline" size="icon" onClick={handleIncrement} className="bg-gray-100 hover:bg-gray-200">
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
