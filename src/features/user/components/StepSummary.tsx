'use client';

import React, { useMemo, useState } from 'react';
import { CustomSet } from './CustomSetBuilder';
import { createCustomSetOrder } from '../actions'; // We will create this action
import { CustomerInfo, Product } from '@/core/types';

interface StepSummaryProps {
  set: CustomSet;
}

export const StepSummary: React.FC<StepSummaryProps> = ({ set }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProducts = useMemo(() => {
    return Object.values(set).filter(p => p !== null) as Product[];
  }, [set]);

  const total = useMemo(() => {
    return selectedProducts.reduce((acc, product) => acc + product.price, 0);
  }, [selectedProducts]);

  const handleConfirmOrder = async () => {
    if (!customerInfo.fullName || !customerInfo.phone) {
      alert('אנא מלאו שם מלא וטלפון.');
      return;
    }
    if (selectedProducts.length === 0) {
      alert('לא נבחרו מוצרים.');
      return;
    }

    setIsSubmitting(true);
    // The server action will handle success (redirect) or throw an error.
    // The try/catch is removed to allow the redirect to work correctly.
    await createCustomSetOrder(set, customerInfo);
    // No need to set isSubmitting to false here, as the page will redirect.
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-3xl font-extrabold text-center mb-8 text-brand-dark">סיכום הזמנה</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side: Order Summary */}
        <div className="bg-brand-cream p-6 rounded-2xl border-2 border-brand-brown">
          {selectedProducts.length > 0 ? (
            <ul className="divide-y divide-brand-brown/50 mb-6">
              {selectedProducts.map(product => (
                <li key={product.id} className="py-4 flex justify-between items-center">
                  <span className="text-gray-800 font-medium">{product.productName_HE}</span>
                  <span className="font-bold text-brand-dark">₪{product.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mb-6">לא נבחרו מוצרים.</p>
          )}
          <div className="border-t-2 border-dashed border-brand-brown pt-4 flex justify-between items-center font-bold text-2xl text-brand-dark">
            <span>סה"כ:</span>
            <span>₪{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Right side: Customer Form */}
        <div className="w-full">
          <h4 className="text-2xl font-bold text-brand-dark mb-4">פרטי הזמנה</h4>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="שם מלא*" value={customerInfo.fullName} onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
            <input type="tel" placeholder="טלפון*" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
            <input type="text" placeholder="כתובת למשלוח" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" />
            <textarea placeholder="הערות (אופציונלי)" value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition" rows={3}></textarea>
          </div>
          <div className="text-center mt-6">
            <button onClick={handleConfirmOrder} disabled={isSubmitting || selectedProducts.length === 0} className="w-full px-4 py-3 rounded-lg bg-green-800 cursor-pointer text-white font-bold uppercase tracking-wider transform transition-transform duration-200 hover:bg-brand-gold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:bg-gray-400 disabled:scale-100">
              {isSubmitting ? 'שולח הזמנה...' : 'אשר הזמנה'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};