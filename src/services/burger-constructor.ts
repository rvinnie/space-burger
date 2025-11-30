import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { TConstructorIngredient, TIngredient } from '@/shared/types/ingredient';
import type { PayloadAction } from '@reduxjs/toolkit';

type TBurgerConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TConstructorIngredient | null;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burger-constructor',
  initialState: initialState,
  selectors: {
    getBun: (state) => state.bun,
    getConstructorIngredients: (state) => state.ingredients,
  },
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const constructorElementId = nanoid();
        return { payload: { ...ingredient, constructorElementId } };
      },
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorElementId !== action.payload
      );
    },
    moveIngredients: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragIngredient = state.ingredients[dragIndex];
      const newIngredients = [...state.ingredients];

      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragIngredient);

      state.ingredients = newIngredients;
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { getBun, getConstructorIngredients } = burgerConstructorSlice.selectors;
export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredients,
  clearIngredients,
} = burgerConstructorSlice.actions;
