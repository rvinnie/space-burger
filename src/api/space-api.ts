import { clearTokens, getToken, setTokens } from '@/utils/token';
import axios from 'axios';

import type { TIngredient } from '@/shared/types/ingredient';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import type {
  TAuthResponse,
  TIngredientsResponse,
  TLoginRequest,
  TMessageResponse,
  TOrderResponse,
  TRegisterRequest,
  TResetPassword,
  TUserResponse,
} from './types';

const BASE_URL = 'https://norma.education-services.ru/api';

type CustomAxiosRequestConfig = {
  requiresAuth?: boolean;
  _retry?: boolean;
} & AxiosRequestConfig;

type ApiError = {
  message: string;
  success?: boolean;
  errors?: { field: string; message: string }[] | string[];
  [key: string]: unknown;
};

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as InternalAxiosRequestConfig & CustomAxiosRequestConfig;
    const token = getToken('accessToken');
    if (token && customConfig.requiresAuth) {
      config.headers = customConfig.headers || {};
      config.headers.Authorization = token;
    }
    return customConfig;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig &
      CustomAxiosRequestConfig;
    const errorData = error.response?.data as ApiError | undefined;

    if (
      errorData?.message === 'jwt expired' &&
      originalRequest.requiresAuth &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getToken('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await refreshTokenAPI();
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        setTokens(newAccessToken, newRefreshToken);

        return instance(originalRequest);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const getIngredientsAPI = (): Promise<AxiosResponse<TIngredientsResponse>> => {
  return instance.get('/ingredients');
};

export const createOrderAPI = (
  ingredients: TIngredient[]
): Promise<AxiosResponse<TOrderResponse>> => {
  return instance.post('/orders', { ingredients }, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
};

export const forgotPasswordAPI = (
  email: string
): Promise<AxiosResponse<TMessageResponse>> => {
  return instance.post('/password-reset', { email });
};

export const resetPasswordAPI = ({
  password,
  token,
}: TResetPassword): Promise<AxiosResponse<TMessageResponse>> => {
  return instance.post('/password-reset/reset', { password, token });
};

export const registerAPI = (
  userData: TRegisterRequest
): Promise<AxiosResponse<TAuthResponse>> => {
  return instance.post('/auth/register', userData);
};

export const loginAPI = (
  userData: TLoginRequest
): Promise<AxiosResponse<TAuthResponse>> => {
  return instance.post('/auth/login', userData);
};

export const logoutAPI = (): Promise<AxiosResponse<TMessageResponse>> => {
  return instance.post('/auth/logout', { token: getToken('refreshToken') });
};

export const refreshTokenAPI = (): Promise<
  AxiosResponse<Omit<TAuthResponse, 'user'>>
> => {
  return instance.post('/auth/token', { token: getToken('refreshToken') });
};

export const getUserAPI = (): Promise<AxiosResponse<TUserResponse>> => {
  return instance.get('/auth/user', { requiresAuth: true } as CustomAxiosRequestConfig);
};

export const updateUserAPI = (
  userData: TRegisterRequest
): Promise<AxiosResponse<TUserResponse>> => {
  return instance.patch('/auth/user', userData, {
    requiresAuth: true,
  } as CustomAxiosRequestConfig);
};
