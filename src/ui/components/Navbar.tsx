'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { logoutAction } from '@/core/auth/actions';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const adminNavLinks = [
  { href: '/admin/dashboard/summary', label: 'סיכום' },
  { href: '/admin/dashboard/orders', label: 'הזמנות' },
  { href: '/admin/dashboard/products', label: 'מוצרים' },
  { href: '/admin/dashboard/sets', label: 'סטים' },
];

const NavLinks = ({ shopSlug, isAdminPath, pathname, onLinkClick }: { shopSlug: string | null, isAdminPath: boolean, pathname: string, onLinkClick?: () => void }) => {
  const linkClass = "text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium";
  const mobileLinkClass = "block py-2 text-lg text-right";

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  if (isAdminPath) {
    if (pathname.includes("login")) return null;

    // Mobile Sidebar for Admin
    if (onLinkClick) {
      return (
        <>
          {adminNavLinks.map(link => (
            <Link key={link.href} href={link.href} className={`${linkClass} ${mobileLinkClass}`} onClick={handleLinkClick}>
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t mt-4">
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="bg-red-500 hover:bg-red-700 text-white hover:text-white px-3 py-2 rounded-md text-sm font-medium w-full">
                התנתק
              </Button>
            </form>
          </div>
        </>
      );
    }

    // Desktop Navbar for Admin (just logout)
    return (
      <form action={logoutAction}>
        <Button type="submit" variant="ghost" className="bg-red-500 hover:bg-red-700 text-white hover:text-white px-3 py-2 rounded-md text-sm font-medium ml-4 hover:cursor-pointer">
          התנתק
        </Button>
      </form>
    );
  }

  if (shopSlug) {
    return (
      <>
        <Link href={`/${shopSlug}/sets`} className={`${linkClass} ${onLinkClick ? mobileLinkClass : ''}`} onClick={handleLinkClick}>סטים</Link>
        <Link href={`/${shopSlug}/products`} className={`${linkClass} ${onLinkClick ? mobileLinkClass : ''}`} onClick={handleLinkClick}>מוצרים</Link>
        <Link href={`/${shopSlug}/build-a-set`} className={`${linkClass} ${onLinkClick ? mobileLinkClass : ''}`} onClick={handleLinkClick}>סט בהרכבה אישית</Link>
        <Link href="/" className={`bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium ml-4 ${onLinkClick ? 'mt-4 w-full' : ''}`} onClick={handleLinkClick}>יציאה מהחנות</Link>
      </>
    );
  }

  return (
    <Link href="/admin/login" className={`${linkClass} ${onLinkClick ? mobileLinkClass : ''}`} onClick={handleLinkClick}>כניסת מנהלים</Link>
  );
};


export function Navbar() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const shopIdMatch = pathname.match(/^\/([^/]+)/);
  const shopSlug = shopIdMatch ? shopIdMatch[1] : null;
  const [shopName, setShopName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShopName() {
      if (shopSlug && !isAdminPath) {
        try {
          const response = await fetch(`/api/shop/${shopSlug}`);
          if (response.ok) {
            const shop = await response.json();
            setShopName(shop.name);
          } else {
            setShopName(null);
          }
        } catch (error) {
          setShopName(null);
        }
      } else if (isAdminPath) {
        try {
          const response = await fetch('/api/admin/shop');
          if (response.ok) {
            const shop = await response.json();
            setShopName(shop.name);
          } else {
            setShopName('פאנל ניהול');
          }
        } catch (error) {
          setShopName('פאנל ניהול');
        }
      } else {
        setShopName(null);
      }
    }
    fetchShopName();
  }, [shopSlug, isAdminPath]);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-row-reverse md:flex-row justify-between items-center py-4">
          <div className="flex items-center mx-auto md:mx-0">
            <Link href="/">
              <h1 className="text-2xl font-bold">{shopName || "בחירת חנות"}</h1>
            </Link>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center">
            <NavLinks shopSlug={shopSlug} isAdminPath={isAdminPath} pathname={pathname} />
          </div>

          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-right">{shopName || "תפריט"}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <NavLinks shopSlug={shopSlug} isAdminPath={isAdminPath} pathname={pathname} onLinkClick={() => setIsSheetOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
}