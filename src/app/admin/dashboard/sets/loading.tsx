
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function SetsLoading() {
  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
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
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRow key={i} className="border-b last:border-b-0">
              <TableCell className='text-center'>
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-16 rounded-md" />
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
  );
}

export default SetsLoading;
