'use server';

import { googleSheetService } from "@/services/google-sheets";
import { revalidatePath } from "next/cache";
import { Order, Product } from "@/core/types";
import { redirect } from "next/navigation";

export async function updateOrderStatus(orderId: string, newStatus: Order['status']) {
  try {
    await googleSheetService.updateOrder(orderId, { status: newStatus });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "עדכון סטטוס הזמנה נכשל." };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await googleSheetService.deleteProduct(productId);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "מחיקת מוצר נכשלה." };
  }
}

export async function createProductAction(formData: FormData) {
  try {
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as Product['category'],
      imageUrl: formData.get("imageUrl") as string,
    };

    await googleSheetService.createProduct(productData);
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    redirect("/admin/products");
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "יצירת מוצר חדש נכשלה." };
  }
}

export async function updateProductAction(productId: string, formData: FormData) {
  try {
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as Product['category'],
      imageUrl: formData.get("imageUrl") as string,
    };

    await googleSheetService.updateProduct(productId, productData);
    revalidatePath("/admin/products");
    revalidatePath("/admin/dashboard");
    redirect("/admin/products");
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "עדכון מוצר נכשל." };
  }
}