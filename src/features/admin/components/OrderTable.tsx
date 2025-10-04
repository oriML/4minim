'use client';

import * as React from 'react';
import { UIOrder } from '@/core/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { updateOrderStatus, updateOrderPaymentStatus } from '@/features/admin/actions';
import { OrderModal } from './OrderModal';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface OrderTableProps {
  orders: UIOrder[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<UIOrder | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: UIOrder['status'], shopId: string) => {
    const result = await updateOrderStatus(orderId, newStatus, shopId);
    if (result.success) {
      alert('סטטוס ההזמנה עודכן בהצלחה!');
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } else {
      alert(`עדכון סטטוס הזמנה נכשל: ${result.error}`);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string, newStatus: UIOrder['paymentStatus'], shopId: string) => {
    const result = await updateOrderPaymentStatus(orderId, newStatus, shopId);
    if (result.success) {
      alert('סטטוס התשלום עודכן בהצלחה!');
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
    } else {
      alert(`עדכון סטטוס תשלום נכשל: ${result.error}`);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-white p-4 shadow-sm" dir="rtl">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 text-right">הזמנות</h2>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-right">צפייה</TableHead>
                <TableHead className="w-[100px] text-right">מזהה הזמנה</TableHead>
                <TableHead className="text-right">שם לקוח</TableHead>
                <TableHead className="text-right">טלפון</TableHead>
                <TableHead className="text-right">סך הכל</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="w-[100px] text-right">סטטוס תשלום</TableHead>
                <TableHead className="text-right">דרוש משלוח</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    לא נמצאו הזמנות.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.orderId} className="border-b last:border-b-0 hover:bg-gray-50">
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        צפה בהזמנה
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-right">{order.orderId}</TableCell>
                    <TableCell className="text-right">{order.customerName}</TableCell>
                    <TableCell className="text-right">{order.customerPhone}</TableCell>
                    <TableCell className="text-right">₪{order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${order.status === 'בוצעה' ? 'bg-green-100 text-green-800' : order.status === 'בוטלה' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                        `}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        `}
                      >
                        {order.paymentStatus === 'שולם' ? '✅' : '❌'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.deliveryRequired ? '✅' : '❌'}
                    </TableCell>
                    <TableCell className="text-right">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <span className="sr-only">פתח תפריט</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order.orderId, 'בוצעה', order.shopId)}>
                            הזמנה בוצעה
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentStatusUpdate(order.orderId, 'שולם', order.shopId)}>
                            הזמנה שולמה
                          </DropdownMenuItem>
                          <DropdownMenuItem className='bg-red-400 text-red-800' onClick={() => handleStatusUpdate(order.orderId, 'בוטלה', order.shopId)}>
                            ביטול הזמנה
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          {orders.length === 0 ? (
            <div className="h-24 text-center flex items-center justify-center">
              לא נמצאו הזמנות.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div key={order.orderId} className="relative bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="absolute top-2 left-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.orderId, 'בוצעה', order.shopId)}>
                          הזמנה בוצעה
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePaymentStatusUpdate(order.orderId, 'שולם', order.shopId)}>
                          הזמנה שולמה
                        </DropdownMenuItem>
                        <DropdownMenuItem className='bg-red-400 text-red-800' onClick={() => handleStatusUpdate(order.orderId, 'בוטלה', order.shopId)}>
                          ביטול הזמנה
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button variant="link" className="text-sm text-blue-600 p-0 h-auto" onClick={() => setSelectedOrder(order)}>
                      צפה בהזמנה
                    </Button>
                  </div>

                  <div className="flex flex-col items-center text-center pt-10 pb-4">
                    <h3 className="text-lg font-semibold text-gray-800">מזהה הזמנה: {order.orderId}</h3>
                    <p className="text-sm text-gray-600">לקוח: {order.customerName} ({order.customerPhone})</p>
                    <p className="text-md font-bold text-gray-900 mt-2">סה"כ: ₪{order.totalPrice.toFixed(2)}</p>
                    <div className="flex items-center space-x-2 space-x-reverse mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${order.status === 'בוצעה' ? 'bg-green-100 text-green-800' : order.status === 'בוטלה' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                        `}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold`}
                      >
                        {order.paymentStatus === 'שולם' ? '✅ שולם' : '❌ לא שולם'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.deliveryRequired ? '✅ משלוח' : '❌ ללא משלוח'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">תאריך: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusUpdate}
          onPaymentStatusChange={handlePaymentStatusUpdate}
        />
      )}
    </>
  );
}