import {
  getUserAPI,
  loginAPI,
  logoutAPI,
  registerAPI,
  updateUserAPI,
} from '@/api/space-api';
import { clearTokens, isTokenExists, setTokens } from '@/utils/token';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginError: null,
  updateProfileError: null,
  registerError: null,
};

export const register = createAsyncThunk(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerAPI(data);

      if (!response?.data?.success) {
        return rejectWithValue(response.data);
      }

      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      return user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message || 'Unknown error occurred' });
      }
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginAPI(data);

      if (!response?.data?.success) {
        return rejectWithValue(response.data);
      }

      const { user, accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);

      return user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message || 'Unknown error occurred' });
      }
    }
  }
);

export const loadUser = createAsyncThunk('user/load', async (_, { rejectWithValue }) => {
  if (!isTokenExists()) {
    return rejectWithValue();
  }

  try {
    const response = await getUserAPI();

    if (!response?.data?.success) {
      return rejectWithValue(response.data);
    }

    return response.data.user;
  } catch (error) {
    clearTokens();
    if (error.response?.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: error.message || 'Unknown error occurred' });
    }
  }
});

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutAPI();

    if (!response?.data?.success) {
      return rejectWithValue(response.data);
    }

    clearTokens();
  } catch (error) {
    if (error.response?.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue({ message: error.message || 'Unknown error occurred' });
    }
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateUserAPI(data);

      if (!response?.data?.success) {
        return rejectWithValue(response.data);
      }

      return response.data.user;
    } catch (error) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message || 'Unknown error occurred' });
      }
    }
  }
);

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
        state.updateProfileError = action.payload;
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
        state.registerError =
          action.payload?.message || action.error?.message || 'Unknown error';
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
        state.loginError =
          action.payload?.message || action.error?.message || 'Unknown error';
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
