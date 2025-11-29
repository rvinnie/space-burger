import { getIngredientsAPI } from '@/api/space-api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TIngredientsResponse } from '@/api/types';
import type { TIngredient } from '@/shared/types/ingredient';
import type { PayloadAction } from '@reduxjs/toolkit';

type TBurgerIngredientsState = {
  ingredients: TIngredientsResponse | null;
  ingredientsMap: Record<string, TIngredient>;
  loading: boolean;
  error: string | null;
};

const initialState: TBurgerIngredientsState = {
  ingredients: null,
  ingredientsMap: {},
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
    getIngredientsMap: (state) => state.ingredientsMap,
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
      .addCase(
        loadIngredients.fulfilled,
        (state, action: PayloadAction<TIngredientsResponse>) => {
          state.ingredients = action.payload;

          state.ingredientsMap = action.payload.data.reduce(
            (acc, ingredient) => {
              acc[ingredient._id] = ingredient;
              return acc;
            },
            {} as Record<string, TIngredient>
          );

          state.loading = false;
          state.error = null;
        }
      )
      .addCase(loadIngredients.rejected, (state, action) => {
        state.error = action.error?.message || 'Unknown error';
        state.ingredients = null;
        state.ingredientsMap = {};
        state.loading = false;
      });
  },
});

export const {
  getIngredients,
  getIngredientsMap,
  getIngredientsLoading,
  getIngredientsError,
} = burgerIngredientsSlice.selectors;
