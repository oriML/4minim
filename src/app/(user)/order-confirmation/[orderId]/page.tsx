'use client';

import React, { useState, useEffect } from 'react';
import { getOrderWithProducts } from '@/features/orders/actions';
import { UIOrder } from '@/core/types';
import { Stepper } from '@/ui/stepper/Stepper'; // Assuming a generic Stepper component

interface OrderDetailsPageProps {
  params: { orderId: string };
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ params }) => {
  const [order, setOrder] = useState<UIOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const fetchedOrder = await getOrderWithProducts(params.orderId);
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        setError('Failed to fetch order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return <div className="container mx-auto text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto text-center py-20 text-red-500">{error}</div>;
  }

  if (!order) {
    return null; // Or some other placeholder
  }

  // Define steps for the stepper UI
  const steps = [
    {
      title: 'פרטי הזמנה',
      content: <CustomerDetailsStep order={order} />,
    },
    {
      title: 'מוצרים',
      content: <ProductDetailsStep order={order} />,
    },
    {
      title: 'סיכום',
      content: <SummaryStep order={order} />,
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">פרטי הזמנה: {order.orderId}</h1>
      <Stepper steps={steps} />
    </div>
  );
};

// Step 1: Display Customer and Order Details
const CustomerDetailsStep: React.FC<{ order: UIOrder }> = ({ order }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <p><strong>שם הלקוח:</strong> {order.customerName}</p>
    <p><strong>תאריך הזמנה:</strong> {new Date(order.createdAt).toLocaleDateString('he-IL')}</p>
  </div>
);

// Step 2: Display Product Details
const ProductDetailsStep: React.FC<{ order: UIOrder }> = ({ order }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <ul className="space-y-4">
      {order.products.map((product) => (
        <li key={product.productId} className="flex items-center space-x-4">
          <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
          <div>
            <p className="font-bold">{product.name} (x{product.qty})</p>
            {/* Display dynamic properties */}
            {Object.entries(product).map(([key, value]) => {
              if (['productId', 'name', 'imageUrl', 'qty'].includes(key)) return null;
              return <p key={key} className="text-sm text-gray-600"><strong>{key}:</strong> {String(value)}</p>;
            })}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// Step 3: Summary Step
const SummaryStep: React.FC<{ order: UIOrder }> = ({ order }) => (
    <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-olive mb-4">הזמנה הושלמה</h2>
        <p className="text-gray-700">תודה רבה שהזמנתם מאיתנו!</p>
        <p className="text-gray-500 mt-4">אישור הזמנה יישלח אליך בקרוב במייל.</p>
    </div>
);


export default OrderDetailsPage;
