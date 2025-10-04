export interface Shop {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconUrl: string;
  active: boolean;
}

export interface Product {
  id: string; // ID (string, unique)
  shopId: string; // ShopID (string, FK to Shops.shopId)
  category: string; // Category (string)
  productName_EN: string; // ProductName_EN (string)
  productName_HE: string; // ProductName_HE (string)
  description: string; // Description (string)
  price: number; // Price (number)
  imageUrl: string; // ImageURL (string)
}

export interface User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  status: string;
  deliveryFee?: number;
}

export interface Customer {
  customerId: string; // CustomerID (string, unique, e.g. CUST001)
  shopId: string; // ShopID (string, FK to Shops.shopId)
  fullName: string; // FullName (string)
  phone: string; // Phone (string, unique identifier for customer existence)
  email: string; // Email (string)
  address: string; // Address (string)
}

// This type represents the data collected from the customer form
export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
  deliveryRequired: boolean;
}

// Type for the shopping cart
export interface Cart {
  [productId: string]: {
    qty: number;
  };
}

export interface Order {
  orderId: string; // OrderID (string, unique, e.g. ORD001)
  shopId: string; // ShopID (string, FK to Shops.shopId)
  customerId: string; // CustomerID (string, FK to Customers.CustomerID)
  productsJSON: string; // ProductsJSON (stringified JSON)
  totalPrice: number; // TotalPrice (number)
  orderDate: string; // OrderDate (ISO string)
  status: 'בהמתנה' | 'בוצעה' | 'בוטלה'; // Status (string: Pending/Completed)
  paymentStatus: 'שולם' | 'לא שולם';
  deliveryRequired: boolean; // New: Indicates if delivery is required
  notes?: string; // Optional notes for the order
  originalSetId?: string; // New: ID of the original set if the order is for a pre-built set
}

export interface Set {
  id: string;
  shopId: string;
  title: string;
  description: string;
  productsJson: Record<string, { qty: number }>;
  price: number;
  imageUrl: string;
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
  shopId: string;
  customerId: string;
  products: Record<string, OrderProduct>; // JSON object with productId as key
  createdAt: Date;
  status: 'בהמתנה' | 'בוצעה' | 'בוטלה';
  paymentStatus: 'שולם' | 'לא שולם';
  deliveryRequired: boolean; // New: Indicates if delivery is required
  notes?: string;
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
  shopId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string; // New: Customer's address
  products: UIProduct[];
  totalPrice: number;
  createdAt: Date;
  notes?: string;
  status: 'בהמתנה' | 'בוצעה' | 'בוטלה';
  paymentStatus: 'שולם' | 'לא שולם';
  deliveryRequired: boolean; // New: Indicates if delivery is required
}