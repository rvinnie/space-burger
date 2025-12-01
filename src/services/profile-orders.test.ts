import { describe, it, expect } from 'vitest';

import { mockFoundOrderResponse } from './mocks/order';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  onConnectingProfileOrders,
  onErrorProfileOrders,
  onMessageProfileOrders,
  profileOrdersSlice,
} from './profile-orders';

describe('profile-orders slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(profileOrdersSlice.reducer(undefined, { type: '' })).toEqual(
        profileOrdersSlice.getInitialState()
      );
    });

    it('should handle onErrorProfileOrders action', () => {
      const errorMessage = 'Connection error';
      const state = profileOrdersSlice.reducer(
        undefined,
        onErrorProfileOrders(errorMessage)
      );

      expect(state).toEqual({
        ...profileOrdersSlice.getInitialState(),
        error: errorMessage,
        isConnecting: false,
      });
    });

    it('should handle onMessageProfileOrders action', () => {
      const state = profileOrdersSlice.reducer(
        undefined,
        onMessageProfileOrders(mockFoundOrderResponse)
      );

      expect(state).toEqual({
        ...profileOrdersSlice.getInitialState(),
        orders: mockFoundOrderResponse,
        isConnecting: false,
      });
    });

    it('should handle onConnectingProfileOrders action', () => {
      const state = profileOrdersSlice.reducer(undefined, onConnectingProfileOrders());

      expect(state).toEqual({
        ...profileOrdersSlice.getInitialState(),
        isConnecting: true,
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      orders: mockFoundOrderResponse,
      error: 'Test error',
      isConnecting: true,
    };

    const mockRootState = {
      'profile-orders': mockState,
    };

    it('should get profile orders', () => {
      expect(profileOrdersSlice.selectors.getProfileOrders(mockRootState)).toBe(
        mockFoundOrderResponse
      );
    });

    it('should get profile orders error', () => {
      expect(profileOrdersSlice.selectors.getProfileOrdersError(mockRootState)).toBe(
        'Test error'
      );
    });

    it('should get profile orders isConnecting', () => {
      expect(
        profileOrdersSlice.selectors.getProfileOrdersIsConnecting(mockRootState)
      ).toBe(true);
    });

    it('should handle default values in selectors', () => {
      const emptyState = {
        'profile-orders': {
          ...profileOrdersSlice.getInitialState(),
        },
      };

      expect(profileOrdersSlice.selectors.getProfileOrders(emptyState)).toBe(null);
      expect(profileOrdersSlice.selectors.getProfileOrdersError(emptyState)).toBe(null);
      expect(profileOrdersSlice.selectors.getProfileOrdersIsConnecting(emptyState)).toBe(
        false
      );
    });
  });

  describe('actions', () => {
    it('should create connectProfileOrders action with payload', () => {
      const url = 'wss://localhost:3000/orders';

      expect(connectProfileOrders(url)).toEqual({
        type: 'profile-orders/connect',
        payload: url,
      });
    });

    it('should create disconnectProfileOrders action', () => {
      expect(disconnectProfileOrders()).toEqual({
        type: 'profile-orders/disconnect',
      });
    });

    it('should create onErrorProfileOrders action with payload', () => {
      const error = 'Error message';

      expect(onErrorProfileOrders(error)).toEqual({
        type: 'profile-orders/onerror',
        payload: error,
      });
    });

    it('should create onMessageProfileOrders action with payload', () => {
      expect(onMessageProfileOrders(mockFoundOrderResponse)).toEqual({
        type: 'profile-orders/onmessage',
        payload: mockFoundOrderResponse,
      });
    });

    it('should create onConnectingProfileOrders action', () => {
      expect(onConnectingProfileOrders()).toEqual({
        type: 'profile-orders/onconnecting',
      });
    });
  });

  describe('profile orders flow', () => {
    it('should handle connecting -> message flow', () => {
      let state = profileOrdersSlice.reducer(undefined, onConnectingProfileOrders());
      expect(state.isConnecting).toBe(true);

      state = profileOrdersSlice.reducer(
        state,
        onMessageProfileOrders(mockFoundOrderResponse)
      );
      expect(state.isConnecting).toBe(false);
      expect(state.orders).toBe(mockFoundOrderResponse);
    });

    it('should handle connecting -> error flow', () => {
      let state = profileOrdersSlice.reducer(undefined, onConnectingProfileOrders());
      expect(state.isConnecting).toBe(true);

      const errorMessage = 'Connection failed';
      state = profileOrdersSlice.reducer(state, onErrorProfileOrders(errorMessage));
      expect(state.isConnecting).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle multiple state transitions', () => {
      let state = profileOrdersSlice.reducer(undefined, onConnectingProfileOrders());
      expect(state.isConnecting).toBe(true);
      expect(state.orders).toBe(null);
      expect(state.error).toBe(null);

      state = profileOrdersSlice.reducer(
        state,
        onMessageProfileOrders(mockFoundOrderResponse)
      );
      expect(state.isConnecting).toBe(false);
      expect(state.orders).toBe(mockFoundOrderResponse);
      expect(state.error).toBe(null);

      state = profileOrdersSlice.reducer(state, onConnectingProfileOrders());
      expect(state.isConnecting).toBe(true);
      expect(state.orders).toBe(mockFoundOrderResponse);
      expect(state.error).toBe(null);

      const errorMessage = 'Reconnection failed';
      state = profileOrdersSlice.reducer(state, onErrorProfileOrders(errorMessage));
      expect(state.isConnecting).toBe(false);
      expect(state.orders).toBe(mockFoundOrderResponse);
      expect(state.error).toBe(errorMessage);
    });
  });
});
