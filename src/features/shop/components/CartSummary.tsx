'use client';

import * as React from 'react';
import { Cart, Product, CustomerInfo } from '@/core/types';
import { Button } from '@/components/ui/button';
import { createSingleProductOrder } from '@/features/shop/actions';
import { useState, useEffect } from 'react';

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
  createOrderAction: (cart: Cart, customerInfo: CustomerInfo) => Promise<{ success: boolean; error?: string; } | undefined>;
}

export function CartSummary({ cart, products, createOrderAction }: CartSummaryProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // New state for mobile expansion
  const [isAtBottom, setIsAtBottom] = useState(false); // New state for scroll position

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
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.email || !customerInfo.address) {
      alert('אנא מלא את כל שדות פרטי הלקוח.');
      return;
    }

    if (totalItems === 0) {
      alert('העגלה שלך ריקה.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrderAction(cart, customerInfo);
      if (result?.success) {
        alert('ההזמנה בוצעה בהצלחה!');
        // Redirect will be handled by the server action
      } else {
        alert(`הזמנה נכשלה: ${result?.error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll detection for auto-expansion and dynamic positioning
  useEffect(() => {
    const handleScroll = () => {
      const currentIsAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100; // 100px buffer
      setIsAtBottom(currentIsAtBottom); // Update isAtBottom state

      if (currentIsAtBottom && !isExpanded) {
        setIsExpanded(true);
      } else if (!currentIsAtBottom && isExpanded) { // New condition: if not at bottom and expanded, collapse
        setIsExpanded(false);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 100); // Debounce by 100ms

    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [isExpanded]); // Re-run effect if isExpanded changes

  return (
    <div
      className={`
        ${isAtBottom ? 'relative' : 'fixed bottom-0 left-0 right-0'} // Dynamic positioning
        bg-white border-t border-gray-200 p-4 shadow-lg md:relative md:border-none md:shadow-none
        ${isExpanded ? 'max-h-screen overflow-auto' : 'max-h-20 overflow-hidden'} transition-all duration-300 ease-in-out
      `}
      onClick={() => !isExpanded && setIsExpanded(true)} // Expand on click if collapsed
    >
      {isExpanded && !isAtBottom && ( // Close button visible only when expanded
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to parent div
            setIsExpanded(false);
          }}
          className="absolute top-2 right-2 md:hidden text-gray-500 hover:text-gray-700"
        >
          סגור
        </Button>
      )}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {!isExpanded && (
          <div className="md:hidden flex justify-between items-center w-full cursor-pointer" onClick={() => setIsExpanded(true)}>
            <h3 className="text-lg font-semibold text-gray-800">סיכום הזמנה</h3>
            <p className="text-sm text-gray-600">סה"כ פריטים: {totalItems} | סה"כ: ₪{totalPrice.toFixed(2)}</p>
          </div>
        )}
        {isExpanded && (
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800">סיכום הזמנה</h3>
            <p className="text-sm text-gray-600">סה"כ פריטים: {totalItems}</p>
            <p className="text-sm text-gray-600">סה"כ לתשלום: ₪{totalPrice.toFixed(2)}</p>
            {selectedProducts.length > 0 && (
              <div className="mt-2 text-sm text-gray-700">
                <p className="font-semibold">מוצרים נבחרים:</p>
                <ul className="list-disc list-inside">
                  {selectedProducts.map((item, index) => (
                    <li key={index}>{item.name} (x{item.qty}) - ₪{item.subtotal.toFixed(2)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {isExpanded && ( // Conditionally render the form
          <div className="w-full md:w-auto">
            <h4 className="text-md font-semibold mb-2">פרטי לקוח</h4>
            <input
              type="text"
              placeholder="שם מלא"
              value={customerInfo.fullName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="tel"
              placeholder="טלפון"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="email"
              placeholder="אימייל"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="כתובת"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              className="w-full p-2 border rounded-md mb-4"
            />
            <Button onClick={handleConfirmOrder} disabled={isSubmitting} className="w-full bg-olive text-white hover:bg-green-700">
              {isSubmitting ? 'שולח הזמנה...' : 'אשר הזמנה'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
