import { CustomSetBuilder } from '@/features/user/components/CustomSetBuilder';
import { getProductsByCategory } from '@/features/products/actions';

export default async function CustomSetPage() {
  const productsByCategory = await getProductsByCategory();
  return <CustomSetBuilder productsByCategory={productsByCategory} />;
}
