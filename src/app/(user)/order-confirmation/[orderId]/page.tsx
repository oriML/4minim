import React from 'react';

interface OrderConfirmationPageProps {
  params: { orderId: string };
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ params }) => {
  return (
    <div className="container mx-auto text-center py-20">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-olive mb-4">Thank You!</h1>
        <p className="text-gray-600 text-lg mb-2">Your order has been successfully placed.</p>
        <p className="text-gray-800 mb-6">מספר ההזמנה שלך הוא:</p>
        <div className="bg-gray-100 text-olive text-2xl font-mono p-4 rounded-md inline-block">
          {params.orderId}
        </div>
        <p className="text-gray-500 mt-8">אישור הזמנה יישלח אליך בקרוב במייל.</p>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
