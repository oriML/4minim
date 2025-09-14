import React from 'react';

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <header className="bg-green-700 text-white shadow-md">
        <nav className="container mx-auto px-6 py-3">
          <h1 className="text-2xl font-bold">Boutique E-commerce</h1>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 text-gray-600 py-4">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 Boutique E-commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
