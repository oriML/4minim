export interface Set {
  id: string;
  title: string;
  description: string;
  productsJson: Record<string, { qty: number; [key: string]: any }>;
  price: number;
  imageUrl: string;
}
