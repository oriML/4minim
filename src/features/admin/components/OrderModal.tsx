import * as React from 'react';
import { UIOrder } from '@/core/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrderModalProps {
  order: UIOrder;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: UIOrder['status']) => void;
  onPaymentStatusChange: (orderId: string, newStatus: UIOrder['paymentStatus']) => void;
}

export function OrderModal({ order, isOpen, onClose, onStatusChange, onPaymentStatusChange }: OrderModalProps) {
  const printRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>הדפסת הזמנה</title>');
        printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">');
        printWindow.document.write('<style>body { direction: rtl; font-family: sans-serif; padding: 20px; } .section-title { font-weight: bold; margin-top: 15px; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 5px; } .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; } .detail-label { font-weight: 600; } .product-item { display: flex; align-items: center; margin-bottom: 10px; } .product-image { width: 50px; height: 50px; object-fit: cover; margin-left: 10px; } .product-details { flex-grow: 1; } .product-name { font-weight: bold; } .product-qty { font-size: 0.9em; color: #555; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full mx-auto p-0 bg-white rounded-lg shadow-xl flex flex-col" dir="rtl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">פרטי הזמנה</DialogTitle>
        </DialogHeader>

        <div ref={printRef} className="flex-grow overflow-y-auto px-6 py-4 text-right">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">פרטי לקוח</h4>
              <p><strong>שם:</strong> {order.customerName}</p>
              <p><strong>טלפון:</strong> {order.customerPhone}</p>
              {order.customerAddress && <p><strong>כתובת:</strong> {order.customerAddress}</p>}
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">פרטי הזמנה</h4>
              <p><strong>תאריך:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>סך הכל:</strong> ₪{order.totalPrice.toFixed(2)}</p>
              <p><strong>סטטוס:</strong> {order.status}</p>
              <p><strong>סטטוס תשלום:</strong> {order.paymentStatus}</p>
              <p><strong>דרוש משלוח:</strong> {order.deliveryRequired ? 'כן' : 'לא'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-xl font-bold text-gray-800 mb-3">פריטים</h3>
            <div className="space-y-3">
              {order.products.map((product) => (
                <div key={product.productId} className="flex items-center bg-gray-50 p-3 rounded-md">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md ml-4" />
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">כמות: {product.qty}</p>
                  </div>
                  <span className="font-bold">₪{(product.qty * (product.price || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">הערות</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row-reverse gap-2">
          <Button onClick={onClose} className="w-full sm:w-auto">סגור</Button>
          <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">הדפס</Button>
          <div className="flex-grow flex flex-col sm:flex-row gap-2">
            <Select
              defaultValue={order.status}
              onValueChange={(newStatus: UIOrder['status']) => onStatusChange(order.orderId, newStatus)}
            >
              <SelectTrigger className="w-full sm:w-auto flex-grow">
                <SelectValue placeholder="שנה סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="בהמתנה">בהמתנה</SelectItem>
                <SelectItem value="בוצעה">בוצעה</SelectItem>
                <SelectItem value="בוטלה">בוטלה</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={order.paymentStatus}
              onValueChange={(newStatus: UIOrder['paymentStatus']) => onPaymentStatusChange(order.orderId, newStatus)}
            >
              <SelectTrigger className="w-full sm:w-auto flex-grow">
                <SelectValue placeholder="שנה סטטוס תשלום" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="שולם">שולם</SelectItem>
                <SelectItem value="לא שולם">לא שולם</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

