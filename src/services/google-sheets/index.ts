import { sheets } from './client';
import type { Product, Order } from '@/core/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const PRODUCTS_SHEET_NAME = 'Products';
const ORDERS_SHEET_NAME = 'Orders';

const getProducts = async (): Promise<Product[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A2:F`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    id: row[0],
    name: row[1],
    description: row[2],
    price: parseFloat(row[3]),
    imageUrl: row[4],
    category: row[5] as 'set' | 'custom',
  }));
};

const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newId = `PROD-${Date.now()}`;
  const newProduct: Product = { ...product, id: newId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newProduct.id, newProduct.name, newProduct.description, newProduct.price, newProduct.imageUrl, newProduct.category]],
    },
  });

  return newProduct;
};

const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  const products = await getProducts();
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  const productToUpdate = products[productIndex];
  const updatedProduct = { ...productToUpdate, ...updates };

  const range = `${PRODUCTS_SHEET_NAME}!A${productIndex + 2}:F${productIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedProduct.id, updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.imageUrl, updatedProduct.category]],
    },
  });

  return updatedProduct;
};

const deleteProduct = async (id: string): Promise<void> => {
  const products = await getProducts();
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  const sheetId = await getSheetId(PRODUCTS_SHEET_NAME);
  if (sheetId === null) {
    throw new Error(`Sheet '${PRODUCTS_SHEET_NAME}' not found.`);
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: productIndex + 1,
              endIndex: productIndex + 2,
            },
          },
        },
      ],
    },
  });
};

const addOrder = async (order: Omit<Order, 'id' | 'timestamp'>): Promise<Order> => {
  const newOrder: Order = {
    ...order,
    id: `ORDER-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newOrder.id, newOrder.customerName, newOrder.customerEmail, JSON.stringify(newOrder.products), newOrder.total, newOrder.timestamp]],
    },
  });

  return newOrder;
};

const getSheetId = async (sheetName: string): Promise<number | null> => {
  const response = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheet = response.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  );

  return sheet?.properties?.sheetId ?? null;
};

export const googleSheetService = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addOrder,
};
