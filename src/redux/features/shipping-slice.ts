import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: ShippingAddress = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
};

// Estado inicial
export type ShippingAddress = {
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
};

export const shipping = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    setShippingAddress: (
      state,
      action: PayloadAction<Partial<ShippingAddress>>,
    ) => {
      return { ...state, ...action.payload };
    },
    clearShippingAddress: (state) => {
      return initialState;
    },
  },
});

// Selectores
export const selectShippingAddress = (state: RootState) =>
  state.shippingReducer;

// Actions
export const { setShippingAddress, clearShippingAddress } = shipping.actions;

// Reducer exportado
export default shipping.reducer;
