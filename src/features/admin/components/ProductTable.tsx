'use client';

import { Product } from '@/core/types';
import { deleteProductAction } from '../actions';
import Link from 'next/link';
import { useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ProductTableProps {
  products: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  let [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      startTransition(() => {
        deleteProductAction(id);
      });
    }
  };

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <Link href="/admin/products/new">
          <Button className="bg-green-700 text-white hover:bg-green-800">
            Add Product
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>פעולות</TableHead>
            <TableHead>מחיר</TableHead>
            <TableHead>קטגוריה</TableHead>
            <TableHead>שם מוצר</TableHead>
            <TableHead className="w-[100px]">מזהה מוצר</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                        ערוך
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      disabled={isPending}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {isPending ? 'מוחק...' : 'מחק'}
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">{product.category}</TableCell>
                <TableCell className="text-center">{product.productName_HE}</TableCell>
                <TableCell className="font-medium text-right">{product.id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};