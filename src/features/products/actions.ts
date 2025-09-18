'use server';

import { Product } from "@/core/types";
import { googleSheetService } from "@/services/google-sheets";
import { productService } from "./service";

export type ProductsByCategory = Record<string, Product[]>;

/**
 * Server Action: Fetches all products from Google Sheets.
 * @returns A promise that resolves to an array of all products.
 */
export const getProductsAction = async (): Promise<Product[]> => {
  try {
    const products = await productService.getProducts();
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // Return an empty array in case of an error
  }
};

/**
 * Server Action: Fetches all products from Google Sheets and groups them by category.
 * @returns A promise that resolves to a dictionary of products grouped by category.
 */
export const getProductsByCategory = async (): Promise<ProductsByCategory> => {
  try {
    const products = await productService.getProducts();

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