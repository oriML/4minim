'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/core/types';

// Define state and action types
interface AppState {
  currentUser: { name: string; email: string; role: string } | null;
  cart: Product[];
  orderStatus: 'idle' | 'pending' | 'success' | 'error';
}

type Action = 
  | { type: 'SET_USER'; payload: AppState['currentUser'] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string } // by product id
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER_STATUS'; payload: AppState['orderStatus'] };

// Initial state
const initialState: AppState = {
  currentUser: null,
  cart: [],
  orderStatus: 'idle',
};

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_TO_CART':
      // Avoid duplicates
      if (state.cart.find(p => p.id === action.payload.id)) return state;
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(p => p.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_ORDER_STATUS':
      return { ...state, orderStatus: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
