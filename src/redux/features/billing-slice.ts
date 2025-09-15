import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// types.ts (or inside your slice file)
export type BillingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressTwo: string;
  city: string;
  country: string;
  createAccount: boolean;
  password?: string;
  retypePassword?: string;
};

const initialState: BillingAddress = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  addressTwo: '',
  city: '',
  country: 'Argentina',
  createAccount: false,
  password: undefined,
  retypePassword: undefined,
};

export const billing = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBillingAddress: (
      state,
      action: PayloadAction<Partial<BillingAddress>>,
    ) => {
      return { ...state, ...action.payload };
    },
    clearBillingAddress: () => initialState,
  },
});

// Selectors
export const selectBillingAddress = (state: RootState) => state.billingReducer;

// Actions
export const { setBillingAddress, clearBillingAddress } = billing.actions;

// Reducer
export default billing.reducer;
