import {
  getUserAPI,
  loginAPI,
  logoutAPI,
  registerAPI,
  updateUserAPI,
} from '@/api/space-api';
import { clearTokens, isTokenExists, setTokens } from '@/utils/token';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { mockLoginRequest, mockRegisterRequest, mockUser } from './mocks/user';
import { createMockAxiosResponse } from './mocks/utils';
import { loadUser, login, logout, register, updateUser, userSlice } from './user';

import type { TAuthResponse, TUser, TUserResponse, TMessageResponse } from '@/api/types';

vi.mock('@/api/space-api', () => ({
  getUserAPI: vi.fn(),
  loginAPI: vi.fn(),
  logoutAPI: vi.fn(),
  registerAPI: vi.fn(),
  updateUserAPI: vi.fn(),
}));

vi.mock('@/utils/token', () => ({
  clearTokens: vi.fn(),
  isTokenExists: vi.fn(),
  setTokens: vi.fn(),
}));

const mockGetUserAPI = vi.mocked(getUserAPI);
const mockLoginAPI = vi.mocked(loginAPI);
const mockLogoutAPI = vi.mocked(logoutAPI);
const mockRegisterAPI = vi.mocked(registerAPI);
const mockUpdateUserAPI = vi.mocked(updateUserAPI);
const mockClearTokens = vi.mocked(clearTokens);
const mockIsTokenExists = vi.mocked(isTokenExists);
const mockSetTokens = vi.mocked(setTokens);

const createMockAuthResponse = (user: TUser): TAuthResponse => ({
  success: true,
  user,
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
});

const createMockUserResponse = (user: TUser): TUserResponse => ({
  success: true,
  user,
});

const createMockMessageResponse = (message: string): TMessageResponse => ({
  success: true,
  message,
});

describe('user slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(userSlice.reducer(undefined, { type: '' })).toEqual(
        userSlice.getInitialState()
      );
    });

    describe('register', () => {
      it('should handle register.pending', () => {
        const state = userSlice.reducer(
          undefined,
          register.pending('', mockRegisterRequest)
        );
        expect(state.registerError).toBe(null);
      });

      it('should handle register.fulfilled', () => {
        const state = userSlice.reducer(
          undefined,
          register.fulfilled(mockUser, '', mockRegisterRequest)
        );
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.registerError).toBe(null);
      });

      it('should handle register.rejected', () => {
        const errorMessage = 'Registration failed';
        const state = userSlice.reducer(undefined, {
          type: register.rejected.type,
          payload: errorMessage,
          error: { message: errorMessage, name: 'Error' },
        });
        expect(state.registerError).toBe(errorMessage);
      });
    });

    describe('login', () => {
      it('should handle login.pending', () => {
        const state = userSlice.reducer(undefined, login.pending('', mockLoginRequest));
        expect(state.loginError).toBe(null);
      });

      it('should handle login.fulfilled', () => {
        const state = userSlice.reducer(
          undefined,
          login.fulfilled(mockUser, '', mockLoginRequest)
        );
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.loginError).toBe(null);
      });

      it('should handle login.rejected', () => {
        const errorMessage = 'Login failed';
        const state = userSlice.reducer(undefined, {
          type: login.rejected.type,
          payload: errorMessage,
          error: { message: errorMessage, name: 'Error' },
        });
        expect(state.loginError).toBe(errorMessage);
      });
    });

    describe('loadUser', () => {
      it('should handle loadUser.fulfilled', () => {
        const state = userSlice.reducer(undefined, loadUser.fulfilled(mockUser, ''));
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.isAuthChecked).toBe(true);
      });

      it('should handle loadUser.rejected', () => {
        const state = userSlice.reducer(
          undefined,
          loadUser.rejected(new Error('Load failed'), '')
        );
        expect(state.isAuthChecked).toBe(true);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBe(null);
      });
    });

    describe('updateUser', () => {
      it('should handle updateUser.fulfilled', () => {
        const updatedUser = { ...mockUser, name: 'Updated User' };
        const state = userSlice.reducer(
          { ...userSlice.getInitialState(), user: mockUser },
          updateUser.fulfilled(updatedUser, '', mockRegisterRequest)
        );
        expect(state.user).toEqual(updatedUser);
        expect(state.updateProfileError).toBe(null);
      });

      it('should handle updateUser.rejected', () => {
        const errorMessage = 'Update failed';
        const state = userSlice.reducer(undefined, {
          type: updateUser.rejected.type,
          payload: errorMessage,
          error: { message: errorMessage, name: 'Error' },
        });
        expect(state.updateProfileError).toBe(errorMessage);
      });
    });

    describe('logout', () => {
      it('should handle logout.fulfilled', () => {
        const initialState = {
          ...userSlice.getInitialState(),
          user: mockUser,
          isAuthenticated: true,
        };
        const state = userSlice.reducer(initialState, logout.fulfilled(undefined, ''));
        expect(state.user).toBe(null);
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      isAuthChecked: true,
      isAuthenticated: true,
      user: mockUser,
      loginError: null,
      updateProfileError: null,
      registerError: null,
    };

    const mockRootState = {
      user: mockState,
    };

    it('should get isAuthChecked', () => {
      expect(userSlice.selectors.getIsAuthChecked(mockRootState)).toBe(true);
    });

    it('should get isAuthenticated', () => {
      expect(userSlice.selectors.getIsAuthenticated(mockRootState)).toBe(true);
    });

    it('should get user', () => {
      expect(userSlice.selectors.getUser(mockRootState)).toBe(mockUser);
    });

    it('should get login error', () => {
      const errorState = {
        user: {
          ...mockState,
          loginError: 'Login error',
        },
      };
      expect(userSlice.selectors.getLoginError(errorState)).toBe('Login error');
    });

    it('should get register error', () => {
      const errorState = {
        user: {
          ...mockState,
          registerError: 'Register error',
        },
      };
      expect(userSlice.selectors.getRegisterError(errorState)).toBe('Register error');
    });

    it('should get update profile error', () => {
      const errorState = {
        user: {
          ...mockState,
          updateProfileError: 'Update error',
        },
      };
      expect(userSlice.selectors.getUpdateProfileError(errorState)).toBe('Update error');
    });

    it('should handle default values in selectors', () => {
      const emptyState = {
        user: {
          ...userSlice.getInitialState(),
        },
      };

      expect(userSlice.selectors.getIsAuthChecked(emptyState)).toBe(false);
      expect(userSlice.selectors.getIsAuthenticated(emptyState)).toBe(false);
      expect(userSlice.selectors.getUser(emptyState)).toBe(null);
      expect(userSlice.selectors.getLoginError(emptyState)).toBe(null);
      expect(userSlice.selectors.getRegisterError(emptyState)).toBe(null);
      expect(userSlice.selectors.getUpdateProfileError(emptyState)).toBe(null);
    });
  });

  describe('user authentication flow', () => {
    it('should handle complete authentication flow', () => {
      let state = userSlice.reducer(undefined, { type: '' });
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);

      state = userSlice.reducer(state, login.fulfilled(mockUser, '', mockLoginRequest));
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);

      const updatedUser = { ...mockUser, name: 'Updated Name' };
      state = userSlice.reducer(
        state,
        updateUser.fulfilled(updatedUser, '', mockRegisterRequest)
      );
      expect(state.user).toEqual(updatedUser);

      state = userSlice.reducer(state, logout.fulfilled(undefined, ''));
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
    });

    it('should handle error flow', () => {
      let state = userSlice.reducer(undefined, { type: '' });

      state = userSlice.reducer(state, {
        type: login.rejected.type,
        payload: 'Invalid credentials',
        error: { message: 'Invalid credentials', name: 'Error' },
      });
      expect(state.loginError).toBe('Invalid credentials');
      expect(state.isAuthenticated).toBe(false);

      state = userSlice.reducer(state, {
        type: register.rejected.type,
        payload: 'Email already exists',
        error: { message: 'Email already exists', name: 'Error' },
      });
      expect(state.registerError).toBe('Email already exists');

      state = userSlice.reducer(state, login.pending('', mockLoginRequest));
      expect(state.loginError).toBe(null);

      state = userSlice.reducer(state, register.pending('', mockRegisterRequest));
      expect(state.registerError).toBe(null);
    });

    describe('register', () => {
      it('should dispatch pending and fulfilled on successful registration', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockRegisterAPI.mockResolvedValueOnce(
          createMockAxiosResponse(createMockAuthResponse(mockUser))
        );

        await register(mockRegisterRequest)(dispatch, getState, undefined);

        expect(mockSetTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: register.fulfilled.type,
            payload: mockUser,
          })
        );
      });

      it('should dispatch pending and rejected on network error', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockRegisterAPI.mockRejectedValueOnce(new Error('Network error'));

        await register(mockRegisterRequest)(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: register.rejected.type,
            payload: 'Network error',
          })
        );
      });
    });

    describe('login', () => {
      it('should dispatch pending and fulfilled on successful login', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockLoginAPI.mockResolvedValueOnce(
          createMockAxiosResponse(createMockAuthResponse(mockUser))
        );

        await login(mockLoginRequest)(dispatch, getState, undefined);

        expect(mockSetTokens).toHaveBeenCalledWith('access-token', 'refresh-token');
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: login.fulfilled.type,
            payload: mockUser,
          })
        );
      });
    });

    describe('loadUser', () => {
      it('should dispatch pending and fulfilled on successful load', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockIsTokenExists.mockReturnValueOnce(true);
        mockGetUserAPI.mockResolvedValueOnce(
          createMockAxiosResponse(createMockUserResponse(mockUser))
        );

        await loadUser()(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: loadUser.fulfilled.type,
            payload: mockUser,
          })
        );
      });

      it('should dispatch pending and rejected when no token exists', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockIsTokenExists.mockReturnValueOnce(false);

        await loadUser()(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: loadUser.rejected.type,
            payload: 'No token available',
          })
        );
      });

      it('should clear tokens and dispatch rejected on API error', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockIsTokenExists.mockReturnValueOnce(true);
        mockGetUserAPI.mockRejectedValueOnce(new Error('Unauthorized'));

        await loadUser()(dispatch, getState, undefined);

        expect(mockClearTokens).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: loadUser.rejected.type,
            payload: 'Unauthorized',
          })
        );
      });
    });

    describe('logout', () => {
      it('should clear tokens and dispatch fulfilled on successful logout', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockLogoutAPI.mockResolvedValueOnce(
          createMockAxiosResponse(createMockMessageResponse('Logout successful'))
        );

        await logout()(dispatch, getState, undefined);

        expect(mockClearTokens).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: logout.fulfilled.type,
          })
        );
      });
    });

    describe('updateUser', () => {
      it('should dispatch pending and fulfilled on successful update', async () => {
        const dispatch = vi.fn();
        const getState = vi.fn();

        mockUpdateUserAPI.mockResolvedValueOnce(
          createMockAxiosResponse(createMockUserResponse(mockUser))
        );

        await updateUser(mockRegisterRequest)(dispatch, getState, undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: updateUser.fulfilled.type,
            payload: mockUser,
          })
        );
      });
    });
  });
});
