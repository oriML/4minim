import { getSetsAction } from '@/features/sets/actions';
import { SetTable } from '@/features/admin/components/SetTable';

export default async function SetsPage() {
  const sets = await getSetsAction();

  return (
    <div className="container mx-auto p-4">
      <SetTable sets={sets} />
    </div>
  );
}
