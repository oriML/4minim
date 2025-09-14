import { ProductForm } from '@/features/admin/components/ProductForm';
import { createProductAction } from '@/features/admin/actions';

function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-olive">Add New Product</h1>
      <ProductForm action={createProductAction} />
    </div>
  );
}

export default NewProductPage;
