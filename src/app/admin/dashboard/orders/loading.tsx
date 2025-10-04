import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function OrdersLoading() {
  return (
    <div className="rounded-md border bg-white p-4 shadow-sm" dir="rtl">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <Skeleton className="h-8 w-32 mb-4" />
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-right">צפייה</TableHead>
              <TableHead className="w-[100px] text-right">מזהה הזמנה</TableHead>
              <TableHead className="text-right">שם לקוח</TableHead>
              <TableHead className="text-right">טלפון</TableHead>
              <TableHead className="text-right">סך הכל</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="w-[100px] text-right">סטטוס תשלום</TableHead>
              <TableHead className="text-right">דרוש משלוח</TableHead>
              <TableHead className="text-right">תאריך</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 7 }).map((_, i) => (
              <TableRow key={i} className="border-b last:border-b-0">
                <TableCell>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </TableCell>
                <TableCell className="font-medium text-right">
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-16 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-16 rounded-md" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Skeletons */}
      <div className="md:hidden">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="relative bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="absolute top-2 left-2">
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <div className="absolute top-2 right-2">
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              <div className="flex flex-col items-center text-center pt-10 pb-4">
                <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-5 w-1/3 rounded-md mt-2" />
                <div className="flex items-center space-x-2 space-x-reverse mt-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-1/4 rounded-md mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersLoading;