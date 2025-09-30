
import { Skeleton } from '@/components/ui/skeleton';

function SummaryLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" dir="rtl">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default SummaryLoading;
