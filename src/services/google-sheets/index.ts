import { sheets } from './client';
import type { Product, Order, Customer, User, Cart, CustomerInfo } from '@/core/types';
import type { Set } from '@/features/sets/types';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const PRODUCTS_SHEET_NAME = 'Products';
const ORDERS_SHEET_NAME = 'Orders';
const CUSTOMERS_SHEET_NAME = 'Customers';
const USERS_SHEET_NAME = 'Users';
const SETS_SHEET_NAME = 'Sets';

const getProducts = async (userId: string | null): Promise<Product[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A2:I`, // Assuming userId is in column I
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  const products = values.map((row) => ({
    id: row[0],
    userId: row[1], // Assuming userId is in column B
    category: row[2],
    productName_EN: row[3],
    productName_HE: row[4],
    description: row[5],
    price: parseFloat(row[6]),
    imageURL: row[7],
  }));

  return userId ? products.filter(product => product.userId === userId) : [];
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
    status: row[5],
    deliveryFee: row[6] ? parseFloat(row[6]) : 0,
  }));
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${USERS_SHEET_NAME}!A2:G`,

  });

  const values = response.data.values;
  if (!values) {
    return null;
  }

  const users = values.map((row) => ({
    userId: row[0],
    username: row[1],
    email: row[2],
    passwordHash: row[3],
    role: row[4] as 'admin' | 'user',
    status: row[5],
    deliveryFee: row[6] ? parseFloat(row[6]) : 0,
  }));

  return users.filter(u => u.email === email)[0];
};

const addProduct = async (product: Omit<Product, 'id' | 'userId'>, userId: string): Promise<Product> => {
  const newId = `PROD-${Date.now()}`;
  const newProduct: Product = { ...product, id: newId, userId: userId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A:I`, // Assuming userId is in column B
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newProduct.id, newProduct.userId, newProduct.category, newProduct.productName_EN, newProduct.productName_HE, newProduct.description, newProduct.price, newProduct.imageURL]],
    },
  });

  return newProduct;
};

const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'userId'>>, userId: string): Promise<Product> => {
  const products = await getProducts(userId); // getProducts already filters by userId
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    throw new Error('Product not found or you do not have permission to update it.');
  }

  const productToUpdate = products[productIndex];
  const updatedProduct = { ...productToUpdate, ...updates, userId: userId }; // Ensure userId is not changed

  const allProducts = await getAllProductsRaw(); // Get all products to find the correct row index
  const actualProductIndex = allProducts.findIndex(p => p.id === id && p.userId === userId);
  if (actualProductIndex === -1) {
    throw new Error('Product not found or you do not have permission to update it.');
  }

  const range = `${PRODUCTS_SHEET_NAME}!A${actualProductIndex + 2}:I${actualProductIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedProduct.id, updatedProduct.userId, updatedProduct.category, updatedProduct.productName_EN, updatedProduct.productName_HE, updatedProduct.description, updatedProduct.price, updatedProduct.imageURL]],
    },
  });

  return updatedProduct;
};

// Helper to get all products without userId filtering for internal use
const getAllProductsRaw = async (): Promise<Product[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PRODUCTS_SHEET_NAME}!A2:I`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    id: row[0],
    userId: row[1],
    category: row[2],
    productName_EN: row[3],
    productName_HE: row[4],
    description: row[5],
    price: parseFloat(row[6]),
    imageURL: row[7],
  }));
};

const deleteProduct = async (id: string, userId: string): Promise<void> => {
  const allProducts = await getAllProductsRaw();
  const productIndex = allProducts.findIndex((p) => p.id === id && p.userId === userId);
  if (productIndex === -1) {
    throw new Error('Product not found or you do not have permission to delete it.');
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

const addOrder = async (order: Omit<Order, 'orderId' | 'orderDate' | 'status' | 'paymentStatus' | 'userId' | 'deliveryRequired'> & { status?: 'בהמתנה' | 'בוצעה' | 'בוטלה', paymentStatus?: 'שולם' | 'לא שולם', deliveryRequired?: boolean }, userId: string): Promise<Order> => {
  const newOrderId = `ORD-${Date.now()}`;
  const newOrder: Order = { ...order, orderId: newOrderId, userId: userId, deliveryRequired: order.deliveryRequired ?? false }; // Default to false if not provided

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A:J`, // Updated range to J
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newOrder.orderId, newOrder.userId, newOrder.customerId, newOrder.productsJSON, newOrder.totalPrice, newOrder.orderDate, newOrder.status, newOrder.notes || '', newOrder.paymentStatus, newOrder.deliveryRequired ? 'TRUE' : 'FALSE']], // Added deliveryRequired
    },
  });

  return newOrder;
};


const getCustomers = async (userId: string | null): Promise<Customer[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${CUSTOMERS_SHEET_NAME}!A2:F`, // Assuming userId is in column F
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  const customers = values.map((row) => ({
    customerId: row[0],
    userId: row[1],
    fullName: row[2],
    phone: row[3],
    email: row[4],
    address: row[5],
  }));

  return userId ? customers.filter(customer => customer.userId === userId) : [];
};

const addCustomer = async (customer: Omit<Customer, 'customerId' | 'userId'>, userId: string): Promise<Customer> => {
  const newCustomerId = `CUST-${Date.now()}`;
  const newCustomer: Customer = { ...customer, customerId: newCustomerId, userId: userId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${CUSTOMERS_SHEET_NAME}!A:F`, // Assuming userId is in column B
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newCustomer.customerId, newCustomer.userId, newCustomer.fullName, newCustomer.phone, newCustomer.email, newCustomer.address]],
    },
  });

  return newCustomer;
};

const updateCustomer = async (id: string, updates: Partial<Omit<Customer, 'customerId' | 'userId'>>, userId: string): Promise<Customer> => {
  const customers = await getCustomers(userId); // getCustomers already filters by userId
  const customerIndex = customers.findIndex((c) => c.customerId === id);
  if (customerIndex === -1) {
    throw new Error('Customer not found or you do not have permission to update it.');
  }

  const customerToUpdate = customers[customerIndex];
  const updatedCustomer = { ...customerToUpdate, ...updates, userId: userId }; // Ensure userId is not changed

  const allCustomers = await getAllCustomersRaw(); // Get all customers to find the correct row index
  const actualCustomerIndex = allCustomers.findIndex(c => c.customerId === id && c.userId === userId);
  if (actualCustomerIndex === -1) {
    throw new Error('Customer not found or you do not have permission to update it.');
  }

  const range = `${CUSTOMERS_SHEET_NAME}!A${actualCustomerIndex + 2}:F${actualCustomerIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedCustomer.customerId, updatedCustomer.userId, updatedCustomer.fullName, updatedCustomer.phone, updatedCustomer.email, updatedCustomer.address]],
    },
  });

  return updatedCustomer;
};

// Helper to get all customers without userId filtering for internal use
const getAllCustomersRaw = async (): Promise<Customer[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${CUSTOMERS_SHEET_NAME}!A2:F`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    customerId: row[0],
    userId: row[1],
    fullName: row[2],
    phone: row[3],
    email: row[4],
    address: row[5],
  }));
};

const getOrders = async (userId: string | null): Promise<Order[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A2:J`, // Updated range to J
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  const orders = values.map((row) => ({
    orderId: row[0],
    userId: row[1],
    customerId: row[2],
    productsJSON: row[3],
    totalPrice: parseFloat(row[4]),
    orderDate: row[5],
    status: row[6] as 'בהמתנה' | 'בוצעה' | 'בוטלה',
    notes: row[7] || '',
    paymentStatus: (row[8] as 'שולם' | 'לא שולם') || 'לא שולם',
    deliveryRequired: row[9] === 'TRUE', // New: Parse boolean from string
  }));

  return userId ? orders.filter(order => order.userId === userId) : [];
};


const updateOrder = async (id: string, updates: Partial<Omit<Order, 'orderId' | 'userId'>>, userId: string): Promise<Order> => {
  const orders = await getOrders(userId); // getOrders already filters by userId
  const orderIndex = orders.findIndex((o) => o.orderId === id);
  if (orderIndex === -1) {
    throw new Error('Order not found or you do not have permission to update it.');
  }

  const orderToUpdate = orders[orderIndex];
  const updatedOrder = { ...orderToUpdate, ...updates, userId: userId }; // Ensure userId is not changed

  const allOrders = await getAllOrdersRaw(); // Get all orders to find the correct row index
  const actualOrderIndex = allOrders.findIndex(o => o.orderId === id && o.userId === userId);
  if (actualOrderIndex === -1) {
    throw new Error('Order not found or you do not have permission to update it.');
  }

  const range = `${ORDERS_SHEET_NAME}!A${actualOrderIndex + 2}:J${actualOrderIndex + 2}`; // Updated range to J

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedOrder.orderId, updatedOrder.userId, updatedOrder.customerId, updatedOrder.productsJSON, updatedOrder.totalPrice, updatedOrder.orderDate, updatedOrder.status, updatedOrder.notes || '', updatedOrder.paymentStatus, updatedOrder.deliveryRequired ? 'TRUE' : 'FALSE']], // Added deliveryRequired
    },
  });

  return updatedOrder;
};


// Helper to get all orders without userId filtering for internal use
const getAllOrdersRaw = async (): Promise<Order[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${ORDERS_SHEET_NAME}!A2:J`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    orderId: row[0],
    userId: row[1],
    customerId: row[2],
    productsJSON: row[3],
    totalPrice: parseFloat(row[4]),
    orderDate: row[5],
    status: row[6] as 'בהמתנה' | 'בוצעה' | 'בוטלה',
    notes: row[7] || '',
    paymentStatus: (row[8] as 'שולם' | 'לא שולם') || 'לא שולם',
    deliveryRequired: row[9] === 'TRUE', // New: Parse boolean from string
  }));
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

const getSets = async (userId: string | null): Promise<Set[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A2:G`, // Assuming userId is in column G
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  const sets = values.map((row) => {
    return ({
      id: row[0],
      userId: row[1],
      title: row[2],
      description: row[3],
      productsJson: (() => {
        try {
          return JSON.parse(row[4] || '{}');
        } catch (e) {
          console.warn(`Invalid JSON in productsJson for set ID ${row[0]}:`, row[4], e);
          return {}; // Default to empty object on error
        }
      })(),
      price: parseFloat(row[5]),
      imageUrl: row[6],
    });
  });

  return userId ? sets.filter(set => set.userId === userId) : [];
};

const addSet = async (set: Omit<Set, 'id' | 'userId'>, userId: string): Promise<Set> => {
  const newId = `SET-${Date.now()}`;
  const newSet: Set = { ...set, id: newId, userId: userId };

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A:G`, // Assuming userId is in column B
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newSet.id, newSet.userId, newSet.title, newSet.description, JSON.stringify(newSet.productsJson), newSet.price, newSet.imageUrl]],
    },
  });

  return newSet;
};

const updateSet = async (id: string, updates: Partial<Omit<Set, 'id' | 'userId'>>, userId: string): Promise<Set> => {
  const sets = await getSets(userId); // getSets already filters by userId
  const setIndex = sets.findIndex((s) => s.id === id);
  if (setIndex === -1) {
    throw new Error('Set not found or you do not have permission to update it.');
  }

  const setToUpdate = sets[setIndex];
  const updatedSet = { ...setToUpdate, ...updates, userId: userId }; // Ensure userId is not changed

  const allSets = await getAllSetsRaw(); // Get all sets to find the correct row index
  const actualSetIndex = allSets.findIndex(s => s.id === id && s.userId === userId);
  if (actualSetIndex === -1) {
    throw new Error('Set not found or you do not have permission to update it.');
  }

  const range = `${SETS_SHEET_NAME}!A${actualSetIndex + 2}:G${actualSetIndex + 2}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[updatedSet.id, updatedSet.userId, updatedSet.title, updatedSet.description, JSON.stringify(updatedSet.productsJson), updatedSet.price, updatedSet.imageUrl]],
    },
  });

  return updatedSet;
};

const deleteSet = async (id: string, userId: string): Promise<void> => {
  const allSets = await getAllSetsRaw();
  const setIndex = allSets.findIndex((s) => s.id === id && s.userId === userId);
  if (setIndex === -1) {
    throw new Error('Set not found or you do not have permission to delete it.');
  }

  const sheetId = await getSheetId(SETS_SHEET_NAME);
  if (sheetId === null) {
    throw new Error(`Sheet '${SETS_SHEET_NAME}' not found.`);
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
              startIndex: setIndex + 1,
              endIndex: setIndex + 2,
            },
          },
        },
      ],
    },
  });
};

// Helper to get all sets without userId filtering for internal use
const getAllSetsRaw = async (): Promise<Set[]> => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SETS_SHEET_NAME}!A2:G`,
  });

  const values = response.data.values;
  if (!values) {
    return [];
  }

  return values.map((row) => ({
    id: row[0],
    userId: row[1],
    title: row[2],
    description: row[3],
    productsJson: (() => {
      try {
        return JSON.parse(row[4] || '{}');
      } catch (e) {
        console.warn(`Invalid JSON in productsJson for set ID ${row[0]}:`, row[4], e);
        return {}; // Default to empty object on error
      }
    })(),
    price: parseFloat(row[5]),
    imageUrl: row[6],
  }));
};

export const googleSheetService = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsRaw,
  getCustomers,
  addCustomer,
  updateCustomer,
  getAllCustomersRaw,
  getOrders,
  addOrder,
  updateOrder,
  getAllOrdersRaw,
  getUsers,
  getUserByEmail,
  getSets,
  addSet,
  updateSet,
  deleteSet,
  getAllSetsRaw,
};