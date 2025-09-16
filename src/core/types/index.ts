export interface Product {
  id: string; // ID (string, unique)
  category: string; // Category (string)
  productName_EN: string; // ProductName_EN (string)
  productName_HE: string; // ProductName_HE (string)
  description: string; // Description (string)
  price: number; // Price (number)
  imageURL: string; // ImageURL (string)
}

export interface User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  status: string;
}

export interface Customer {
  customerId: string; // CustomerID (string, unique, e.g. CUST001)
  fullName: string; // FullName (string)
  phone: string; // Phone (string, unique identifier for customer existence)
  email: string; // Email (string)
  address: string; // Address (string)
}

export interface Order {
  orderId: string; // OrderID (string, unique, e.g. ORD001)
  customerId: string; // CustomerID (string, FK to Customers.CustomerID)
  productsJSON: string; // ProductsJSON (stringified JSON)
  totalPrice: number; // TotalPrice (number)
  orderDate: string; // OrderDate (ISO string)
  status: 'Pending' | 'Completed';
}

export interface CartItem {
  qty: number;
}

export interface Cart {
  [productId: string]: CartItem;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface CartItem {
  qty: number;
}

export interface Cart {
  [productId: string]: CartItem;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

// The shape of the product data stored in the order's JSON field
export type OrderProduct = {
  qty: number;
  size?: string;
  color?: string;
  [key: string]: any; // For other dynamic properties
};

// Raw Order data from the database
export interface DBOrder {
  orderId: string;
  customerId: string;
  products: Record<string, OrderProduct>; // JSON object with productId as key
  createdAt: Date;
}

// Enriched product data for the UI
export interface UIProduct extends OrderProduct {
  productId: string;
  name: string;
  imageUrl: string;
}

// Final, UI-friendly order object for rendering
export interface UIOrder {
  orderId: string;
  customerId: string;
  customerName: string;
  products: UIProduct[];
  createdAt: Date;
}