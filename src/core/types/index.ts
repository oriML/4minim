export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'set' | 'custom';
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: { id: string; name: string; quantity: number; price: number }[];
  total: number;
  timestamp: string;
}
