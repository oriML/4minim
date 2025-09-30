'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderWithProducts } from '@/features/orders/actions';
import { UIOrder } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';

// Step 1: Display Customer and Order Details
function CustomerDetailsStep({ order }: { order: UIOrder }) {
  return (
    <div className="bg-brand-cream p-8 rounded-2xl border-2 border-brand-brown max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-brand-dark mb-4">פרטי לקוח</h3>
      <div className="space-y-3 text-lg">
        <p><strong>שם הלקוח:</strong> {order.customerName}</p>
        <p><strong>טלפון:</strong> {order.customerPhone}</p>
        <p><strong>אופן קבלת הזמנה:</strong> {order.deliveryRequired ? 'משלוח' : 'איסוף עצמי'}</p>
        {order.deliveryRequired && <p><strong>כתובת:</strong> {order.customerAddress}</p>}
        <p><strong>תאריך הזמנה:</strong> {new Date(order.createdAt).toLocaleDateString('he-IL')}</p>
        <p><strong>סטטוס הזמנה:</strong> {order.status}</p>
        <p><strong>סטטוס תשלום:</strong> {order.paymentStatus}</p>
      </div>
    </div>
  );
}

// Step 2: Display Product Details
function ProductDetailsStep({ order }: { order: UIOrder }) {
  return (
    <div className="bg-brand-cream p-8 rounded-2xl border-2 border-brand-brown max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-brand-dark mb-6">המוצרים שהוזמנו</h3>
      <ul className="space-y-4">
        {order.products.map((product) => (
          <li key={product.productId} className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-soft border border-brand-brown/50">
            <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
            <div className="flex-grow">
              <p className="font-bold text-lg text-brand-dark">{product.name}</p>
              <p className="text-gray-600">כמות: <span className="font-bold">{product.qty}</span></p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Step 3: Summary Step
function SummaryStep({ order, isCopied, handleCopyClick }: { order: UIOrder; isCopied: boolean; handleCopyClick: () => void }) {
  const sellerPhoneNumber = "972526983799"; // Should be from config
  const whatsappLink = `https://wa.me/${sellerPhoneNumber}`;

  return (
    <div className="bg-green-800 p-10 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto text-white">
      {/* <CheckCircle2 size={64} className="mx-auto mb-4 text-brand-gold" /> */}
      <h2 className="text-4xl font-extrabold mb-4">הזמנה הושלמה בהצלחה!</h2>
      <p className="text-lg opacity-90">תודה רבה שהזמנתם מאיתנו, חג שמח!</p>
      
      <div className="mt-8 font-mono bg-black/20 rounded-lg px-4 py-2 inline-flex items-center space-x-2">
        <span>מספר הזמנה: {order.orderId}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyClick}
          className="text-white hover:bg-white/20"
        >
          {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-6 text-lg">
        <p><strong>אופן קבלת ההזמנה:</strong> {order.deliveryRequired ? 'משלוח' : 'איסוף עצמי'}</p>
        {order.deliveryRequired && <p><strong>כתובת:</strong> {order.customerAddress}</p>}
      </div>

      <p className="text-base opacity-80 mt-6">
        אישור הזמנה ופרטים נוספים נשלחו אליך. לכל שאלה, ניתן לפנות אלינו ב-WhatsApp:
      </p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-brand-gold text-brand-dark font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all">
        שליחת הודעה ב-WhatsApp
      </a>
    </div>
  );
}


const OrderDetailsPage: React.FC = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const router = useRouter();

  const [order, setOrder] = useState<UIOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = useCallback(() => {
    if (orderId) {
      const url = `${window.location.origin}/order-confirmation/${orderId}`;
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  }, [orderId]);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const fetchedOrder = await getOrderWithProducts(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
        setIsPaid(fetchedOrder.paymentStatus === 'שולם');
      } else {
        setError('Order not found.');
      }
    } catch (err) {
      setError('Failed to fetch order details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-brand-cream">
        <p className="text-2xl font-bold text-brand-dark">טוען פרטי הזמנה...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-brand-cream">
        <p className="text-2xl font-bold text-red-600">שגיאה: {error}</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-cream py-12 px-4 sm:px-6 lg:px-8 rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* <h1 className="text-4xl font-extrabold text-center text-brand-dark mb-10">אישור הזמנה</h1> */}

        {isPaid ? (
          <SummaryStep order={order} isCopied={isCopied} handleCopyClick={handleCopyClick} />
        ) : (
          <>
            <CustomerDetailsStep order={order} />
            <ProductDetailsStep order={order} />

            <div className="bg-brand-cream p-8 rounded-2xl border-2 border-brand-brown max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-6">סה"כ לתשלום: ₪{order.totalPrice.toFixed(2)}</h3>
              <div className="mt-4 font-mono bg-black/10 rounded-lg px-4 py-2 inline-flex items-center space-x-2">
                <span>מספר הזמנה: {order.orderId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyClick}
                  className="text-brand-dark hover:bg-black/10"
                >
                  {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default OrderDetailsPage;