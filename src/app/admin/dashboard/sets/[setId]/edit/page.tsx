import { getSetAction } from '@/features/sets/actions';
import { SetForm } from '@/features/admin/components/SetForm';
import { notFound } from 'next/navigation';

interface EditSetPageProps {
  params: {
    setId: string;
  };
}

export default async function EditSetPage({ params }: EditSetPageProps) {
  const set = await getSetAction(params.setId);

  if (!set) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">ערוך סט</h1>
      <SetForm set={set} />
    </div>
  );
}
