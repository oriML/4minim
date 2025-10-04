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
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

