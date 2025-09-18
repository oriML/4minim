export interface Set {
  id: string;
  userId: string; // UserID (string, FK to Users.userId)
  title: string;
  description: string;
  productsJson: Record<string, { qty: number; [key: string]: any }>;
  price: number;
  imageUrl: string;
}
