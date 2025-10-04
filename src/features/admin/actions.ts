'use server';

import { revalidatePath } from "next/cache";
import { Order, Product } from "@/core/types";
import { redirect } from "next/navigation";
import { productImageService } from '@/services/product-image';
import { productService } from '@/features/products/service';
import { orderService } from '@/features/orders/service';
import { getAdminUser, resolveShopForAdmin } from "@/core/utils/user-context";

export async function updateOrderStatus(orderId: string, newStatus: Order['status'], shopId: string) {
  try {
    await orderService.updateOrder(orderId, { status: newStatus }, shopId);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    return { success: false, error: "עדכון סטטוס הזמנה נכשל." };
  }
}

export async function updateOrderPaymentStatus(orderId: string, newStatus: Order['paymentStatus'], shopId: string) {
  try {
    await orderService.updateOrder(orderId, { paymentStatus: newStatus }, shopId);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order payment status:", error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    return { success: false, error: "עדכון סטטוס תשלום נכשל." };
  }
}

export async function deleteProductAction(productId: string) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }

  try {
    await productService.deleteProduct(productId, shop.id);
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    return { success: false, error: "מחיקת מוצר נכשלה." };
  }
}

export async function createProductAction(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }

  try {
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
      await productImageService.uploadProductImage(imageFile, product.id, shop.id); // Use shop.id
    }

    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Failed to create product:", error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    return { success: false, error: "יצירת מוצר חדש נכשלה." };
  }
  redirect("/admin/dashboard");
}

export async function updateProductAction(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }

  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }

  try {
    const productId = formData.get("productId") as string;

    const productData = {
      productName_HE: formData.get("productName_HE") as string,
      productName_EN: formData.get("productName_EN") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as Product['category'],
      imageUrl: formData.get("imageUrl") as string,
    };

    const product = await productService.updateProduct(productId, productData, shop.id);

    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      await productImageService.uploadProductImage(imageFile, productId, shop.id);
    }

    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Failed to update product:", error);
    if (error instanceof Error && error.message.includes('User ID not found')) {
      redirect('/admin/login');
    }
    return { success: false, error: "עדכון מוצר נכשל." };
  }
  redirect("/admin/dashboard");
}