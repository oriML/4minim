'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CustomSet } from './CustomSetBuilder';
import { createCustomSetOrder } from '../actions';
import { getDeliveryFeeAction } from '@/features/orders/actions';
import { CustomerInfo, Product } from '@/core/types';

interface StepSummaryProps {
  set: CustomSet;
  setId?: string | null;
  currentTotalPrice: number;
  shopId: string; // Add shopId prop
}

export const StepSummary: React.FC<StepSummaryProps> = ({ set, setId, currentTotalPrice, shopId }) => {
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '', // Added email back
    address: '',
    notes: '',
    deliveryRequired: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  // State for validation errors
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null); // Added emailError
  const [addressError, setAddressError] = useState<string | null>(null);

  // Validation functions
  const validateFullName = (name: string) => {
    if (!name.trim()) return 'שם מלא נדרש.';
    return null;
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) return 'טלפון נדרש.';
    if (!/^[0-9]{9,10}$/.test(phone)) return 'מספר טלפון לא תקין (9 או 10 ספרות).';
    return null;
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return null; // Email is optional, so no error if empty
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return 'פורמט אימייל לא תקין.';
    return null;
  };

  const validateAddress = (address: string, deliveryRequired: boolean) => {
    if (deliveryRequired && !address.trim()) return 'כתובת למשלוח נדרשת.';
    return null;
  };

  useEffect(() => {
    const fetchFee = async () => {
      const fee = await getDeliveryFeeAction(shopId);
      setDeliveryFee(fee);
    };
    fetchFee();
  }, [shopId]);

  const selectedProducts = useMemo(() => {
    return Object.values(set).filter(p => p !== null) as Product[];
  }, [set]);

  const total = useMemo(() => {
    return customerInfo.deliveryRequired ? currentTotalPrice + deliveryFee : currentTotalPrice;
  }, [currentTotalPrice, customerInfo.deliveryRequired, deliveryFee]);

  const handleConfirmOrder = async () => {
    // Trigger all validations before submission
    const nameErr = validateFullName(customerInfo.fullName);
    const phoneErr = validatePhone(customerInfo.phone);
    const emailErr = validateEmail(customerInfo.email); 
    const addressErr = validateAddress(customerInfo.address, customerInfo.deliveryRequired);

    setFullNameError(nameErr);
    setPhoneError(phoneErr);
    setEmailError(emailErr); 
    setAddressError(addressErr);

    if (nameErr || phoneErr || emailErr || addressErr) { 
      return; // Prevent submission if there are errors
    }

    setIsSubmitting(true);
    const response = await createCustomSetOrder(shopId, set, customerInfo, setId, total);
    setIsSubmitting(false);

    if (response.success) {
      toast.success(response.message);
      if (response.data?.orderId && response.data?.shopSlug) {
        router.push(`/${response.data.shopSlug}/order-confirmation/${response.data.orderId}`);
      }
    } else {
      toast.error(response.error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-3xl font-extrabold text-center mb-8 text-brand-dark">סיכום הזמנה</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          {customerInfo.deliveryRequired && (
            <div className="border-t-2 border-dashed border-brand-brown pt-4 flex justify-between items-center font-medium text-brand-dark">
              <span>דמי משלוח:</span>
              <span>₪{deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-dashed border-brand-brown pt-4 flex justify-between items-center font-bold text-2xl text-brand-dark">
            <span>סה"כ:</span>
            <span>₪{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Right side: Customer Form */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-2xl font-bold text-brand-dark mb-4">פרטי הזמנה</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"> {/* Wrapper div for full name input and error */}
              <input type="text" placeholder="שם מלא*" value={customerInfo.fullName}
                onChange={(e) => {
                  setCustomerInfo({ ...customerInfo, fullName: e.target.value });
                  setFullNameError(validateFullName(e.target.value));
                }}
                className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-right ${fullNameError ? 'border-red-500' : 'border-brand-brown'}`}
                required
              />
              {fullNameError && <p className="text-red-500 text-sm mt-1 text-right">{fullNameError}</p>}
            </div>
            <div className="sm:col-span-2"> {/* Wrapper div for email input and error */}
              <input type="email" placeholder="אימייל (לקבלת עדכונים)" value={customerInfo.email}
                onChange={(e) => {
                  setCustomerInfo({ ...customerInfo, email: e.target.value });
                  setEmailError(validateEmail(e.target.value));
                }}
                className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-right ${emailError ? 'border-red-500' : 'border-brand-brown'}`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1 text-right">{emailError}</p>}
            </div>
            <div> {/* Wrapper div for phone input and error */}
              <input type="tel" placeholder="טלפון*" value={customerInfo.phone}
                onChange={(e) => {
                  setCustomerInfo({ ...customerInfo, phone: e.target.value });
                  setPhoneError(validatePhone(e.target.value));
                }}
                className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-right ${phoneError ? 'border-red-500' : 'border-brand-brown'}`}
                required pattern="[0-9]{9,10}" dir="rtl"
              />
              {phoneError && <p className="text-red-500 text-sm mt-1 text-right">{phoneError}</p>}
            </div>
            <div> {/* Wrapper div for address input and error */}
              <input type="text" placeholder="כתובת למשלוח" value={customerInfo.address}
                onChange={(e) => {
                  setCustomerInfo({ ...customerInfo, address: e.target.value });
                  setAddressError(validateAddress(customerInfo.address, customerInfo.deliveryRequired));
                }}
                className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition text-right ${addressError ? 'border-red-500' : 'border-brand-brown'}`}
                required={customerInfo.deliveryRequired}
              />
              {addressError && <p className="text-red-500 text-sm mt-1 text-right">{addressError}</p>}
            </div>
            <textarea placeholder="הערות (אופציונלי)" value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
              className="w-full p-3 border-2 border-brand-brown rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition sm:col-span-2 text-right" rows={3}>
            </textarea>
          </div>
          <div className="mt-4 flex items-center">
            <input id="delivery-checkbox" type="checkbox" checked={customerInfo.deliveryRequired}
              onChange={(e) => {
                setCustomerInfo({ ...customerInfo, deliveryRequired: e.target.checked });
                // Re-validate address if deliveryRequired changes
                setAddressError(validateAddress(customerInfo.address, e.target.checked));
              }}
              className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
            />
            <label htmlFor="delivery-checkbox" className="mr-2 text-sm font-medium text-gray-900">
              דרוש משלוח {deliveryFee > 0 && `(תוספת ${deliveryFee}₪)`}
            </label>
          </div>
          <div className="text-center mt-6">
            <button onClick={handleConfirmOrder}
              disabled={isSubmitting || !!fullNameError || !!phoneError || !!emailError || !!addressError || selectedProducts.length === 0}
              className="w-full px-4 py-3 rounded-lg bg-green-800 cursor-pointer text-white font-bold uppercase tracking-wider transform transition-transform duration-200 hover:bg-brand-gold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:bg-gray-400 disabled:scale-100">
              {isSubmitting ? 'שולח הזמנה...' : 'אשר הזמנה'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};