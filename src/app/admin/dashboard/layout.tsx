'use client'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';

function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split('/').pop();

  const handleTabChange = (value: string) => {
    router.push(`/admin/dashboard/${value}`);
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="hidden md:grid w-full grid-cols-4 sticky top-0 z-10 bg-white p-2 rounded-lg shadow-md">
            <TabsTrigger value="sets" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">סטים</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">מוצרים</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">הזמנות</TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md transition-all duration-200">סיכום</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}

export default AdminDashboardLayout;