import { Shop } from '@/core/types';
import Link from 'next/link';

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/${shop.slug}/sets`}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <img src={shop.imageUrl} alt={shop.name} className="w-full h-48 object-cover rounded-t-lg" />
        <div className="p-4">
          <h3 className="text-lg font-bold">{shop.name}</h3>
          <p className="text-gray-600">{shop.description}</p>
        </div>
      </div>
    </Link>
  );
}
