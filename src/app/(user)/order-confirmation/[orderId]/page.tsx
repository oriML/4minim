'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderWithProducts } from '@/features/orders/actions';
import { UIOrder } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Phone, MapPin, Calendar, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Step 1: Display Customer and Order Details
function CustomerDetailsStep({ order }: { order: UIOrder }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto text-right border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">פרטי לקוח והזמנה</h3>
      <div className="space-y-4 text-lg text-gray-700">
        <p className="flex items-center"><span className="ml-2 font-bold">שם הלקוח:</span> {order.customerName}</p>
        <p className="flex items-center"><Phone className="ml-2 h-5 w-5 text-gray-500" /> <span className="ml-2 font-bold">טלפון:</span> {order.customerPhone}</p>
        <p className="flex items-center"><MapPin className="ml-2 h-5 w-5 text-gray-500" /> <span className="ml-2 font-bold">אופן קבלת הזמנה:</span> {order.deliveryRequired ? 'משלוח' : 'איסוף עצמי'}</p>
        {order.deliveryRequired && <p className="flex items-center"><MapPin className="ml-2 h-5 w-5 text-gray-500" /> <span className="ml-2 font-bold">כתובת:</span> {order.customerAddress}</p>}
        <p className="flex items-center"><Calendar className="ml-2 h-5 w-5 text-gray-500" /> <span className="ml-2 font-bold">תאריך הזמנה:</span> {new Date(order.createdAt).toLocaleDateString('he-IL')}</p>
      </div>
    </div>
  );
}

// Step 2: Display Product Details
function ProductDetailsStep({ order }: { order: UIOrder }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto text-right border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">המוצרים שהוזמנו</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.products.map((product) => (
          <div key={product.productId} className="flex items-center justify-end bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
            <div className="flex-grow text-right ml-4">
              <p className="font-bold text-lg text-gray-800">{product.name}</p>
              <p className="text-gray-500 text-sm">כמות: <span className="font-bold">{product.qty}</span></p>
            </div>
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 3: Summary Step
function SummaryStep({ order, isCopied, handleCopyClick }: { order: UIOrder; isCopied: boolean; handleCopyClick: () => void }) {
  const sellerPhoneNumber = "972526983799"; // Should be from config
  const whatsappLink = `https://wa.me/${sellerPhoneNumber}`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-2xl mx-auto text-gray-800 border border-gray-100">
      <CheckCircle2 size={64} className="mx-auto mb-4 text-[#4a633e]" />
      <h2 className="text-4xl font-extrabold mb-4 text-gray-800">הזמנה הושלמה בהצלחה!</h2>
      <p className="text-lg text-gray-600 mb-6">תודה רבה שהזמנתם מאיתנו, חג שמח!</p>

      <div className="bg-[#e6ffe6] p-6 rounded-xl mb-6 shadow-inner">
        <p className="text-xl font-semibold mb-2 text-gray-700">סה"כ לתשלום:</p>
        <p className="text-5xl font-bold text-[#4a633e]">₪{order.totalPrice.toFixed(2)}</p>
      </div>

      <div className="text-lg text-gray-700 mb-6">
        <p><strong>אופן קבלת ההזמנה:</strong> {order.deliveryRequired ? 'משלוח' : 'איסוף עצמי'}</p>
        {order.deliveryRequired && <p><strong>כתובת:</strong> {order.customerAddress}</p>}
      </div>

      <p className="text-base text-gray-500 mb-6">
        אישור הזמנה ופרטים נוספים נשלחו אליך. לכל שאלה, ניתן לפנות אלינו ב-WhatsApp:
      </p>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-[#4a633e] text-white font-bold py-3 px-8 rounded-full hover:bg-[#3a532e] transition-all shadow-lg">
        שליחת הודעה ב-WhatsApp
      </a>

      <div className="mt-8 text-sm text-gray-500 border-t border-gray-200 pt-4">
        <span className="font-mono">מספר הזמנה: {order.orderId}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyClick}
          className="text-gray-500 hover:bg-gray-100 ml-2"
        >
          {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
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
    <TooltipProvider>
      <div className="min-h-screen bg-[#f9f9f9] rtl py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">סיכום הזמנה</h1>
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center">
              <span className="font-mono text-lg text-gray-600">מספר הזמנה: {order.orderId}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyClick}
                    className="text-gray-500 hover:bg-gray-100 hover:cursor-pointer ml-2"
                  >
                    {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>העתק כתובת אישור</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center justify-center mt-2 space-x-2 space-x-reverse">
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold
                  ${order.status === 'בוצעה' ? 'bg-green-100 text-green-800' : order.status === 'בוטלה' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                `}
              >
                {order.status}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-sm font-semibold
                  ${order.paymentStatus === 'שולם' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {isPaid ? (
            <SummaryStep order={order} isCopied={isCopied} handleCopyClick={handleCopyClick} />
          ) : (
            <div className="flex flex-col lg:flex-row-reverse lg:space-x-reverse lg:space-x-8 space-y-8 lg:space-y-0">
              <div className="lg:w-1/2 space-y-8">
                <CustomerDetailsStep order={order} />
                <ProductDetailsStep order={order} />
              </div>
              <div className="lg:w-1/2 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto text-center border border-gray-100">
                  <p className="text-xl font-semibold mb-2 text-gray-800">סה"כ לתשלום:</p>
                  <p className="text-5xl font-bold text-[#4a633e]">₪{order.totalPrice.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-center">
                  <span className="font-mono text-lg text-gray-600">מספר הזמנה: {order.orderId}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyClick}
                        className="text-gray-500 hover:bg-gray-100 hover:cursor-pointer ml-2"
                      >
                        {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>העתק כתובת אישור</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};


export default OrderDetailsPage;