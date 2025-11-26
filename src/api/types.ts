import type { TIngredient } from '@/shared/types/ingredient';
import type { AxiosError } from 'axios';

export const BASE_HTTP_URL = 'https://norma.education-services.ru/api';
export const BASE_WS_URL = 'wss://norma.education-services.ru/orders';

type TLoginRequest = {
  email: string;
  password: string;
};

type TRegisterRequest = {
  email: string;
  name: string;
  password: string;
};

type TResetPassword = {
  password: string;
  token: string;
};

type TUser = {
  email: string;
  name: string;
};

type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

type TOrderOwner = {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type TCreateOrder = {
  ingredients: TIngredient[];
  _id: string;
  owner: TOrderOwner;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

type TCreateOrderResponse = {
  success: boolean;
  name: string;
  order: TCreateOrder;
};

type TFindOrder = {
  _id: string;
  ingredients: string[];
  owner: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

type TFoundOrderResponse = {
  success: boolean;
  orders: TFindOrder[];
  total: number;
  totalToday: number;
};

type TUserResponse = {
  success: boolean;
  user: TUser;
};

type TMessageResponse = {
  success: boolean;
  message: string;
};

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

type TApiError = {
  message: string;
  success?: boolean;
  [key: string]: unknown;
};

type TAxiosErrorWithApiResponse = AxiosError<TApiError>;

export type {
  TLoginRequest,
  TRegisterRequest,
  TResetPassword,
  TUser,
  TAuthResponse,
  TCreateOrderResponse,
  TFoundOrderResponse,
  TFindOrder,
  TUserResponse,
  TMessageResponse,
  TIngredientsResponse,
  TAxiosErrorWithApiResponse,
  TApiError,
};
