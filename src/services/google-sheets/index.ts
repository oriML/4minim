import { sheets } from './client';
import type { Product, Order, Customer, User, Cart, CustomerInfo } from '@/core/types';
import type { Set } from '@/features/sets/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const PRODUCTS_SHEET_NAME = 'Products';
const ORDERS_SHEET_NAME = 'Orders';
const CUSTOMERS_SHEET_NAME = 'Customers';
const USERS_SHEET_NAME = 'Users';
const SETS_SHEET_NAME = 'Sets';

const getProducts = async (): Promise<Product[]> => {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${PRODUCTS_SHEET_NAME}!A2:H`,
    });
    
    const values = response.data.values;
    if (!values) {
      return [];
    }

    return values.map((row) => ({
      id: row[0],
      category: row[1],
      productName_EN: row[2],
      productName_HE: row[3],
      description: row[4],
      price: parseFloat(row[5]),
      imageURL: row[6],
    }));
};

const getUsers = async (): Promise<User[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${USERS_SHEET_NAME}!A2:F`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    userId: row[0],
    username: row[1],
    email: row[2],
    passwordHash: row[3],
    role: row[4] as 'admin' | 'user',
    status: row[5],
  }));
};

const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newId = `PROD-${Date.now()}`;
  const newProduct: Product = { ...product, id: newId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A:H`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newProduct.id, newProduct.category, newProduct.productName_EN, newProduct.productName_HE, newProduct.description, newProduct.price, newProduct.imageURL]],
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

  const range = `${PRODUCTS_SHEET_NAME}!A${productIndex + 2}:G${productIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedProduct.id, updatedProduct.category, updatedProduct.productName_EN, updatedProduct.productName_HE, updatedProduct.description, updatedProduct.price, updatedProduct.imageURL]],
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

const addOrder = async (order: Omit<Order, 'orderId' | 'orderDate' | 'status'> & { status?: 'Pending' | 'Completed' }): Promise<Order> => {
  const newOrderId = `ORD-${Date.now()}`;
  const newOrder: Order = {
    ...order,
    orderId: newOrderId,
    orderDate: new Date().toISOString(),
    status: order.status || 'Pending',
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A:G`, // Updated range to include Notes column
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newOrder.orderId, newOrder.customerId, newOrder.productsJSON, newOrder.totalPrice, newOrder.orderDate, newOrder.status, newOrder.notes || '']],
    },
  });

  return newOrder;
};

const getCustomers = async (): Promise<Customer[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${CUSTOMERS_SHEET_NAME}!A2:E`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    customerId: row[0],
    fullName: row[1],
    phone: row[2],
    email: row[3],
    address: row[4],
  }));
};

const addCustomer = async (customer: Omit<Customer, 'customerId'>): Promise<Customer> => {
  const newCustomerId = `CUST-${Date.now()}`;
  const newCustomer: Customer = { ...customer, customerId: newCustomerId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${CUSTOMERS_SHEET_NAME}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newCustomer.customerId, newCustomer.fullName, newCustomer.phone, newCustomer.email, newCustomer.address]],
    },
  });

  return newCustomer;
};

const updateCustomer = async (id: string, updates: Partial<Omit<Customer, 'customerId'>>): Promise<Customer> => {
  const customers = await getCustomers();
  const customerIndex = customers.findIndex((c) => c.customerId === id);
  if (customerIndex === -1) {
    throw new Error('Customer not found');
  }

  const customerToUpdate = customers[customerIndex];
  const updatedCustomer = { ...customerToUpdate, ...updates };

  const range = `${CUSTOMERS_SHEET_NAME}!A${customerIndex + 2}:E${customerIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedCustomer.customerId, updatedCustomer.fullName, updatedCustomer.phone, updatedCustomer.email, updatedCustomer.address]],
    },
  });

  return updatedCustomer;
};

const getOrders = async (): Promise<Order[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A2:G`, // Updated range
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    orderId: row[0],
    customerId: row[1],
    productsJSON: row[2],
    totalPrice: parseFloat(row[3]),
    orderDate: row[4],
    status: row[5] as 'Pending' | 'Completed',
    notes: row[6] || '', // Added notes field
  }));
};

const updateOrder = async (id: string, updates: Partial<Omit<Order, 'orderId'>>): Promise<Order> => {
  const orders = await getOrders();
  const orderIndex = orders.findIndex((o) => o.orderId === id);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }

  const orderToUpdate = orders[orderIndex];
  const updatedOrder = { ...orderToUpdate, ...updates };

  const range = `${ORDERS_SHEET_NAME}!A${orderIndex + 2}:G${orderIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedOrder.orderId, updatedOrder.customerId, updatedOrder.productsJSON, updatedOrder.totalPrice, updatedOrder.orderDate, updatedOrder.status, updatedOrder.notes || '']],
    },
  });

  return updatedOrder;
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

const getSets = async (): Promise<Set[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A2:F`, // Assuming A:F for id, title, description, productsJson, price, imageUrl
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => {
    console.log(`Set Image URL: ${row[5]}`); // Log the image URL
    return ({
      id: row[0],
      title: row[1],
      description: row[2],
      productsJson: (() => {
        try {
          return JSON.parse(row[3] || '{}');
        } catch (e) {
          console.warn(`Invalid JSON in productsJson for set ID ${row[0]}:`, row[3], e);
          return {}; // Default to empty object on error
        }
      })(),
      price: parseFloat(row[4]),
      imageUrl: row[5],
    });
  });
};

export const googleSheetService = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCustomers,
  addCustomer,
  updateCustomer,
  getOrders,
  addOrder,
  updateOrder,
  getUsers,
  getSets, // New: Export getSets
};