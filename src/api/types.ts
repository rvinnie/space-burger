import type { TIngredient } from '@/shared/types/ingredient';
import type { AxiosError } from 'axios';

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

type TOrder = {
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

type TOrderResponse = {
  success: boolean;
  name: string;
  order: TOrder;
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
  TOrderOwner,
  TOrder,
  TOrderResponse,
  TUserResponse,
  TMessageResponse,
  TIngredientsResponse,
  TAxiosErrorWithApiResponse,
  TApiError,
};
