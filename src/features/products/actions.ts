'use server';

import { Product } from "@/core/types";
import { ApiResponse } from "@/core/types/responses";
import { googleSheetService } from "@/services/google-sheets";
import { productService } from "./service";
import { getAdminUser, resolveShopForAdmin } from "@/core/utils/user-context";
import { sendSystemErrorEmail } from "@/core/utils/email";

export type ProductsByCategory = Record<string, Product[]>;

async function getShopIdForAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error('Admin user not found.');
  }
  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }
  return shop.id;
}

export const getProductAction = async (id: string): Promise<ApiResponse<Product | undefined>> => {
  try {
    const shopId = await getShopIdForAdmin();
    const products = await productService.getProductsByShop(shopId);
    const product = products.find(product => product.id === id);
    return { success: true, data: product };
  } catch (error) {
    console.error("getProductsAction: Failed to fetch products:", error);
    await sendSystemErrorEmail({ error, context: 'getProductAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
};

export const getProductsByCategory = async (shopId: string): Promise<ApiResponse<ProductsByCategory>> => {
  try {
    const products = await productService.getProductsByShop(shopId);

    // Group products by category
    const productsByCategory = products.reduce<ProductsByCategory>((acc, product) => {
      const { category } = product;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});

    return { success: true, data: productsByCategory };
  } catch (error) {
    console.error("Failed to fetch or process products from Google Sheets:", error);
    await sendSystemErrorEmail({ error, context: 'getProductsByCategory' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
};

export const getAllProductsAction = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const shopId = await getShopIdForAdmin();
    const products = await googleSheetService.getProductsByShop(shopId);
    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    await sendSystemErrorEmail({ error, context: 'getAllProductsAction' });
    return { success: false, error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.' };
  }
};
