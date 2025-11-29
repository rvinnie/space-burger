import { createAction, createSlice } from '@reduxjs/toolkit';

import type { TFoundOrderResponse } from '@/api/types';

export const connectProfileOrders = createAction<string, 'profile-orders/connect'>(
  'profile-orders/connect'
);
export const disconnectProfileOrders = createAction('profile-orders/disconnect');
export const onErrorProfileOrders = createAction<string, 'profile-orders/onerror'>(
  'profile-orders/onerror'
);
export const onMessageProfileOrders = createAction<
  TFoundOrderResponse,
  'profile-orders/onmessage'
>('profile-orders/onmessage');
export const onConnectingProfileOrders = createAction('profile-orders/onconnecting');

type TProfileOrdersState = {
  orders: TFoundOrderResponse | null;
  error: string | null;
  isConnecting: boolean;
};

const initialState: TProfileOrdersState = {
  orders: null,
  error: null,
  isConnecting: false,
};

export const profileOrdersSlice = createSlice({
  name: 'profile-orders',
  initialState: initialState,
  selectors: {
    getProfileOrders: (state) => state.orders,
    getProfileOrdersError: (state) => state.error,
    getProfileOrdersIsConnecting: (state) => state.isConnecting,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onErrorProfileOrders, (state, action) => {
        state.error = action.payload;
        state.isConnecting = false;
      })
      .addCase(onMessageProfileOrders, (state, action) => {
        state.orders = action.payload;
        state.isConnecting = false;
      })
      .addCase(onConnectingProfileOrders, (state) => {
        state.isConnecting = true;
      });
  },
});

export const { getProfileOrders, getProfileOrdersError, getProfileOrdersIsConnecting } =
  profileOrdersSlice.selectors;
