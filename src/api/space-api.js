import { clearTokens, getToken, setTokens } from '@/utils/token';
import axios from 'axios';

const BASE_URL = 'https://norma.nomoreparties.space/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;

instance.interceptors.request.use(
  (config) => {
    const token = getToken('accessToken');
    if (token && config.requiresAuth) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.data?.message === 'jwt expired' &&
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

export const getIngredientsAPI = () => {
  return instance.get('/ingredients');
};

export const createOrderAPI = (ingredients) => {
  return instance.post('/orders', { ingredients }, { requiresAuth: true });
};

export const forgotPasswordAPI = (email) => {
  return instance.post('/password-reset', { email });
};

export const resetPasswordAPI = ({ password, token }) => {
  return instance.post('/password-reset/reset', { password, token });
};

export const registerAPI = (userData) => {
  return instance.post('/auth/register', userData);
};

export const loginAPI = (userData) => {
  return instance.post('/auth/login', userData);
};

export const logoutAPI = () => {
  const refreshToken = getToken('refreshToken');
  return instance.post('/auth/logout', { token: refreshToken });
};

export const refreshTokenAPI = () => {
  const refreshToken = getToken('refreshToken');
  return instance.post('/auth/token', { token: refreshToken });
};

export const getUserAPI = () => {
  return instance.get('/auth/user', { requiresAuth: true });
};

export const updateUserAPI = (userData) => {
  return instance.patch('/auth/user', userData, { requiresAuth: true });
};
