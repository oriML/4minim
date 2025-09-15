import React, { useMemo } from 'react';
import { CustomSet } from './CustomSetBuilder';
import { submitOrder } from '../actions';
import { useRouter } from 'next/navigation';

interface StepSummaryProps {
  set: CustomSet;
}

export const StepSummary: React.FC<StepSummaryProps> = ({ set }) => {
  const router = useRouter();

  const selectedProducts = useMemo(() => {
    return Object.values(set).filter(p => p !== null) as any[];
  }, [set]);

  const total = useMemo(() => {
    return selectedProducts.reduce((acc, product) => acc + product.price, 0);
  }, [selectedProducts]);

  const handleFormSubmit = async (formData: FormData) => {
    const customerName = formData.get('name') as string;
    const customerEmail = formData.get('email') as string;

    if (!customerName || !customerEmail || selectedProducts.length === 0) {
      alert('Please fill out all fields and select at least one product.');
      return;
    }

    try {
      const newOrder = await submitOrder({ 
        customerName, 
        customerEmail, 
        products: selectedProducts, 
        total 
      });
      router.push(`/order-confirmation/${newOrder.id}`);
    } catch (error) {
      console.error(error);
      alert('There was an error submitting your order. Please try again.');
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold text-center mb-6">5. סיכום הזמנה</h3>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {selectedProducts.length > 0 ? (
          <ul className="divide-y divide-gray-200 mb-6">
            {selectedProducts.map(product => (
              <li key={product.id} className="py-3 flex justify-between items-center">
                <span className="text-gray-800">{product.name}</span>
                <span className="font-semibold text-gray-600">₪{product.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mb-6">לא נבחרו מוצרים..</p>
        )}
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-bold text-xl text-olive">
          <span>סה"כ</span>
          <span>₪{total.toFixed(2)}</span>
        </div>
      </div>

      <form action={handleFormSubmit} className="mt-8">
        <h4 className="text-xl font-semibold mb-4">פרטי המזמין</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">שם מלא</label>
            <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">כתובת אימייל</label>
            <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-olive focus:border-olive" />
          </div>
        </div>
        <div className="text-center mt-8">
          <button type="submit" className="w-full md:w-auto bg-green-700 text-white font-bold py-3 px-12 rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
            disabled={selectedProducts.length === 0}
          >
            אישור הזמנה
          </button>
        </div>
      </form>
    </div>
  );
};
