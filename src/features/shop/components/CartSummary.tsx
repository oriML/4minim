'use client';

import * as React from 'react';
import { Cart, Product, CustomerInfo } from '@/core/types';
import { useState, useEffect } from 'react';
import { ChevronUp, X } from 'lucide-react';

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
    email: '', // This will be removed from the form but kept in the state for now
    address: '',
    notes: '', // Added notes field
    deliveryRequired: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [productId, item]) => {
    const product = products.find((p) => p.id === productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

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
    if (!customerInfo.fullName || !customerInfo.phone) { // Simplified validation
      alert('אנא מלאו שם מלא וטלפון.');
      return;
    }
    if (totalItems === 0) {
      alert('העגלה שלך ריקה.');
      return;
    }
    setIsSubmitting(true);
    // The server action will handle success (redirect) or throw an error.
    // The try/catch is removed to allow the redirect to work correctly.
    await createOrderAction(cart, customerInfo);
    // No need to set isSubmitting to false here, as the page will redirect.
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;
      setIsAtBottom(isScrolledToBottom);
      if (isScrolledToBottom) {
        setIsExpanded(true);
      }
    };
    const debouncedScroll = debounce(handleScroll, 50);
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  if (totalItems === 0 && isAtBottom) {
      return null; // Hide component if cart is empty and user is at the bottom
  }

  const FormComponent = (
    <div className="w-full md:w-1/2 lg:w-1/3 md:pl-8">
      <h4 className="text-xl font-bold text-brand-dark mb-4">פרטי הזמנה</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="שם מלא*" value={customerInfo.fullName} onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
        <input type="tel" placeholder="טלפון*" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
        <input type="text" placeholder="כתובת למשלוח" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition sm:col-span-2" />
        <textarea placeholder="הערות (אופציונלי)" value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition sm:col-span-2" rows={3}></textarea>
      </div>
      <div className="mt-4 flex items-center">
        <input
          id="delivery-checkbox-cart"
          type="checkbox"
          checked={customerInfo.deliveryRequired}
          onChange={(e) => setCustomerInfo({ ...customerInfo, deliveryRequired: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
        />
        <label htmlFor="delivery-checkbox-cart" className="mr-2 text-sm font-medium text-gray-900">
          דרוש משלוח
        </label>
      </div>
      <button onClick={handleConfirmOrder} disabled={isSubmitting} className="w-full mt-4 px-4 py-3 rounded-lg bg-brand-dark text-white font-bold uppercase tracking-wider transform transition-transform duration-200 hover:bg-brand-gold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:bg-gray-400 disabled:scale-100">
        {isSubmitting ? 'שולח הזמנה...' : 'אשר והמשך לתשלום'}
      </button>
    </div>
  );

  // Mobile Collapsed Bar
  if (!isExpanded && !isAtBottom) {
    return (
      <div onClick={() => setIsExpanded(true)} className="fixed bottom-0 left-0 right-0 bg-brand-dark text-white p-4 shadow-2xl cursor-pointer animate-slide-up md:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChevronUp size={20} />
            <h3 className="font-semibold">הצג סיכום הזמנה</h3>
          </div>
          <p className="font-bold">{totalItems} פריטים | ₪{totalPrice.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  // Expanded view (Mobile and Desktop)
  return (
    <div className={`w-full transition-all duration-300 ${isAtBottom ? 'bg-transparent' : 'fixed inset-0 bg-black bg-opacity-50 z-50'} md:relative md:bg-transparent md:inset-auto`} onClick={() => setIsExpanded(false)}>
        <div className={`p-6 md:p-8 mt-20 md:mt-0 rounded-t-2xl md:rounded-2xl border-t-4 border-brand-gold bg-brand-cream shadow-2xl ${isAtBottom ? '' : 'fixed bottom-0 left-0 right-0'} md:relative md:border-2 md:border-brand-brown`} onClick={(e) => e.stopPropagation()}>
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-brand-dark">סיכום הזמנה</h2>
                    <button onClick={() => setIsExpanded(false)} className="md:hidden p-2 rounded-full hover:bg-gray-200">
                        <X size={24} className="text-brand-dark" />
                    </button>
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
                            <p className="text-gray-500">העגלה שלך ריקה.</p>
                        )}
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-brand-brown">
                            <div className="flex justify-between items-center text-xl font-bold text-brand-dark">
                                <span>סה"כ לתשלום:</span>
                                <span>₪{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {FormComponent}
                </div>
            </div>
        </div>
    </div>
  );
}
