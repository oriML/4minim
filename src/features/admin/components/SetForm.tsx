'use client';

import { Set } from '@/features/sets/types';
import { Product } from '@/core/types';
import { addSetAction, updateSetAction } from '@/features/sets/actions';
import { getAllProductsAction } from '@/features/products/actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useTransition, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ImageViewer } from '@/components/ui/ImageViewer';
import { toast } from 'sonner';

interface SetFormProps {
  set?: Set;
}

export const SetForm: React.FC<SetFormProps> = ({ set }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(set?.title || '');
  const [description, setDescription] = useState(set?.description || '');
  const [price, setPrice] = useState(set?.price || 0);
  const [productsJson, setProductsJson] = useState<Record<string, { qty: number }>>(set?.productsJson || {});
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProductsAction();
      if (response.success) {
        setAllProducts(response.data || []);
      } else {
        toast.error(response.error);
      }
    };
    fetchProducts();
  }, []);

  const productsByCategory = useMemo(() => {
    return allProducts.reduce((acc, product) => {
      const category = product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [allProducts]);

  const handleProductSelection = (productId: string, isSelected: boolean) => {
    const newProductsJson = { ...productsJson };
    if (isSelected) {
      newProductsJson[productId] = { qty: 1 };
    } else {
      delete newProductsJson[productId];
    }
    setProductsJson(newProductsJson);
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    if (qty > 0) {
      setProductsJson({
        ...productsJson,
        [productId]: { qty },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('productsJson', JSON.stringify(productsJson));

    if (set) {
      formData.append('setId', set.id);
    }

    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    } else if (set?.imageUrl) {
      formData.append('imageUrl', set.imageUrl);
    }

    startTransition(async () => {
      const action = set ? updateSetAction : addSetAction;
      const response = await action(formData);
      if (response.success) {
        toast.success(response.message);
        router.push('/admin/dashboard/sets');
      } else {
        toast.error(response.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">שם הסט</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">מחיר</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">תיאור</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תמונת הסט</label>
        <ImageViewer
          initialImageUrl={set?.imageUrl}
          onImageSelect={setSelectedImageFile}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">מוצרים בסט</h3>
        <div className="space-y-6 mt-4">
          {Object.entries(productsByCategory).map(([category, products]) => (
            <div key={category}>
              <h4 className="text-md font-bold text-gray-800 border-b pb-2 mb-4">{category}</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <div key={product.id} 
                       className="relative rounded-lg border border-gray-300 shadow-sm h-40 overflow-hidden">
                    <img src={product.imageUrl} alt={product.productName_HE} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute top-0 right-0 p-2 z-10 flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id={`product-${product.id}`}
                          type="checkbox"
                          checked={!!productsJson[product.id]}
                          onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="mr-3 text-sm">
                        <label htmlFor={`product-${product.id}`} className="font-medium text-white">{product.productName_HE}</label>
                      </div>
                    </div>
                    {productsJson[product.id] && (
                      <div className="absolute bottom-0 right-0 p-2 z-10">
                        <label htmlFor={`qty-${product.id}`} className="text-xs text-white">כמות</label>
                        <input
                          type="number"
                          id={`qty-${product.id}`}
                          value={productsJson[product.id].qty}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                          className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white/80"
                          min="1"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="bg-green-700 text-white font-bold cursor-pointer py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors">
          {isPending ? (set ? 'מעדכן...' : 'מוסיף...') : (set ? 'עדכן סט' : 'הוסף סט')}
        </Button>
      </div>
    </form>
  );
};
