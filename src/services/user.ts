import {
  getUserAPI,
  loginAPI,
  logoutAPI,
  registerAPI,
  updateUserAPI,
} from '@/api/space-api';
import { clearTokens, isTokenExists, setTokens } from '@/utils/token';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type {
  TApiError,
  TAxiosErrorWithApiResponse,
  TLoginRequest,
  TRegisterRequest,
  TUser,
} from '@/api/types';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  loginError: string | null;
  updateProfileError: string | null;
  registerError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginError: null,
  updateProfileError: null,
  registerError: null,
};

const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as TAxiosErrorWithApiResponse;
    return axiosError.response?.data?.message || 'Unknown error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error occurred';
};

const isApiError = (data: unknown): data is TApiError => {
  return typeof data === 'object' && data !== null && 'message' in data;
};

const getErrorMessage = (data: unknown): string => {
  if (isApiError(data)) {
    return data.message;
  }

  if (typeof data === 'string') {
    return data;
  }

  return 'Unknown error occurred';
};

export const register = createAsyncThunk<
  TUser,
  TRegisterRequest,
  { rejectValue: string }
>('user/register', async (data: TRegisterRequest, { rejectWithValue }) => {
  try {
    const response = await registerAPI(data);

    if (!response?.data?.success) {
      const errorMessage = getErrorMessage(response?.data);
      return rejectWithValue(errorMessage);
    }

    const { user, accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);

    return user;
  } catch (error) {
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk<TUser, TLoginRequest, { rejectValue: string }>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginAPI(data);

      if (!response?.data?.success) {
        const errorMessage = getErrorMessage(response?.data);
        return rejectWithValue(errorMessage);
      }

      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      return user;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const loadUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/load',
  async (_, { rejectWithValue }) => {
    if (!isTokenExists()) {
      return rejectWithValue('No token available');
    }

    try {
      const response = await getUserAPI();

      if (!response?.data?.success) {
        const errorMessage = getErrorMessage(response?.data);
        return rejectWithValue(errorMessage);
      }

      return response.data.user;
    } catch (error) {
      clearTokens();
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI();

      if (!response?.data?.success) {
        const errorMessage = getErrorMessage(response?.data);
        return rejectWithValue(errorMessage);
      }

      clearTokens();
    } catch (error) {
      const errorMessage = handleApiError(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  TRegisterRequest,
  { rejectValue: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserAPI(data);

    if (!response?.data?.success) {
      const errorMessage = getErrorMessage(response?.data);
      return rejectWithValue(errorMessage);
    }

    return response.data.user;
  } catch (error) {
    const errorMessage = handleApiError(error);
    return rejectWithValue(errorMessage);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getLoginError: (state) => state.loginError,
    getUpdateProfileError: (state) => state.updateProfileError,
    getRegisterError: (state) => state.registerError,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateProfileError = null;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateProfileError = action.payload || 'Unknown error occurred';
      })
      .addCase(register.pending, (state) => {
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.registerError = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerError = action.payload || 'Unknown error occurred';
      })
      .addCase(login.pending, (state) => {
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginError = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.payload || 'Unknown error occurred';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {
  getIsAuthChecked,
  getIsAuthenticated,
  getUser,
  getLoginError,
  getRegisterError,
  getUpdateProfileError,
} = userSlice.selectors;
