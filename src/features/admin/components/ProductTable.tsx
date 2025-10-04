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
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <Link href="/admin/products/new">
          <Button className="bg-green-700 text-white hover:bg-green-800 cursor-pointer">
            הוסף מוצר
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800">מוצרים</h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
                  לא נמצאו מוצרים
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <TableCell className='text-center'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <span className="sr-only">פתח תפריט</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/admin/products/${product.id}/edit`} className="flex items-center text-yellow-400">
                            <span>ערוך</span>
                            <Pencil className="ml-2 h-4 w-4" />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} disabled={isPending} className="text-red-600">
                          <span>{isPending ? 'מוחק...' : 'מחק'}</span>
                          <Trash2 className="ml-2 h-4 w-4" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-center">₪{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{product.category}</TableCell>
                  <TableCell className="text-center">{product.productName_HE}</TableCell>
                  <TableCell className="font-medium text-right">{product.id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {products.length === 0 ? (
          <div className="h-24 text-center flex items-center justify-center">
            לא נמצאו מוצרים
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="relative bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="absolute top-2 left-2 flex space-x-2 rtl:space-x-reverse">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(product.id)} disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="link" className="text-sm text-blue-600 p-0 h-auto">
                      צפה בפרטים
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col items-center text-center pt-10 pb-4">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.productName_HE} className="w-24 h-24 object-cover rounded-full mb-4" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">{product.productName_HE}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-md font-bold text-gray-900 mt-2">₪{product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
