
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
  );
}

export default OrdersLoading;
