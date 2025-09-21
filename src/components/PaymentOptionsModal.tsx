
'use client';

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PaymentModal from '@/components/PaymentModal';

interface PaymentOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  customerName: string;
  onPaymentSuccess: () => void;
}

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({ isOpen, onClose, orderId, amount, customerName, onPaymentSuccess }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'PayBox' | 'Bit' | null>(null);

  const handlePaymentMethodSelect = useCallback((method: 'PayBox' | 'Bit') => {
    setSelectedPaymentMethod(method);
    setShowPaymentModal(true);
  }, []);

  const handlePaymentModalClose = useCallback(() => {
    setShowPaymentModal(false);
    setSelectedPaymentMethod(null);
    // If payment was successful, the parent (OrderDetailsPage) will handle closing this modal
    // Otherwise, keep this modal open for user to try again or close.
  }, []);

  const handlePaymentSuccessAndCloseOptions = useCallback(() => {
    onPaymentSuccess(); // Notify parent of success
    onClose(); // Close this options modal
  }, [onPaymentSuccess, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rtl animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl font-bold text-brand-dark">בחירת אמצעי תשלום</DialogTitle>
          <DialogDescription className="text-right text-brand-dark/80">
            אנא בחר את שיטת התשלום המועדפת עליך.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-right">
          <p className="text-lg"><strong>שם לקוח:</strong> {customerName}</p>
          <p className="text-lg"><strong>סכום לתשלום:</strong> ₪{amount.toFixed(2)}</p>

          <div className="space-y-3 mt-6">
            <Button
              className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-full py-3 text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handlePaymentMethodSelect('PayBox')}
            >
              תשלום באמצעות PayBox
            </Button>
            <Button
              className="w-full bg-brand-leaf text-white hover:bg-brand-leaf/90 rounded-full py-3 text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handlePaymentMethodSelect('Bit')}
            >
              תשלום באמצעות Bit
            </Button>
          </div>
        </div>
        <DialogFooter className="flex justify-start">
          <Button onClick={onClose} className="bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-full px-6 py-2">
            סגור
          </Button>
        </DialogFooter>
      </DialogContent>

      {selectedPaymentMethod && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          orderId={orderId}
          amount={amount}
          customerName={customerName}
          onPaymentSuccess={handlePaymentSuccessAndCloseOptions}
          selectedPaymentMethod={selectedPaymentMethod}
        />
      )}
    </Dialog>
  );
};

export default PaymentOptionsModal;
