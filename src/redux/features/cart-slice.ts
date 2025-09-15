// cart-slice.ts

import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type InitialState = {
  items: CartItem[];
};

export type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
};

// ✅ Estado inicial simple y seguro para SSR
const initialState: InitialState = {
  items: [], // Siempre empieza vacío en el servidor
};

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs } =
        action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          discountedPrice,
          imgs,
        });
      }
      // ❌ Elimina localStorage.setItem de aquí
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      // ❌ Elimina localStorage.setItem de aquí
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      // ❌ Elimina localStorage.setItem de aquí
    },
    removeAllItemsFromCart: (state) => {
      state.items = [];
      // ❌ Elimina localStorage.setItem de aquí
    },
    // ✅ Nueva acción: Hidrata el carrito desde el cliente
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

// ✅ Exporta la nueva acción
export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  hydrateCart, // <-- Asegúrate de exportarla
} = cart.actions;

export default cart.reducer;
