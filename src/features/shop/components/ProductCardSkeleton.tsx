import * as React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm flex flex-col items-center text-center animate-pulse">
      <div className="mb-4 rounded-md bg-gray-200 h-[150px] w-[150px]"></div>
      <div className="mb-2 h-6 w-3/4 bg-gray-200 rounded"></div>
      <div className="mb-3 h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      <div className="flex items-center justify-between w-full mt-auto pt-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
