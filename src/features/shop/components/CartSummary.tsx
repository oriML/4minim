'use client';

import * as React from 'react';
import { Cart, Product, CustomerInfo } from '@/core/types';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { getDeliveryFeeAction } from '@/features/orders/actions';

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

interface CartSummaryProps {
  cart: Cart;
  products: Product[];
  createOrderAction: (cart: Cart, customerInfo: CustomerInfo) => Promise<void>;
}

export function CartSummary({ cart, products, createOrderAction }: CartSummaryProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    deliveryRequired: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFee = async () => {
      const fee = await getDeliveryFeeAction();
      setDeliveryFee(fee);
    };
    fetchFee();
  }, []);

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  
  const productsTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [productId, item]) => {
      const product = products.find((p) => p.id === productId);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
  }, [cart, products]);

  const totalPrice = useMemo(() => {
    return customerInfo.deliveryRequired ? productsTotal + deliveryFee : productsTotal;
  }, [productsTotal, customerInfo.deliveryRequired, deliveryFee]);

  const selectedProducts = Object.entries(cart)
    .filter(([, item]) => item.qty > 0)
    .map(([productId, item]) => {
      const product = products.find((p) => p.id === productId);
      return {
        name: product?.productName_HE || 'Unknown Product',
        qty: item.qty,
        subtotal: product ? product.price * item.qty : 0,
      };
    });

  const handleConfirmOrder = async () => {
    if (!customerInfo.fullName || !customerInfo.phone) {
      alert('אנא מלאו שם מלא וטלפון.');
      return;
    }
    if (customerInfo.deliveryRequired && !customerInfo.address) {
      alert('אנא מלאו כתובת למשלוח.');
      return;
    }
    if (totalItems === 0) {
      alert('העגלה שלך ריקה.');
      return;
    }
    setIsSubmitting(true);
    await createOrderAction(cart, customerInfo);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 250; // Adjusted threshold
      setIsAtBottom(isScrolledToBottom);
    };
    const debouncedScroll = debounce(handleScroll, 50);
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  const handleScrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (totalItems === 0) {
    return null; // Never show if cart is empty
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isAtBottom && (
        <div 
          onClick={handleScrollToSummary} 
          className="fixed bottom-8 right-8 bg-green-800 text-white p-4 rounded-full shadow-2xl cursor-pointer flex items-center gap-3 animate-fade-in-up z-40"
        >
          <ShoppingCart size={24} />
          <div className="flex flex-col items-start">
            <span className="font-semibold">{totalItems} פריטים</span>
            <span className="font-bold">₪{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Static Summary Form */}
      <div ref={summaryRef} id="cart-summary" className="w-full p-6 md:p-8 mt-12 rounded-2xl border-2 border-brand-brown bg-brand-cream shadow-xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-brand-dark">סיכום הזמנה</h2>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 lg:w-2/3 md:pr-8">
              <h4 className="text-xl font-bold text-brand-dark mb-4">הפריטים שלך</h4>
              {selectedProducts.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-4">
                  {selectedProducts.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-gray-800">
                      <span>{item.name} <span className="text-gray-500">x{item.qty}</span></span>
                      <span className="font-semibold">₪{item.subtotal.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 bg-green-800">העגלה שלך ריקה.</p>
              )}
              {customerInfo.deliveryRequired && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-brand-brown flex justify-between items-center font-medium text-brand-dark">
                  <span>דמי משלוח:</span>
                  <span>₪{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="mt-4 pt-4 border-t-2 border-dashed border-brand-brown">
                <div className="flex justify-between items-center text-xl font-bold text-brand-dark">
                  <span>סה"כ לתשלום:</span>
                  <span>₪{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 md:pl-8 mt-8 md:mt-0">
              <h4 className="text-xl font-bold text-brand-dark mb-4">פרטי הזמנה</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="שם מלא*" value={customerInfo.fullName} onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
                <input type="tel" placeholder="טלפון*" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
                <input type="text" placeholder="כתובת למשלוח" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition sm:col-span-2" />
                <textarea placeholder="הערות (אופציונלי)" value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition sm:col-span-2" rows={3}></textarea>
              </div>
              <div className="mt-4 flex items-center">
                <input id="delivery-checkbox-cart" type="checkbox" checked={customerInfo.deliveryRequired} onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryRequired: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold" />
                <label htmlFor="delivery-checkbox-cart" className="mr-2 text-sm font-medium text-gray-900">
                  דרוש משלוח {deliveryFee > 0 && `(תוספת ${deliveryFee}₪)`}
                </label>
              </div>
              <button onClick={handleConfirmOrder} disabled={isSubmitting} className="w-full mt-4 px-4 py-3 rounded-lg bg-green-800 text-white font-bold uppercase tracking-wider transform transition-transform duration-200 hover:bg-brand-gold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:bg-gray-400 disabled:scale-100">
                {isSubmitting ? 'שולח הזמנה...' : 'אשר והמשך לתשלום'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

