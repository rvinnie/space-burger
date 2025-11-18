import { createOrderAPI } from '@/api/space-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrderResponse } from '@/api/types';
import type { TConstructorIngredient } from '@/shared/types/ingredient';
import type { PayloadAction } from '@reduxjs/toolkit';

type TOrderDetailsState = {
  order: TOrderResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderDetailsState = {
  order: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order-details/createOrder',
  async (ingredients: TConstructorIngredient[]) => {
    const validIngredients = ingredients.filter(Boolean) as TConstructorIngredient[];
    const response = await createOrderAPI(validIngredients);
    return response.data;
  }
);

export const orderDetailsSlice = createSlice({
  name: 'order-details',
  initialState: initialState,
  selectors: {
    getOrderDetails: (state) => state.order,
    getOrderDetailsLoading: (state) => state.loading,
    getOrderDetailsError: (state) => state.error,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<TOrderResponse>) => {
        state.order = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.order = null;
        state.loading = false;
        state.error = action.error?.message || 'Unknown error';
      });
  },
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export const { getOrderDetails, getOrderDetailsError, getOrderDetailsLoading } =
  orderDetailsSlice.selectors;
