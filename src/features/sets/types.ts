export interface Set {
  id: string;
  shopId: string; // ShopId (string, FK to Shop.id)
  title: string;
  description: string;
  productsJson: Record<string, { qty: number; [key: string]: any }>;
  price: number;
  imageUrl: string;
}
