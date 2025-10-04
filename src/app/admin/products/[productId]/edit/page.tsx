import { ProductForm } from '@/features/admin/components/ProductForm';
import { updateProductAction } from '@/features/admin/actions';
import { notFound } from 'next/navigation';
import { productService } from '@/features/products/service';
import { getProductAction } from '@/features/products/actions';

interface PageProps {
  params: { productId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function EditProductPage({ params }: PageProps) {
  const product = await getProductAction(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-olive">ערוך מוצר</h1>
      <ProductForm action={updateProductAction} product={product} productId={product.id} />
    </div>
  );
}

export default EditProductPage;
