'use client';

import { SetCard } from '@/ui/components/SetCard';
import { useRouter } from 'next/navigation';

const sets = [
  {
    name: 'סט ילדים',
    description: 'A simple and easy-to-handle set, perfect for children.',
    price: 25,
  },
  {
    name: 'Kosher Set',
    description: 'סט כשר ומהודר לשימוש יומיומי.',
    price: 50,
  },
  {
    name: 'סט מהודר',
    description: 'סט יפהפה ואיכותי במיוחד לבעלי טעם.',
    price: 100,
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
