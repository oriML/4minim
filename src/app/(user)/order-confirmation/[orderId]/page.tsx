'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getOrderWithProducts, updateOrderDeliveryRequired } from '@/features/orders/actions';
import { UIOrder } from '@/core/types';
import { Button } from '@/components/ui/button';

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
function SummaryStep({ order }: { order: UIOrder }) {
  return (
    <div className="bg-gradient-to-br from-brand-leaf to-brand-dark p-10 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto text-green-900">
      {/* <CheckCircle2 size={64} className="mx-auto mb-4 text-brand-gold" /> */}
      <h2 className="text-4xl font-extrabold mb-4">הזמנה הושלמה בהצלחה!</h2>
      <p className="text-lg opacity-90">תודה רבה שהזמנתם מאיתנו, חג שמח!</p>
      <p className="text-base opacity-80 mt-6">אישור הזמנה ופרטים נוספים נשלחו אליך.</p>
      <div className="mt-8 font-mono bg-black/20 rounded-lg px-4 py-2 inline-block">
        מספר הזמנה: {order.orderId}
      </div>
    </div>
  );
}


const OrderDetailsPage: React.FC = () => {
  const params = useParams<{ orderId: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  const [order, setOrder] = useState<UIOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentOptionsModal, setShowPaymentOptionsModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [deliveryRequired, setDeliveryRequired] = useState(false); // New state
  const [customerAddress, setCustomerAddress] = useState(''); // New state for address
  const [addressError, setAddressError] = useState<string | null>(null); // New state for address error

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const fetchedOrder = await getOrderWithProducts(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
        setIsPaid(fetchedOrder.paymentStatus === 'שולם');
        setDeliveryRequired(fetchedOrder.deliveryRequired); // Initialize deliveryRequired
        // Assuming customerAddress is part of UIOrder or fetched separately
        // For now, let's assume UIOrder has customerAddress
        setCustomerAddress(fetchedOrder.customerAddress || ''); // Initialize customerAddress
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

  const handleDeliveryToggle = useCallback(async (checked: boolean) => {
    setDeliveryRequired(checked);
    if (orderId) {
      const updatedOrder = await updateOrderDeliveryRequired(orderId, checked);
      if (updatedOrder) {
        setOrder(updatedOrder);
      } else {
        console.error('Failed to update deliveryRequired status in DB.');
      }
    }
  }, [orderId]);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerAddress(e.target.value);
    if (addressError) setAddressError(null); // Clear error on change
  }, [addressError]);

  const handleProceedToPayment = () => {
    if (deliveryRequired && !customerAddress.trim()) {
      setAddressError('כתובת למשלוח נדרשת.');
      return;
    }
    setShowPaymentOptionsModal(true);
  };

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
        <h1 className="text-4xl font-extrabold text-center text-brand-dark mb-10">אישור הזמנה</h1>

        {isPaid ? (
          <SummaryStep order={order} />
        ) : (
          <>
            <CustomerDetailsStep order={order} />
            <ProductDetailsStep order={order} />

            <div className="bg-brand-cream p-8 rounded-2xl border-2 border-brand-brown max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-brand-dark mb-6">סה"כ לתשלום: ₪{order.totalPrice.toFixed(2)}</h3>

              {/* Delivery Required Toggle */}
              <div className="flex items-center justify-center mb-4">
                <label htmlFor="delivery-toggle" className="ml-3 text-lg font-semibold text-brand-dark cursor-pointer">
                  דרוש משלוח
                </label>
                <input
                  type="checkbox"
                  id="delivery-toggle"
                  checked={deliveryRequired}
                  onChange={(e) => handleDeliveryToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-leaf"></div>
              </div>

              {/* Address Input Field */}
              {deliveryRequired && (
                <div className="mb-4 text-right">
                  <label htmlFor="customer-address" className="block text-lg font-semibold text-brand-dark mb-2">
                    כתובת למשלוח:
                  </label>
                  <input
                    type="text"
                    id="customer-address"
                    value={customerAddress}
                    onChange={handleAddressChange}
                    className={`w-full p-3 border rounded-lg text-right ${addressError ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="הכנס כתובת למשלוח"
                  />
                  {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
                </div>
              )}

              <Button
                className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-full py-3 text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                onClick={handleProceedToPayment}
              >
                מעבר לתשלום
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};


export default OrderDetailsPage;