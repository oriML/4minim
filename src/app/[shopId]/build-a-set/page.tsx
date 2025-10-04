import { Suspense } from 'react';
import { SetBuilderWrapper } from '@/features/user/components/SetBuilderWrapper';
import { googleSheetService } from '@/services/google-sheets';
import { notFound } from 'next/navigation';

export default async function CustomSetPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  const shop = await googleSheetService.getShopBySlug(shopId);

  if (!shop) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading set builder...</div>}>
      <SetBuilderWrapper shopId={shop.id} />
    </Suspense>
  );
}