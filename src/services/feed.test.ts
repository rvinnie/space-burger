import { describe, it, expect } from 'vitest';

import {
  connectFeed,
  disconnectFeed,
  feedSlice,
  onConnectingFeed,
  onErrorFeed,
  onMessageFeed,
} from './feed';

import type { TFoundOrderResponse } from '@/api/types';

const mockOrderResponse: TFoundOrderResponse = {
  success: true,
  orders: [],
  total: 0,
  totalToday: 0,
};

describe('feed slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(feedSlice.reducer(undefined, { type: '' })).toEqual(
        feedSlice.getInitialState()
      );
    });

    it('should handle onErrorFeed action', () => {
      const errorMessage = 'Connection error';
      const state = feedSlice.reducer(undefined, onErrorFeed(errorMessage));

      expect(state).toEqual({
        ...feedSlice.getInitialState(),
        error: errorMessage,
      });
    });

    it('should handle onMessageFeed action', () => {
      const state = feedSlice.reducer(undefined, onMessageFeed(mockOrderResponse));

      expect(state).toEqual({
        ...feedSlice.getInitialState(),
        orders: mockOrderResponse,
      });
    });

    it('should handle onConnectingFeed action', () => {
      const state = feedSlice.reducer(undefined, onConnectingFeed());

      expect(state).toEqual({
        ...feedSlice.getInitialState(),
        isConnecting: true,
      });
    });
  });

  describe('selectors', () => {
    const mockRootState = {
      feed: {
        orders: mockOrderResponse,
        error: 'Test error',
        isConnecting: true,
      },
    };

    it('should get feed orders', () => {
      expect(feedSlice.selectors.getFeedOrders(mockRootState)).toBe(mockOrderResponse);
    });

    it('should get feed error', () => {
      expect(feedSlice.selectors.getFeedError(mockRootState)).toBe('Test error');
    });

    it('should get feed isConnecting', () => {
      expect(feedSlice.selectors.getFeedIsConnecting(mockRootState)).toBe(true);
    });
  });

  describe('actions', () => {
    it('should create connectFeed action', () => {
      const url = 'wss://localhost:3000';

      expect(connectFeed(url)).toEqual({
        type: 'feed/connect',
        payload: url,
      });
    });

    it('should create disconnectFeed action', () => {
      expect(disconnectFeed()).toEqual({
        type: 'feed/disconnect',
      });
    });

    it('should create onErrorFeed action', () => {
      const error = 'Error message';

      expect(onErrorFeed(error)).toEqual({
        type: 'feed/onerror',
        payload: error,
      });
    });

    it('should create onMessageFeed action', () => {
      expect(onMessageFeed(mockOrderResponse)).toEqual({
        type: 'feed/onmessage',
        payload: mockOrderResponse,
      });
    });

    it('should create onConnectingFeed action', () => {
      expect(onConnectingFeed()).toEqual({
        type: 'feed/onconnecting',
      });
    });
  });
});
