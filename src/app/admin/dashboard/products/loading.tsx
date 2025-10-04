import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function ProductsLoading() {
  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
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
            {Array.from({ length: 7 }).map((_, i) => (
              <TableRow key={i} className="border-b last:border-b-0">
                <TableCell className='text-center'>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-16 rounded-md" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-32 rounded-md" />
                </TableCell>
                <TableCell className="font-medium text-right">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Skeletons */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="absolute top-2 left-2 flex space-x-2 rtl:space-x-reverse">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <div className="absolute top-2 right-2">
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              <div className="flex flex-col items-center text-center pt-10 pb-4">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-5 w-1/3 rounded-md mt-2" />
                <Skeleton className="h-4 w-1/4 rounded-md mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsLoading;