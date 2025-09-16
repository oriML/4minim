import * as React from 'react';

export function CartSummarySkeleton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:relative md:border-none md:shadow-none animate-pulse">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="w-full md:w-auto">
          <div className="h-10 w-full bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
