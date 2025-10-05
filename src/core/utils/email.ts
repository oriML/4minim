'use server';

import nodemailer from 'nodemailer';
import { Order, User } from '@/core/types';

interface SellerNotificationEmailProps {
  sellerEmail: string;
  order: Order;
  customerInfo: any; // You might want to define a more specific type for customerInfo
  seller: User; // The seller's user object
}

export async function sendSellerNotificationEmail({
  sellerEmail,
  order,
  customerInfo,
  seller,
}: SellerNotificationEmailProps) {
  // Configure your email transporter
  // You'll need to set these environment variables
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SERVER_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: sellerEmail,
    subject: 'הודעה על הזמנה חדשה: #' + order.orderId,
    html: `
      <h1 dir="rtl">הודעה על הזמנה חדשה</h1>
      <p dir="rtl">שלום ${seller.username},</p>
      <p dir="rtl">התקבלה הזמנה חדשה:</p>
      <ul dir="rtl">
        <li><strong>מספר הזמנה:</strong> ${order.orderId}</li>
        <li><strong>סה"כ לתשלום:</strong> ₪${order.totalPrice.toFixed(2)}</li>
        <li><strong>שם לקוח:</strong> ${customerInfo.fullName}</li>
        <li><strong>טלפון לקוח:</strong> ${customerInfo.phone}</li>
        <li><strong>אימייל לקוח:</strong> ${customerInfo.email || 'לא צוין'}</li>
        <li><strong>נדרש משלוח:</strong> ${order.deliveryRequired ? 'כן' : 'לא'}</li>
        ${order.deliveryRequired ? `<li dir="rtl"><strong>כתובת למשלוח:</strong> ${customerInfo.address}</li>` : ''}
        <li><strong>הערות:</strong> ${order.notes || 'אין'}</li>
      </ul>
      <p dir="rtl">אנא התחבר למערכת הניהול לצפייה בפרטי ההזמנה המלאים.</p>
      <p dir="rtl">תודה!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Seller notification email sent to ${sellerEmail} for order ${order.orderId}`);
  } catch (error) {
    console.error(`Failed to send seller notification email to ${sellerEmail}:`, error);
  }
}

export async function sendSystemErrorEmail({ error, context }: { error: any; context: string }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_SERVER_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: '4minim.app@gmail.com',
    subject: 'System Error Notification',
    html: `
      <h1>System Error</h1>
      <p>An error occurred in the system.</p>
      <p><strong>Context:</strong> ${context}</p>
      <p><strong>Error:</strong></p>
      <pre>${JSON.stringify(error, null, 2)}</pre>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('System error email sent.');
  } catch (emailError) {
    console.error('Failed to send system error email:', emailError);
  }
}
