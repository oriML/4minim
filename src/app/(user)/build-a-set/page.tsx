'use client';

import { Suspense } from 'react';
import { SetBuilderWrapper } from '@/features/user/components/SetBuilderWrapper';

export default function CustomSetPage() {
  return (
    <Suspense fallback={<div>Loading set builder...</div>}>
      <SetBuilderWrapper />
    </Suspense>
  );
}

