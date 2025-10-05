import './global.css';
import { BaseLayout } from '@/ui/layouts/BaseLayout';
import { AppProvider } from '@/core/state/AppProvider';
import { Alef } from 'next/font/google';
import { Toaster } from 'sonner';

const alef = Alef({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '700'],
});

export const metadata = {
  title: 'ארבעת המינים',
  description: 'מערכת הזמנות לארבעת המינים',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="favicon.ico" sizes="any" />
      </head>
      <body className={alef.className}>
        <AppProvider>
          <BaseLayout>{children}</BaseLayout>
          <Toaster position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
