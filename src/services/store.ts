import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {
  useDispatch as useDispatchRedux,
  useSelector as useSelectorRedux,
} from 'react-redux';

import { burgerConstructorSlice } from './burder-constructor';
import { burgerIngredientsSlice } from './burger-ingredients';
import { ingredientDetailsSlice } from './ingredient-details';
import { orderDetailsSlice } from './order-details';
import { userSlice } from './user';

const rootReducer = combineSlices(
  burgerConstructorSlice,
  burgerIngredientsSlice,
  ingredientDetailsSlice,
  orderDetailsSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = useDispatchRedux.withTypes<AppDispatch>();
export const useSelector = useSelectorRedux.withTypes<RootState>();
