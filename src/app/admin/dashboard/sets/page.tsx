import { SetTable } from '@/features/admin/components/SetTable';
import { getSetsAction } from '@/features/sets/actions';

export const revalidate = 0;

async function AdminSetsPage() {
  const sets = await getSetsAction();

  return (
    <div className="mt-6">
      <SetTable sets={sets} />
    </div>
  );
}

export default AdminSetsPage;