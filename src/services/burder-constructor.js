import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burger-constructor',
  initialState: initialState,
  selectors: {
    getBun: (state) => state.bun,
    getIngredients: (state) => state.ingredients,
  },
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient) => {
        const constructorElementId = nanoid();
        return { payload: { ...ingredient, constructorElementId } };
      },
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorElementId !== action.payload
      );
    },
  },
});

export const { getBun, getIngredients } = burgerConstructorSlice.selectors;
export const { setBun, addIngredient, removeIngredient } =
  burgerConstructorSlice.actions;
