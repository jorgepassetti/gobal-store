import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type InitialState = {
  items: CartItem[];
};

type CartItem = {
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

// ... tus imports y tipos

const initialState: InitialState = {
  items: [],
};

// Cargar estado inicial desde localStorage si existe
const savedCart = window?.localStorage
  ? window.localStorage.getItem('cart')
  : null;
if (savedCart) {
  try {
    initialState.items = JSON.parse(savedCart);
  } catch (e) {
    console.error('Error al cargar el carrito desde localStorage', e);
    initialState.items = [];
  }
}

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

      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
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

      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeAllItemsFromCart: (state) => {
      state.items = [];

      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
