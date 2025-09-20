import { getIngredientsAPI } from '@/api/space-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  ingredients: [],
  loading: true,
  error: null,
};

export const loadIngredients = createAsyncThunk(
  'burger-ingredients/loadIngredients',
  async () => {
    const response = await getIngredientsAPI();
    return response.data;
  }
);

export const burgerIngredientsSlice = createSlice({
  name: 'burger-ingredients',
  initialState: initialState,
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsLoading: (state) => state.loading,
    getIngredientsError: (state) => state.error,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.ingredients = [];
        state.loading = false;
      });
  },
});

export const { getIngredients, getIngredientsLoading, getIngredientsError } =
  burgerIngredientsSlice.selectors;
