export interface Product {
  id: string; // ID (string, unique)
  category: string; // Category (string)
  productName_EN: string; // ProductName_EN (string)
  productName_HE: string; // ProductName_HE (string)
  description: string; // Description (string)
  price: number; // Price (number)
  imageURL: string; // ImageURL (string)
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
  status: 'Pending' | 'Completed'; // Status (string: Pending/Completed)
}