import * as React from 'react';
import { UIOrder, Product } from '@/core/types';

interface SummaryDashboardProps {
  orders: UIOrder[];
  products: Product[];
}

export function SummaryDashboard({ orders, products }: SummaryDashboardProps) {
  const totalOrders = orders.length;
  const totalProductsSold = orders.reduce((sum, order) => {
    return sum + order.products.reduce((productSum, item) => productSum + item.qty, 0);
  }, 0);

  const uniqueCustomers = new Set(orders.map(order => order.customerId)).size;

  const categoryBreakdown: { [key: string]: number } = {};
  orders.forEach(order => {
    order.products.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        categoryBreakdown[product.category] = (categoryBreakdown[product.category] || 0) + item.qty;
      }
    });
  });

  const ordersByDate: { [key: string]: number } = {};
  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString();
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" dir="rtl">
      <Card title="סך כל ההזמנות" value={totalOrders || 0} />
      <Card title="מוצרים שנמכרו" value={totalProductsSold || 0} />
      <Card title="לקוחות ייחודיים" value={uniqueCustomers || 0} />
      <Card title="פירוט לפי קטגוריות">
        <ul className="text-sm text-gray-600">
          {Object.entries(categoryBreakdown).map(([category, count]) => (
            <li key={category}>{category}: {count}</li>
          ))}
        </ul>
      </Card>
      <Card title="הזמנות לפי תאריך">
        <ul className="text-sm text-gray-600">
          {Object.entries(ordersByDate).map(([date, count]) => (
            <li key={date}>{date}: {count} הזמנות</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

interface CardProps {
  title: string;
  value?: string | number;
  children?: React.ReactNode;
}

function Card({ title, value, children }: CardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm" dir="rtl">
      <h3 className="mb-2 text-lg font-semibold text-gray-700 text-right">{title}</h3>
      {value !== undefined && <p className="text-3xl font-bold text-gray-900 text-right">{value}</p>}
      {children}
    </div>
  );
}
