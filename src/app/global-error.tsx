'use client';

import ErrorBoundary from '@/core/error/ErrorBoundary';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void; }) {
  console.error(error);
  return (
    <html>
      <body>
        <ErrorBoundary>
          {/* This children won't be used as ErrorBoundary will render its fallback UI */}
          {/* The reset function from Next.js can be passed to the boundary if needed */}
        </ErrorBoundary>
      </body>
    </html>
  );
}
