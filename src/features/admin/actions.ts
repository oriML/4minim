'use server';

import { googleSheetService } from "@/services/google-sheets";
import { revalidatePath } from "next/cache";
import { Order } from "@/core/types";

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
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "מחיקת מוצר נכשלה." };
  }
}