'use client';

import { Set } from '@/features/sets/types';
import { deleteSetAction } from '@/features/sets/actions';
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

interface SetTableProps {
  sets: Set[];
}

export const SetTable: React.FC<SetTableProps> = ({ sets }) => {
  let [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this set?')) {
      startTransition(() => {
        deleteSetAction(id);
      });
    }
  };

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/sets/new">
          <Button className="bg-green-700 text-white hover:bg-green-800 cursor-pointer">
            הוסף סט
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-gray-800">סטים</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>פעולות</TableHead>
            <TableHead>מחיר</TableHead>
            <TableHead>שם הסט</TableHead>
            <TableHead className="w-[100px]">מזהה</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                לא נמצאו סטים
              </TableCell>
            </TableRow>
          ) : (
            sets.map((set) => (
              <TableRow key={set.id} className="border-b last:border-b-0 hover:bg-gray-50">
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
                        <Link href={`/admin/sets/${set.id}/edit`} className="flex items-center text-yellow-400">
                          <span>ערוך</span>
                          <Pencil className="ml-2 h-4 w-4" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(set.id)} disabled={isPending} className="text-red-600">
                        <span>{isPending ? 'מוחק...' : 'מחק'}</span>
                        <Trash2 className="ml-2 h-4 w-4" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-center">₪{set.price.toFixed(2)}</TableCell>
                <TableCell className="text-center">{set.title}</TableCell>
                <TableCell className="font-medium text-right">{set.id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
