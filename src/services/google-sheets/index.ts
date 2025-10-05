import { sheets } from './client';
import type { Product, Order, Customer, User, Cart, CustomerInfo, Shop, Set } from '@/core/types';
import { sendSellerNotificationEmail } from '@/core/utils/email';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const PRODUCTS_SHEET_NAME = 'Products';
const ORDERS_SHEET_NAME = 'Orders';
const CUSTOMERS_SHEET_NAME = 'Customers';
const USERS_SHEET_NAME = 'Users';
const SETS_SHEET_NAME = 'Sets';
const SHOPS_SHEET_NAME = 'Shops';

const getShops = async (): Promise<Shop[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHOPS_SHEET_NAME}!A2:H`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    id: row[0],
    userId: row[1],
    name: row[2],
    slug: row[3],
    description: row[4],
    imageUrl: row[5],
    iconUrl: row[6],
    active: row[7] === 'TRUE',
  })).filter(shop => shop.active);
};

const getShopById = async (id: string): Promise<Shop | null> => {
  const shops = await getShops();
  return shops.find(shop => shop.id === id) || null;
};

const getShopBySlug = async (slug: string): Promise<Shop | null> => {
  const shops = await getShops();
  const decodedSlug = decodeURIComponent(slug);
  const foundShop = shops.find(shop => shop.slug === decodedSlug);
  return foundShop || null;
};

const getProductsByShop = async (shopId: string): Promise<Product[]> => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${PRODUCTS_SHEET_NAME}!A2:I`,
    });

    const values = response.data.values;
    console.log("getProductsByShop: Raw values from Google Sheet:", values);
    if (!values) {
      console.log("getProductsByShop: No values found in Google Sheet for products.");
      return [];
    }

    const products = values.map((row) => ({
      id: row[0],
      shopId: row[1],
      category: row[2],
      productName_EN: row[3],
      productName_HE: row[4],
      description: row[5],
      price: parseFloat(row[6]),
      imageUrl: row[7],
    }));

    const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());

    const filteredProducts = uniqueProducts.filter(product => product.shopId === shopId);
    console.log(`getProductsByShop: Filtered products for shopId ${shopId}:`, filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.error("Failed to fetch products from Google Sheets:", error);
    return [];
  }
};

const getUsers = async (): Promise<User[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${USERS_SHEET_NAME}!A2:G`,
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
    active: row[5] === 'active',
    deliveryFee: row[6] ? parseFloat(row[6]) : 0,
  })).filter(user => user.active);
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    const users = await getUsers();
    return users.find(u => u.email === email) || null;
};

const addProduct = async (product: Omit<Product, 'id' | 'shopId'>, shopId: string): Promise<Product> => {
  const newId = `PROD-${Date.now()}`;
  const newProduct: Product = { ...product, id: newId, shopId: shopId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A:I`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newProduct.id, newProduct.shopId, newProduct.category, newProduct.productName_EN, newProduct.productName_HE, newProduct.description, newProduct.price, newProduct.imageUrl]],
    },
  });

  return newProduct;
};

const getOrdersByShop = async (shopId: string): Promise<Order[]> => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ORDERS_SHEET_NAME}!A2:K`,
    });

    const values = response.data.values;
    if (!values) {
        return [];
    }

    const orders = values.map((row) => ({
        orderId: row[0],
        shopId: row[1],
        customerId: row[2],
        productsJSON: row[3],
        totalPrice: parseFloat(row[4]),
        orderDate: row[5],
        status: row[6] as 'בהמתנה' | 'בוצעה' | 'בוטלה',
        notes: row[7] || '',
        paymentStatus: (row[8] as 'שולם' | 'לא שולם') || 'לא שולם',
        deliveryRequired: row[9] === 'TRUE',
        originalSetId: row[10],
    }));

    return orders.filter(order => order.shopId === shopId);
};

const createOrderForShop = async (order: Omit<Order, 'orderId'>, shopId: string): Promise<Order> => {
    const newOrderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
        ...order,
        orderId: newOrderId,
        shopId: shopId,
    };

    const valuesToAppend = [
        newOrder.orderId,
        newOrder.shopId,
        newOrder.customerId,
        newOrder.productsJSON,
        newOrder.totalPrice,
        newOrder.orderDate,
        newOrder.status,
        newOrder.notes || '',
        newOrder.paymentStatus,
        newOrder.deliveryRequired ? 'TRUE' : 'FALSE',
        newOrder.originalSetId || '',
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${ORDERS_SHEET_NAME}!A:K`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [valuesToAppend],
        },
    });

    // Send notification email
    try {
        const shops = await getShops();
        const shop = shops.find(s => s.id === shopId);
        if (shop) {
            const users = await getUsers();
            const admin = users.find(u => u.userId === shop.userId);
            const customers = await getCustomersByShop(shopId);
            const customer = customers.find(c => c.customerId === newOrder.customerId);

            if (admin && customer) {
                await sendSellerNotificationEmail({
                    sellerEmail: admin.email,
                    order: newOrder,
                    customerInfo: customer,
                    seller: admin,
                });
            }
        }
    } catch (emailError) {
        console.error('Failed to send seller notification email:', emailError);
    }

    return newOrder;
};

const getCustomersByShop = async (shopId: string): Promise<Customer[]> => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CUSTOMERS_SHEET_NAME}!A2:G`,
    });

    const values = response.data.values;
    if (!values) {
        return [];
    }

    const customers = values.map((row) => ({
        customerId: row[0],
        shopId: row[1],
        fullName: row[2],
        phone: row[3],
        email: row[4],
        address: row[5],
    }));

    return customers.filter(customer => customer.shopId === shopId);
};

const getSetsByShop = async (shopId: string): Promise<Set[]> => {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SETS_SHEET_NAME}!A2:H`,
    });

    const values = response.data.values;
    if (!values) {
        return [];
    }

    const sets = values.map((row) => ({
        id: row[0],
        shopId: row[1],
        title: row[2],
        description: row[3],
        productsJson: JSON.parse(row[4] || '{}'),
        price: parseFloat(row[5]),
        imageUrl: row[6],
    }));

    return sets.filter(set => set.shopId === shopId);
};

const addCustomer = async (customer: Omit<Customer, 'customerId'>, shopId: string): Promise<Customer> => {
  const newCustomerId = `CUST-${Date.now()}`;
  const newCustomer: Customer = { ...customer, customerId: newCustomerId, shopId: shopId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${CUSTOMERS_SHEET_NAME}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newCustomer.customerId, newCustomer.shopId, newCustomer.fullName, newCustomer.phone, newCustomer.email, newCustomer.address]],
    },
  });

  return newCustomer;
};

const updateOrder = async (id: string, updates: Partial<Omit<Order, 'orderId' | 'shopId'>>, shopId: string): Promise<Order> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A:K`, // Fetch all rows
  });

  const values = response.data.values;
  if (!values || values.length < 2) {
    throw new Error(`No orders found in Google Sheet or sheet is empty.`);
  }

  let rowIndexToUpdate = -1;
  let existingOrder: Order | null = null;

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row && row[0] === id && row[1] === shopId) {
      rowIndexToUpdate = i;
      existingOrder = {
        orderId: row[0],
        shopId: row[1],
        customerId: row[2],
        productsJSON: row[3],
        totalPrice: parseFloat(row[4]),
        orderDate: row[5],
        status: row[6] as 'בהמתנה' | 'בוצעה' | 'בוטלה',
        notes: row[7] || '',
        paymentStatus: (row[8] as 'שולם' | 'לא שולם') || 'לא שולם',
        deliveryRequired: row[9] === 'TRUE',
        originalSetId: row[10],
      };
      break;
    }
  }

  if (rowIndexToUpdate === -1 || !existingOrder) {
    throw new Error(`Order with ID ${id} not found for shop ${shopId}`);
  }

  const updatedOrder: Order = { ...existingOrder, ...updates, shopId: shopId };
  const sheetRowNumber = rowIndexToUpdate + 1;

  const valuesToUpdate = [
    updatedOrder.orderId,
    updatedOrder.shopId,
    updatedOrder.customerId,
    updatedOrder.productsJSON,
    updatedOrder.totalPrice,
    updatedOrder.orderDate,
    updatedOrder.status,
    updatedOrder.notes || '',
    updatedOrder.paymentStatus,
    updatedOrder.deliveryRequired ? 'TRUE' : 'FALSE',
    updatedOrder.originalSetId || '',
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A${sheetRowNumber}:K${sheetRowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [valuesToUpdate],
    },
  });

  return updatedOrder;
};

const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'shopId'>>, shopId: string): Promise<Product> => {
  const products = await getProductsByShop(shopId);
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex === -1) {
    throw new Error(`Product with ID ${id} not found for shop ${shopId}`);
  }

  const existingProduct = products[productIndex];
  const updatedProduct: Product = { ...existingProduct, ...updates, shopId: shopId };

  const rowNumber = productIndex + 2; // +1 for 1-indexing, +1 for skipping header

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedProduct.id, updatedProduct.shopId, updatedProduct.category, updatedProduct.productName_EN, updatedProduct.productName_HE, updatedProduct.description, updatedProduct.price, updatedProduct.imageUrl]],
    },
  });

  return updatedProduct;
};

const deleteProduct = async (id: string, shopId: string): Promise<void> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A:I`, // Fetch all rows, including potential empty ones
  });

  const values = response.data.values;
  if (!values || values.length < 2) { // Less than 2 means only header or no data
    throw new Error(`No products found in Google Sheet or sheet is empty.`);
  }

  // Find the actual row index (0-indexed) in the 'values' array
  // We start searching from index 1 to skip the header row
  let rowIndexToDelete = -1;
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    // Ensure row has enough columns to represent a product
    if (row && row[0] === id && row[1] === shopId) { // Assuming id is in column A (index 0) and shopId in column B (index 1)
      rowIndexToDelete = i;
      break;
    }
  }

  if (rowIndexToDelete === -1) {
    throw new Error(`Product with ID ${id} not found for shop ${shopId}`);
  }

  // Google Sheets API is 1-indexed, and our 'values' array is 0-indexed,
  // so the actual sheet row number is rowIndexToDelete + 1.
  // We also need to account for the header row, which is already skipped by starting 'values' from A2.
  // So, if rowIndexToDelete is 0 (first data row), it's sheet row 2.
  const sheetRowNumber = rowIndexToDelete + 1;

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A${sheetRowNumber}:I${sheetRowNumber}`,
  });
};

const addSet = async (set: Omit<Set, 'id' | 'shopId'>, shopId: string): Promise<Set> => {
  const newId = `SET-${Date.now()}`;
  const newSet: Set = { ...set, id: newId, shopId: shopId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A:H`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newSet.id, newSet.shopId, newSet.title, newSet.description, JSON.stringify(newSet.productsJson), newSet.price, newSet.imageUrl]],
    },
  });

  return newSet;
};

const updateSet = async (id: string, updates: Partial<Omit<Set, 'id' | 'shopId'>>, shopId: string): Promise<Set> => {
  const sets = await getSetsByShop(shopId);
  const setIndex = sets.findIndex(set => set.id === id);

  if (setIndex === -1) {
    throw new Error(`Set with ID ${id} not found for shop ${shopId}`);
  }

  const existingSet = sets[setIndex];
  const updatedSet: Set = { ...existingSet, ...updates, shopId: shopId };

  const rowNumber = setIndex + 2; // +1 for 1-indexing, +1 for skipping header

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A${rowNumber}:H${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedSet.id, updatedSet.shopId, updatedSet.title, updatedSet.description, JSON.stringify(updatedSet.productsJson), updatedSet.price, updatedSet.imageUrl]],
    },
  });

  return updatedSet;
};

const deleteSet = async (id: string, shopId: string): Promise<void> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A:H`, // Fetch all rows, including potential empty ones
  });

  const values = response.data.values;
  if (!values || values.length < 2) { // Less than 2 means only header or no data
    throw new Error(`No sets found in Google Sheet or sheet is empty.`);
  }

  let rowIndexToDelete = -1;
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row && row[0] === id && row[1] === shopId) { // Assuming id is in column A (index 0) and shopId in column B (index 1)
      rowIndexToDelete = i;
      break;
    }
  }

  if (rowIndexToDelete === -1) {
    throw new Error(`Set with ID ${id} not found for shop ${shopId}`);
  }

  const sheetRowNumber = rowIndexToDelete + 1;

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A${sheetRowNumber}:H${sheetRowNumber}`,
  });
};

export const googleSheetService = {
    getShops,
    getShopById,
    getShopBySlug,
    getProductsByShop,
    getUsers,
    getUserByEmail,
    addProduct,
    getOrdersByShop,
    createOrderForShop,
    getCustomersByShop,
    getSetsByShop,
    addCustomer,
    updateOrder,
    updateProduct,
    deleteProduct,
    addSet,
    updateSet,
    deleteSet,
};