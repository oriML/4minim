'use client';

import * as React from 'react';
import { UIOrder, UIProduct } from '@/core/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/features/admin/actions';

interface OrderTableProps {
  orders: UIOrder[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const handleStatusUpdate = async (orderId: string, newStatus: UIOrder['status']) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      alert('סטטוס ההזמנה עודכן בהצלחה!');
    } else {
      alert(`עדכון סטטוס הזמנה נכשל: ${result.error}`);
    }
  };

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm" dir="rtl">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 text-right">הזמנות</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[100px] text-right">מזהה הזמנה</TableHead>
            <TableHead className="text-right">שם לקוח</TableHead>
            <TableHead className="text-right">טלפון</TableHead>
            <TableHead className="text-right">פריטים</TableHead>
            <TableHead className="text-right">סך הכל</TableHead>
            <TableHead className="text-right">סטטוס</TableHead>
            <TableHead className="text-right">תאריך</TableHead>
            <TableHead className="text-right">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                לא נמצאו הזמנות.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.orderId} className="border-b last:border-b-0 hover:bg-gray-50">
                <TableCell className="font-medium text-right">{order.orderId}</TableCell>
                <TableCell className="text-right">{order.customerName}</TableCell>
                <TableCell className="text-right">{order.customerPhone}</TableCell>
                <TableCell className="text-right">
                  {
                    order.products.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {item.qty} x {item.name} {item.size ? `(${item.size})` : ''}
                      </div>
                    ))
                  }
                </TableCell>
                <TableCell className="text-right">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'בוצעה' ? 'bg-green-100 text-green-800' : order.status === 'בוטלה' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                    `}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.status === 'בהמתנה' && (
                    <div className="flex justify-start space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(order.orderId, 'בוצעה')}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        סמן כבתשלום
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(order.orderId, 'בוטלה')}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        בטל
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
