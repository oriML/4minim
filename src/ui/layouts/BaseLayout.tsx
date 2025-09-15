import React from 'react';
import Image from 'next/image';

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <header className="bg-green-700 text-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/images/app-logo.png" alt="App Logo" width={40} height={40} className="ml-2" style={{ borderRadius: '50%' }} />
            <h1 className="text-2xl font-bold">ארבעת המינים</h1>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 text-gray-600 py-4">
        <div dir='ltr' className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Boutique E-commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
