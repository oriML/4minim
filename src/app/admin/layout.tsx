"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/core/auth/actions";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname.includes("login");

  return (
    <div className="min-h-screen bg-gray-50/75" dir="rtl">
      {!isLoginPage && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-olive">ממשק ניהול</h1>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="bg-gray-200 text-green-800 hover:cursor-pointer">
                התנתק
              </Button>
            </form>
          </div>
        </header>
      )}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

