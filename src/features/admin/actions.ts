'use server';

import { revalidatePath } from "next/cache";
import { Order, Product } from "@/core/types";
import { ApiResponse } from "@/core/types/responses";
import { productImageService } from '@/services/product-image';
import { productService } from '@/features/products/service';
import { orderService } from '@/features/orders/service';
import { getAdminUser, resolveShopForAdmin } from "@/core/utils/user-context";
import { sendSystemErrorEmail } from "@/core/utils/email";

export async function updateOrderStatus(orderId: string, newStatus: Order['status'], shopId: string): Promise<ApiResponse> {
  try {
    await orderService.updateOrder(orderId, { status: newStatus }, shopId);
    revalidatePath("/admin/dashboard");
    return { success: true, message: 'סטטוס הזמנה עודכן בהצלחה!' };
  } catch (error) {
    console.error("Failed to update order status:", error);
    await sendSystemErrorEmail({ error, context: 'updateOrderStatus' });
    return { success: false, error: "עדכון סטטוס הזמנה נכשל." };
  }
}

export async function updateOrderPaymentStatus(orderId: string, newStatus: Order['paymentStatus'], shopId: string): Promise<ApiResponse> {
  try {
    await orderService.updateOrder(orderId, { paymentStatus: newStatus }, shopId);
    revalidatePath("/admin/dashboard");
    return { success: true, message: 'סטטוס תשלום עודכן בהצלחה!' };
  } catch (error) {
    console.error("Failed to update order payment status:", error);
    await sendSystemErrorEmail({ error, context: 'updateOrderPaymentStatus' });
    return { success: false, error: "עדכון סטטוס תשלום נכשל." };
  }
}

export async function deleteProductAction(productId: string): Promise<ApiResponse> {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return { success: false, error: "אינך מורשה לבצע פעולה זו." };
    }

    const shop = await resolveShopForAdmin(admin.userId);
    if (!shop) {
      return { success: false, error: "לא נמצאה חנות למנהל." };
    }

    await productService.deleteProduct(productId, shop.id);
    revalidatePath("/admin/dashboard");
    return { success: true, message: 'המוצר נמחק בהצלחה!' };
  } catch (error) {
    console.error("Failed to delete product:", error);
    await sendSystemErrorEmail({ error, context: 'deleteProductAction' });
    return { success: false, error: "מחיקת מוצר נכשלה." };
  }
}

export async function createProductAction(formData: FormData): Promise<ApiResponse> {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return { success: false, error: "אינך מורשה לבצע פעולה זו." };
    }

    const shop = await resolveShopForAdmin(admin.userId);
    if (!shop) {
      return { success: false, error: "לא נמצאה חנות למנהל." };
    }

    const productData = {
      productName_HE: formData.get("productName_HE") as string,
      productName_EN: formData.get("productName_EN") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as Product['category'],
      imageUrl: formData.get("imageUrl") as string,
    };

    const product = await productService.createProduct(productData, shop.id);

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      await productImageService.uploadProductImage(imageFile, product.id, shop.id);
    }

    revalidatePath("/admin/dashboard");
    return { success: true, message: 'המוצר נוצר בהצלחה!' };
  } catch (error) {
    console.error("Failed to create product:", error);
    await sendSystemErrorEmail({ error, context: 'createProductAction' });
    return { success: false, error: "יצירת מוצר חדש נכשלה." };
  }
}

export async function updateProductAction(formData: FormData): Promise<ApiResponse> {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return { success: false, error: "אינך מורשה לבצע פעולה זו." };
    }

    const shop = await resolveShopForAdmin(admin.userId);
    if (!shop) {
      return { success: false, error: "לא נמצאה חנות למנהל." };
    }

    const productId = formData.get("productId") as string;

    const productData = {
      productName_HE: formData.get("productName_HE") as string,
      productName_EN: formData.get("productName_EN") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as Product['category'],
      imageUrl: formData.get("imageUrl") as string,
    };

    await productService.updateProduct(productId, productData, shop.id);

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      await productImageService.uploadProductImage(imageFile, productId, shop.id);
    }

    revalidatePath("/admin/dashboard");
    return { success: true, message: 'המוצר עודכן בהצלחה!' };
  } catch (error) {
    console.error("Failed to update product:", error);
    await sendSystemErrorEmail({ error, context: 'updateProductAction' });
    return { success: false, error: "עדכון מוצר נכשל." };
  }
}