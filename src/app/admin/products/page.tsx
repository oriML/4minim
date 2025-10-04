import { redirect } from "next/navigation";

async function AdminProductsPage() {
    redirect('/admin/dashboard/products');
}

export default AdminProductsPage;
