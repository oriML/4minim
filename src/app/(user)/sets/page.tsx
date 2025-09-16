'use client';

import { SetCard } from '@/ui/components/SetCard';
import { useRouter } from 'next/navigation';

const sets = [
  {
    name: 'סט ילדים',
    description: 'סט פשוט מותאם לילדים שאינם חייבים במצוות',
    price: 25,
    imageUrl: 'https://res.cloudinary.com/dxoajioji/image/upload/v1758020403/android-chrome-192x192_de2rxy.png',
  },
  {
    name: 'סט כשר רגיל',
    description: 'סט כשר לצאת בו ידי חובה.',
    price: 50,
    imageUrl: 'https://res.cloudinary.com/dxoajioji/image/upload/v1758020403/Google_AI_Studio_2025-09-15T10_57_49.978Z_q8c6qm.png',
  },
  {
    name: 'סט מהודר',
    description: 'סט יפהפה, איכותי ומהודר במיוחד.',
    price: 100,
    imageUrl: 'https://res.cloudinary.com/dxoajioji/image/upload/v1758020403/Google_AI_Studio_2025-09-15T10_57_49.978Z_q8c6qm.png',
  },
];

export default function SetsPage() {
  const router = useRouter();

  const handleSelectSet = (setName: string) => {
    // For now, just log and redirect to a placeholder summary page
    console.log(`Selected set: ${setName}`);
    // In a real app, you would pass this data to the checkout/summary page
    router.push('/custom'); // Re-using custom flow for summary for now
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-olive">בחר את הסט המושלם שלך</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sets.map((set) => (
          <SetCard 
            key={set.name} 
            {...set} 
            onSelect={() => handleSelectSet(set.name)} 
          />
        ))}
      </div>
    </div>
  );
}
