import { ProductForm } from '@/features/admin/components/ProductForm';
import { updateProductAction } from '@/features/admin/actions';
import { notFound } from 'next/navigation';
import { getProductAction } from '@/features/products/actions';

interface PageProps {
  params: { productId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function EditProductPage({ params }: PageProps) {
  const response = await getProductAction(params.productId);

  if (!response.success) {
    return <div>Error: {response.error}</div>;
  }

  if (!response.data) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-olive">ערוך מוצר</h1>
      <ProductForm action={updateProductAction} product={response.data} productId={response.data.id} />
    </div>
  );
}

export default EditProductPage;
