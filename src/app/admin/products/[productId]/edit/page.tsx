import { googleSheetService } from '@/services/google-sheets';
import { ProductForm } from '@/features/admin/components/ProductForm';
import { updateProductAction } from '@/features/admin/actions';
import { notFound } from 'next/navigation';
import { Product } from '@/core/types';

interface PageProps {
  params: { productId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function EditProductPage({ params }: PageProps) {
  const products = await googleSheetService.getProducts();
  const product = products.find(p => p.id === params.productId);

  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-olive">ערוך מוצר</h1>
      <ProductForm action={updateAction} product={product} />
    </div>
  );
}

export default EditProductPage;
