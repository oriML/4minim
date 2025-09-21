
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  customerName: string;
  onPaymentSuccess: () => void;
  selectedPaymentMethod: 'PayBox' | 'Bit'; // New prop
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, orderId, amount, customerName, onPaymentSuccess, selectedPaymentMethod }) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const initiatePaymentFlow = useCallback(async (method: 'PayBox' | 'Bit') => {
    setPaymentStatus('processing');
    setPaymentUrl(null); // Clear previous URL

    try {
      const response = await new Promise<{ url: string }>((resolve) => {
        setTimeout(() => {
          const mockPayBoxUrl = `https://payboxapp.page.link/pay?amount=${amount}&description=Order%20${orderId}`;
          const mockBitUrl = `https://bit.app/pay?amount=${amount}&ref=${orderId}`;
          const url = method === 'PayBox' ? mockPayBoxUrl : mockBitUrl;
          resolve({ url });
        }, 1500); // Simulate network delay
      });

      setPaymentUrl(response.url);

      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate for simulation
        if (success) {
          setPaymentStatus('success');
          onPaymentSuccess();
          setTimeout(() => {
            onClose();
          }, 2000); // Auto-close after 2 seconds on success
        } else {
          setPaymentStatus('failed');
        }
      }, 3000); // Simulate time user spends in iframe + processing
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      setPaymentStatus('failed');
    }
  }, [amount, orderId, onPaymentSuccess, onClose]);

  useEffect(() => {
    if (isOpen && selectedPaymentMethod && paymentStatus === 'idle') { // Only initiate if idle
      initiatePaymentFlow(selectedPaymentMethod);
    }
    if (!isOpen) {
      setPaymentStatus('idle'); // Reset status when modal closes
      setPaymentUrl(null);
    }
  }, [isOpen, selectedPaymentMethod, initiatePaymentFlow, paymentStatus]); // Added paymentStatus to dependencies

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rtl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl font-bold text-brand-dark">תשלום עבור הזמנה #{orderId}</DialogTitle>
          <DialogDescription className="text-right text-brand-dark/80">
            אנא השלם את התשלום באמצעות {selectedPaymentMethod}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-right">
          <p className="text-lg"><strong>שם לקוח:</strong> {customerName}</p>
          <p className="text-lg"><strong>סכום לתשלום:</strong> ₪{amount.toFixed(2)}</p>

          {paymentStatus === 'processing' && !paymentUrl && (
            <div className="flex flex-col items-center justify-center h-32">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mb-4 animate-spin"></div>
              <p className="text-brand-dark text-lg">מכין תשלום...</p>
            </div>
          )}

          {paymentStatus === 'processing' && paymentUrl && (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <p className="text-brand-dark text-lg mb-2">הפניה לדף התשלום...</p>
              <iframe
                src={paymentUrl}
                title="Payment Gateway"
                className="w-full h-full border-0 rounded-md shadow-inner"
              >
              </iframe>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="flex flex-col items-center justify-center h-32 text-green-600">
              <CheckCircle2 size={48} className="mb-3" />
              <p className="text-lg font-semibold">התשלום בוצע בהצלחה!</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex flex-col items-center justify-center h-32 text-red-600">
              <p className="text-lg font-semibold">התשלום נכשל. אנא נסה שוב.</p>
              <Button onClick={() => setPaymentStatus('idle')} className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-full">
                נסה שוב
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-start">
          {paymentStatus !== 'processing' && (
            <Button onClick={onClose} className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-full px-6 py-2">
              סגור
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default PaymentModal;

