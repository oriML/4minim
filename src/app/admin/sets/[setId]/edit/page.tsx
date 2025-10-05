import { getSetAction } from '@/features/sets/actions';
import { SetForm } from '@/features/admin/components/SetForm';
import { notFound } from 'next/navigation';

interface EditSetPageProps {
  params: {
    setId: string;
  };
}

export default async function EditSetPage({ params }: EditSetPageProps) {
  const response = await getSetAction(params.setId);

  if (!response.success) {
    return <div>Error: {response.error}</div>;
  }

  if (!response.data) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">ערוך סט</h1>
      <SetForm set={response.data} />
    </div>
  );
}
