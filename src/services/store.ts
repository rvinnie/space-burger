import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {
  useDispatch as useDispatchRedux,
  useSelector as useSelectorRedux,
} from 'react-redux';

import { burgerConstructorSlice } from './burger-constructor';
import { burgerIngredientsSlice } from './burger-ingredients';
import {
  connectFeed,
  disconnectFeed,
  feedSlice,
  onErrorFeed,
  onMessageFeed,
  onConnectingFeed,
} from './feed';
import { ingredientDetailsSlice } from './ingredient-details';
import { socketMiddleware } from './middleware/socket';
import { orderDetailsSlice } from './order-details';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  onConnectingProfileOrders,
  onErrorProfileOrders,
  onMessageProfileOrders,
  profileOrdersSlice,
} from './profile-orders';
import { userSlice } from './user';

const rootReducer = combineSlices(
  burgerConstructorSlice,
  burgerIngredientsSlice,
  feedSlice,
  profileOrdersSlice,
  ingredientDetailsSlice,
  orderDetailsSlice,
  userSlice
);

const feedMiddleware = socketMiddleware({
  connect: connectFeed,
  disconnect: disconnectFeed,
  onMessage: onMessageFeed,
  onError: onErrorFeed,
  onConnecting: onConnectingFeed,
});

const profileOrdersMiddleware = socketMiddleware(
  {
    connect: connectProfileOrders,
    disconnect: disconnectProfileOrders,
    onMessage: onMessageProfileOrders,
    onError: onErrorProfileOrders,
    onConnecting: onConnectingProfileOrders,
  },
  true
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = useDispatchRedux.withTypes<AppDispatch>();
export const useSelector = useSelectorRedux.withTypes<RootState>();
