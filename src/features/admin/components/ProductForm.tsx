'use client';

import { Product } from '@/core/types';
import React, { useState } from 'react';
import { ImageViewer } from '@/components/ui/ImageViewer';

interface ProductFormProps {
  action: (formData: FormData) => void;
  product?: Product;
  productId?: string; // Add productId as an optional prop
}

export const ProductForm: React.FC<ProductFormProps> = ({ action, product, productId }) => {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }
    await action(formData);
  };

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      {productId && <input type="hidden" name="productId" value={productId} />}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">שם מוצר</label>
        <input
          type="text"
          name="productName_HE"
          id="productName_HE"
          required
          defaultValue={product?.productName_HE}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">שם מוצר (באנגלית)</label>
        <input
          type="text"
          name="productName_EN"
          id="productName_EN"
          required
          defaultValue={product?.productName_EN}
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
          <input
            name="category"
            id="category"
            required
            defaultValue={product?.category}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
          />
            {/* <option value="custom">מותאם אישית</option>
            <option value="set">סט</option>
          </select> */}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תמונת מוצר</label>
        <ImageViewer
          initialImageUrl={product?.imageURL}
          onImageSelect={setSelectedImageFile}
        />
        {/* Hidden input for imageUrl to ensure it's always present in formData, even if no new image is selected */}
        {!selectedImageFile && product?.imageURL && (
          <input type="hidden" name="imageUrl" value={product.imageURL} />
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-700 text-white font-bold cursor-pointer py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
        >
          {product ? 'עדכן מוצר' : 'הוסף מוצר'}
        </button>
      </div>
    </form>
  );
};
