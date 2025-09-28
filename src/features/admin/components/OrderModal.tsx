import * as React from 'react';
import { UIOrder } from '@/core/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
        printWindow.document.write('<html><head><title>Print Order</title>');
        printWindow.document.write('<link rel="stylesheet" href="/path/to/your/tailwind.css">'); // Adjust path as needed
        printWindow.document.write('<style>body { direction: rtl; font-family: Alef, sans-serif; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const products = order.products;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl" dir="rtl">
        <div ref={printRef}>
          <DialogHeader>
            <DialogTitle className="text-right">פרטי הזמנה</DialogTitle>
            <DialogDescription className="text-right">
              מזהה הזמנה: {order.orderId}
            </DialogDescription>
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
            <div>
              <h4 className="font-semibold">פריטים</h4>
              <ul className="list-disc list-inside">
                {products.map((p, i) => (
                  <li key={i}>{p.qty} x {p.name} {p.size ? `(${p.size})` : ''}</li>
                ))}
              </ul>
            </div>
            {order.notes && (
              <div>
                <h4 className="font-semibold">הערות</h4>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between items-center">
          <div className="flex items-center gap-2">
            <Select
              defaultValue={order.status}
              onValueChange={(newStatus: UIOrder['status']) => onStatusChange(order.orderId, newStatus)}
            >
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="שנה סטטוס תשלום" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="שולם">שולם</SelectItem>
                <SelectItem value="לא שולם">לא שולם</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>הדפס</Button>
            <Button onClick={onClose}>סגור</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
