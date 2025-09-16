'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/buy-products', label: 'קנה מוצרים' },
  { href: '/build-a-set', label: 'בנה סט' },
  { href: '/sets', label: 'סטים' },
  { href: '/login', label: 'כניסת מנהלים' },
];

export const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <header className="bg-green-700 text-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex items-center justify-between">

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  {/* Hamburger Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 sm:w-80 transition-transform duration-300 ease-out" dir="rtl">
                <SheetHeader>
                  <SheetTitle>ניווט</SheetTitle>
                  <SheetDescription>בחר יעד</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                      <Button variant="ghost" className="w-full justify-start text-lg text-olive hover:text-green-800"
                        onClick={() => setIsOpen(false)}>
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* App Logo and Title */}
          <Link href="/" className="flex mx-auto md:mx-0 items-center">
            <Image src="/images/app-logo.png" alt="App Logo" width={40} height={40} className="ml-2" style={{ borderRadius: '50%' }} />
            <h1 className="text-2xl font-bold">ארבעת המינים</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="ghost" className="text-white hover:text-green-800 hover:cursor-pointer ">
                  {link.label}
                </Button>
              </Link>
            ))}
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
