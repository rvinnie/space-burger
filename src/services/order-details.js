import { createOrderAPI } from '@/api/space-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  order: null,
  loading: false,
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
      .addCase(createOrder.fulfilled, (state, action) => {
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
