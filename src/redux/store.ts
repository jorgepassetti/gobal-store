import { configureStore } from '@reduxjs/toolkit';

import quickViewReducer from './features/quickView-slice';
import cartReducer from './features/cart-slice';
import shippingReducer from './features/shipping-slice';
import billingReducer from './features/billing-slice';
import wishlistReducer from './features/wishlist-slice';
import productDetailsReducer from './features/product-details';

import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
    shippingReducer,
    billingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
