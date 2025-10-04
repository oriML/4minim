import { SetTable } from '@/features/admin/components/SetTable';
import { googleSheetService } from '@/services/google-sheets';
import { getAdminUser, resolveShopForAdmin } from '@/core/utils/user-context';
import { redirect } from 'next/navigation';

export const revalidate = 0;

async function AdminSetsPage() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    return <div>לא נמצאה חנות למנהל</div>;
  }

  const sets = await googleSheetService.getSetsByShop(shop.id);

  return (
    <div className="mt-6">
      {/* @ts-ignore */}
      <SetTable sets={sets} />
    </div>
  );
}

export default AdminSetsPage;
