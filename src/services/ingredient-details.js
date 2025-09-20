import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
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
      reducer: (state, action) => {
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
