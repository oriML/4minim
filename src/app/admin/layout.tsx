import { Button } from "@/components/ui/button";
import { logoutAction } from "@/core/auth/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/75" dir="rtl">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-olive">ממשק ניהול</h1>
          <form action={logoutAction}>
            {/* <button type="submit" className="font-semibold bg-green-800 rounded text-white p-2 cursor-pointer hover:text-olive transition-colors">התנתק</button> */}
            <Button type="submit" variant="ghost" className="bg-gray-200 text-green-800 hover:cursor-pointer">
              התנתק
            </Button>
          </form>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

