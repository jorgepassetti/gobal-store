import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: ShippingAddress = {
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  email: '',
  country: '',
  countryCode: '',
};

// Estado inicial
type ShippingAddress = {
  firstName: '';
  lastName: '';
  addressLine1: '';
  addressLine2: '';
  city: '';
  state: '';
  zipCode: '';
  phone: '';
  email: '';
  country: '';
  countryCode: '';
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
