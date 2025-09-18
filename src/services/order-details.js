import { createOrderAPI } from '@/api/space-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  order: null,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order-details/createOrder',
  async (ingredients) => {
    const response = await createOrderAPI(ingredients);
    return response.data;
  }
);

export const orderDetailsSlice = createSlice({
  name: 'order-details',
  initialState: initialState,
  selectors: {
    getOrderDetails: (state) => state.order,
    getOrderDetailsError: (state) => state.error,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.order = null;
        state.error = action.error?.message || 'Unknown error';
      });
  },
});

export const { getOrderDetails, getOrderDetailsError } = orderDetailsSlice.selectors;
