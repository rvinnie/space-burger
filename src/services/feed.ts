import { createAction, createSlice } from '@reduxjs/toolkit';

import type { TFoundOrderResponse } from '@/api/types';

export const connectFeed = createAction<string, 'feed/connect'>('feed/connect');
export const disconnectFeed = createAction('feed/disconnect');
export const onErrorFeed = createAction<string, 'feed/onerror'>('feed/onerror');
export const onMessageFeed = createAction<TFoundOrderResponse, 'feed/onmessage'>(
  'feed/onmessage'
);
export const onConnectingFeed = createAction('feed/onconnecting');

type TFeedState = {
  orders: TFoundOrderResponse | null;
  error: string | null;
  isConnecting: boolean;
};

const initialState: TFeedState = {
  orders: null,
  error: null,
  isConnecting: false,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState: initialState,
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedError: (state) => state.error,
    getFeedIsConnecting: (state) => state.isConnecting,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(onErrorFeed, (state, action) => {
        state.error = action.payload;
        state.isConnecting = false;
      })
      .addCase(onMessageFeed, (state, action) => {
        state.orders = action.payload;
        state.isConnecting = false;
      })
      .addCase(onConnectingFeed, (state) => {
        state.isConnecting = true;
      });
  },
});

export const { getFeedOrders, getFeedIsConnecting, getFeedError } = feedSlice.selectors;
