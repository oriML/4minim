import { redirect } from "next/navigation";

async function AdminSetsPage() {
    redirect('/admin/dashboard/sets');
}

export default AdminSetsPage;
