import { googleSheetService } from '@/services/google-sheets';
import { ShopCard } from '@/features/shop/components/ShopCard';

export default async function HomePage() {
  const shops = await googleSheetService.getShops();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">חנויות</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
}
