import { createOrderAPI, findOrderAPI } from '@/api/space-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TCreateOrderResponse, TFoundOrderResponse } from '@/api/types';
import type { TConstructorIngredient } from '@/shared/types/ingredient';
import type { PayloadAction } from '@reduxjs/toolkit';

type TOrderDetailsState = {
  createdOrder: TCreateOrderResponse | null;
  createLoading: boolean;
  createError: string | null;

  foundOrder: TFoundOrderResponse | null;
  findLoading: boolean;
  findError: string | null;
};

const initialState: TOrderDetailsState = {
  createdOrder: null,
  createLoading: false,
  createError: null,

  foundOrder: null,
  findLoading: false,
  findError: null,
};

export const createOrder = createAsyncThunk(
  'order-details/createOrder',
  async (ingredients: TConstructorIngredient[]) => {
    const validIngredients = ingredients.filter(Boolean) as TConstructorIngredient[];
    const response = await createOrderAPI(validIngredients);
    return response.data;
  }
);

export const findOrder = createAsyncThunk(
  'order-details/findOrder',
  async (orderNum: string) => {
    const response = await findOrderAPI(orderNum);
    return response.data;
  }
);

export const orderDetailsSlice = createSlice({
  name: 'order-details',
  initialState: initialState,
  selectors: {
    getCreatedOrderDetails: (state) => state.createdOrder,
    getCreateOrderDetailsLoading: (state) => state.createLoading,
    getCreateOrderDetailsError: (state) => state.createError,
    getFoundOrderDetails: (state) => state.foundOrder,
    getFindOrderDetailsLoading: (state) => state.findLoading,
    getFindOrderDetailsError: (state) => state.findError,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.createdOrder = null;
      state.createLoading = false;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createError = null;
        state.createLoading = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TCreateOrderResponse>) => {
          state.createdOrder = action.payload;
          state.createLoading = false;
          state.createError = null;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.createdOrder = null;
        state.createLoading = false;
        state.createError = action.error?.message || 'Unknown error';
      })
      .addCase(findOrder.pending, (state) => {
        state.findError = null;
        state.findLoading = true;
      })
      .addCase(
        findOrder.fulfilled,
        (state, action: PayloadAction<TFoundOrderResponse>) => {
          state.foundOrder = action.payload;
          state.findLoading = false;
          state.findError = null;
        }
      )
      .addCase(findOrder.rejected, (state, action) => {
        state.foundOrder = null;
        state.findLoading = false;
        state.findError = action.error?.message || 'Unknown error';
      });
  },
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export const {
  getCreatedOrderDetails,
  getCreateOrderDetailsError,
  getCreateOrderDetailsLoading,
  getFoundOrderDetails,
  getFindOrderDetailsLoading,
  getFindOrderDetailsError,
} = orderDetailsSlice.selectors;
