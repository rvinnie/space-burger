import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { TIngredient } from '@/shared/types/ingredient';
import type { PayloadAction } from '@reduxjs/toolkit';

type TIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredient-details',
  initialState: initialState,
  selectors: {
    getIngredient: (state) => state.ingredient,
  },
  reducers: {
    setIngredient: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        state.ingredient = action.payload;
      },
      prepare: (ingredient) => {
        return { payload: { ...ingredient, extraId: nanoid() } };
      },
    },
  },
});

export const { getIngredient } = ingredientDetailsSlice.selectors;
export const { setIngredient } = ingredientDetailsSlice.actions;
