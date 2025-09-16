export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/75" dir="rtl">
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}