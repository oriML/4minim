import './global.css';
import { BaseLayout } from '@/ui/layouts/BaseLayout';
import { AppProvider } from '@/core/state/AppProvider';

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
      <body>
        <AppProvider>
          <BaseLayout>{children}</BaseLayout>
        </AppProvider>
      </body>
    </html>
  );
}
