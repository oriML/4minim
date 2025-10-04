import { Navbar } from '@/ui/components/Navbar';

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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