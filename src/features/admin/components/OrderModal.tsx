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
      <DialogContent className="sm:max-w-4xl p-6 bg-white rounded-lg shadow-xl" dir="rtl">
        <div ref={printRef} className="text-right">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl font-extrabold text-olive-700 border-b pb-3 mb-4">פרטי הזמנה</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <h4 className="font-semibold">פרטי לקוח</h4>
                <p>{order.customerName}</p>
                <p>{order.customerPhone}</p>
                <p>{order.customerAddress}</p> {/* New: Display customer address */}
              </div>
              <div>
                <h4 className="font-semibold">פרטי הזמנה</h4>
                <p>תאריך: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>סך הכל: ₪{order.totalPrice.toFixed(2)}</p>
                <p>סטטוס: {order.status}</p>
                <p>סטטוס תשלום: {order.paymentStatus}</p>
                <p>דרוש משלוח: {order.deliveryRequired ? 'כן' : 'לא'}</p> {/* New: Display deliveryRequired */}
              </div>
            </div>

            {/* Customer Details Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">פרטי לקוח</h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">שם:</span> {order.customerName}</p>
                <p><span className="font-semibold">טלפון:</span> {order.customerPhone}</p>
                <p><span className="font-semibold">אימייל:</span> {order.email || 'לא צוין'}</p>
              </div>
            </div>
          </div>

          {/* Products List Section */}
          <div className="mb-6 border-t pt-6 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-3">פריטים בהזמנה</h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {order.products.map((product) => (
                <div key={product.productId} className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md ml-3" />
                  )}
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">כמות: {product.qty}</p>
                    {product.size && <p className="text-sm text-gray-600">גודל: {product.size}</p>}
                    {product.color && <p className="text-sm text-gray-600">צבע: {product.color}</p>}
                  </div>
                  <span className="font-bold text-gray-900">₪{(product.qty * (product.price || 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          {order.notes && (
            <div className="mb-6 border-t pt-6 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3">הערות</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer with Buttons and Dropdowns */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 mt-6 border-t pt-4 border-gray-200">
          {/* Status Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select
              defaultValue={order.status}
              onValueChange={(newStatus: UIOrder['status']) => onStatusChange(order.orderId, newStatus)}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300 text-gray-700 focus:ring-olive-500 focus:border-olive-500">
                <SelectValue placeholder="שנה סטטוס" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg rounded-md">
                <SelectItem value="בהמתנה">בהמתנה</SelectItem>
                <SelectItem value="בוצעה">בוצעה</SelectItem>
                <SelectItem value="בוטלה">בוטלה</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={order.paymentStatus}
              onValueChange={(newStatus: UIOrder['paymentStatus']) => onPaymentStatusChange(order.orderId, newStatus)}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300 text-gray-700 focus:ring-olive-500 focus:border-olive-500">
                <SelectValue placeholder="שנה סטטוס תשלום" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg rounded-md">
                <SelectItem value="שולם">שולם</SelectItem>
                <SelectItem value="לא שולם">לא שולם</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="w-full sm:w-auto border-olive-600 text-olive-600 hover:bg-olive-50 hover:text-olive-700"
            >
              הדפס
            </Button>
            <Button
              onClick={onClose}
              className="w-full sm:w-auto bg-olive-600 text-white hover:bg-olive-700"
            >
              סגור
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

