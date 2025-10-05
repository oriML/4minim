import { SetTable } from '@/features/admin/components/SetTable';
import { getSetsAction } from '@/features/sets/actions';

export const revalidate = 0;

async function AdminSetsPage() {
  const response = await getSetsAction();

  if (!response.success) {
    return <div>Error: {response.error}</div>;
  }

  return (
    <div className="mt-6">
      <SetTable sets={response.data || []} />
    </div>
  );
}

export default AdminSetsPage;
