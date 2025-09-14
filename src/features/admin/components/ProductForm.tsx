'use client';

import { Product } from '@/core/types';
import React from 'react';

interface ProductFormProps {
  action: (formData: FormData) => void;
  product?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ action, product }) => {
  return (
    <form action={action} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={product?.name}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">תיאור</label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">מחיר</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            step="0.01"
            defaultValue={product?.price}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">קטגוריה</label>
          <select
            name="category"
            id="category"
            required
            defaultValue={product?.category}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
          >
            <option value="custom">Custom</option>
            <option value="set">Set</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">כתובת תמונה</label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          required
          defaultValue={product?.imageUrl}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-700 text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
        >
          {product ? 'עדכן מוצר' : 'הוסף מוצר'}
        </button>
      </div>
    </form>
  );
};
