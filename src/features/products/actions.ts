'use server';

import { Product } from "@/core/types";
import { googleSheetService } from "@/services/google-sheets";
import { productService } from "./service";
import { getAdminUser, resolveShopForAdmin } from "@/core/utils/user-context";
import { redirect } from "next/navigation";

export type ProductsByCategory = Record<string, Product[]>;


async function getShopIdForAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    redirect('/admin/login');
  }
  const shop = await resolveShopForAdmin(admin.userId);
  if (!shop) {
    throw new Error('Shop not found for admin.');
  }
  return shop.id;
}


/**
 * Server Action: Fetches all products from Google Sheets.
 * @returns A promise that resolves to an array of all products.
 */
export const getProductAction = async (id: string): Promise<Product | undefined> => {
  try {
    const shopId = await getShopIdForAdmin();
    const products = await productService.getProductsByShop(shopId);
    return products.find(product => product.id === id);
  } catch (error) {
    console.error("getProductsAction: Failed to fetch products:", error);
  }
};

/**
 * Server Action: Fetches all products from Google Sheets and groups them by category.
 * @returns A promise that resolves to a dictionary of products grouped by category.
 */
export const getProductsByCategory = async (shopId: string): Promise<ProductsByCategory> => {
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

    return productsByCategory;
  } catch (error) {
    console.error("Failed to fetch or process products from Google Sheets:", error);
    return {}; // Return an empty object in case of an error
  }
};

/**
 * Server Action: Fetches all products from Google Sheets, without user filtering.
 * @returns A promise that resolves to an array of all products.
 */
export const getAllProductsAction = async (): Promise<Product[]> => {
  try {
    const shopId = await getShopIdForAdmin();
    const products = await googleSheetService.getProductsByShop(shopId);
    return products;
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return []; // Return an empty array in case of an error
  }
};
