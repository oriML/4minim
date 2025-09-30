import { SetForm } from '@/features/admin/components/SetForm';

export default function NewSetPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">הוסף סט חדש</h1>
      <SetForm />
    </div>
  );
}
