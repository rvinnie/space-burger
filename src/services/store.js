import { configureStore, combineSlices } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burder-constructor';
import { burgerIngredientsSlice } from './burger-ingredients';
import { ingredientDetailsSlice } from './ingredient-details';
import { orderDetailsSlice } from './order-details';

const rootReducer = combineSlices(
  burgerConstructorSlice,
  burgerIngredientsSlice,
  ingredientDetailsSlice,
  orderDetailsSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
