import { createOrderAPI, findOrderAPI } from '@/api/space-api';
import { describe, it, expect, vi } from 'vitest';

import { mockConstructorIngredient } from './mocks/ingredient';
import { mockCreateOrderResponse, mockFoundOrderResponse } from './mocks/order';
import { createMockAxiosResponse } from './mocks/utils';
import {
  clearOrderDetails,
  createOrder,
  findOrder,
  orderDetailsSlice,
} from './order-details';

import type { TConstructorIngredient } from '@/shared/types/ingredient';

vi.mock('@/api/space-api', () => ({
  createOrderAPI: vi.fn(),
  findOrderAPI: vi.fn(),
}));

const mockCreateOrderAPI = vi.mocked(createOrderAPI);
const mockFindOrderAPI = vi.mocked(findOrderAPI);

describe('order-details slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(orderDetailsSlice.reducer(undefined, { type: '' })).toEqual(
        orderDetailsSlice.getInitialState()
      );
    });

    describe('createOrder', () => {
      it('should handle createOrder.pending', () => {
        const state = orderDetailsSlice.reducer(undefined, createOrder.pending('', []));

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          createLoading: true,
          createError: null,
        });
      });

      it('should handle createOrder.fulfilled', () => {
        const state = orderDetailsSlice.reducer(
          undefined,
          createOrder.fulfilled(mockCreateOrderResponse, '', [])
        );

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          createdOrder: mockCreateOrderResponse,
          createLoading: false,
          createError: null,
        });
      });

      it('should handle createOrder.rejected with error message', () => {
        const errorMessage = 'Failed to create order';
        const state = orderDetailsSlice.reducer(
          undefined,
          createOrder.rejected(new Error(errorMessage), '', [])
        );

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          createdOrder: null,
          createLoading: false,
          createError: errorMessage,
        });
      });

      it('should handle createOrder.rejected with unknown error', () => {
        const rejectedAction = {
          type: createOrder.rejected.type,
          error: { message: undefined, name: 'Error', stack: undefined },
        };

        const state = orderDetailsSlice.reducer(undefined, rejectedAction);

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          createdOrder: null,
          createLoading: false,
          createError: 'Unknown error',
        });
      });
    });

    describe('findOrder', () => {
      it('should handle findOrder.pending', () => {
        const state = orderDetailsSlice.reducer(undefined, findOrder.pending('', ''));

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          findLoading: true,
          findError: null,
        });
      });

      it('should handle findOrder.fulfilled', () => {
        const state = orderDetailsSlice.reducer(
          undefined,
          findOrder.fulfilled(mockFoundOrderResponse, '', '12345')
        );

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          foundOrder: mockFoundOrderResponse,
          findLoading: false,
          findError: null,
        });
      });

      it('should handle findOrder.rejected with error message', () => {
        const errorMessage = 'Failed to find order';
        const state = orderDetailsSlice.reducer(
          undefined,
          findOrder.rejected(new Error(errorMessage), '', '12345')
        );

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          foundOrder: null,
          findLoading: false,
          findError: errorMessage,
        });
      });

      it('should handle findOrder.rejected with unknown error', () => {
        const rejectedAction = {
          type: findOrder.rejected.type,
          error: { message: undefined, name: 'Error', stack: undefined },
        };

        const state = orderDetailsSlice.reducer(undefined, rejectedAction);

        expect(state).toEqual({
          ...orderDetailsSlice.getInitialState(),
          foundOrder: null,
          findLoading: false,
          findError: 'Unknown error',
        });
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      createdOrder: mockCreateOrderResponse,
      createLoading: false,
      createError: null,
      foundOrder: mockFoundOrderResponse,
      findLoading: false,
      findError: null,
    };

    const mockRootState = {
      'order-details': mockState,
    };

    it('should get created order details', () => {
      expect(orderDetailsSlice.selectors.getCreatedOrderDetails(mockRootState)).toBe(
        mockCreateOrderResponse
      );
    });

    it('should get create order details loading', () => {
      expect(
        orderDetailsSlice.selectors.getCreateOrderDetailsLoading(mockRootState)
      ).toBe(false);
    });

    it('should get create order details error', () => {
      expect(orderDetailsSlice.selectors.getCreateOrderDetailsError(mockRootState)).toBe(
        null
      );
    });

    it('should get found order details', () => {
      expect(orderDetailsSlice.selectors.getFoundOrderDetails(mockRootState)).toBe(
        mockFoundOrderResponse
      );
    });

    it('should get find order details loading', () => {
      expect(orderDetailsSlice.selectors.getFindOrderDetailsLoading(mockRootState)).toBe(
        false
      );
    });

    it('should get find order details error', () => {
      expect(orderDetailsSlice.selectors.getFindOrderDetailsError(mockRootState)).toBe(
        null
      );
    });

    it('should handle default values in selectors', () => {
      const emptyState = {
        'order-details': {
          ...orderDetailsSlice.getInitialState(),
        },
      };

      expect(orderDetailsSlice.selectors.getCreatedOrderDetails(emptyState)).toBe(null);
      expect(orderDetailsSlice.selectors.getCreateOrderDetailsLoading(emptyState)).toBe(
        false
      );
      expect(orderDetailsSlice.selectors.getCreateOrderDetailsError(emptyState)).toBe(
        null
      );
      expect(orderDetailsSlice.selectors.getFoundOrderDetails(emptyState)).toBe(null);
      expect(orderDetailsSlice.selectors.getFindOrderDetailsLoading(emptyState)).toBe(
        false
      );
      expect(orderDetailsSlice.selectors.getFindOrderDetailsError(emptyState)).toBe(
        null
      );
    });
  });

  describe('actions', () => {
    it('should create clearOrderDetails action', () => {
      expect(clearOrderDetails()).toEqual({
        type: 'order-details/clearOrderDetails',
      });
    });
  });

  describe('order details flow', () => {
    it('should handle complete order creation flow', () => {
      let state = orderDetailsSlice.reducer(undefined, createOrder.pending('', []));
      expect(state.createLoading).toBe(true);
      expect(state.createError).toBe(null);

      state = orderDetailsSlice.reducer(
        state,
        createOrder.fulfilled(mockCreateOrderResponse, '', [])
      );
      expect(state.createLoading).toBe(false);
      expect(state.createdOrder).toBe(mockCreateOrderResponse);

      state = orderDetailsSlice.reducer(state, clearOrderDetails());
      expect(state.createdOrder).toBe(null);
      expect(state.createError).toBe(null);
    });

    it('should handle complete order finding flow', () => {
      let state = orderDetailsSlice.reducer(undefined, findOrder.pending('', '12345'));
      expect(state.findLoading).toBe(true);
      expect(state.findError).toBe(null);

      state = orderDetailsSlice.reducer(
        state,
        findOrder.fulfilled(mockFoundOrderResponse, '', '12345')
      );
      expect(state.findLoading).toBe(false);
      expect(state.foundOrder).toBe(mockFoundOrderResponse);
    });

    it('should handle error flow for createOrder', () => {
      let state = orderDetailsSlice.reducer(undefined, createOrder.pending('', []));
      expect(state.createLoading).toBe(true);

      const errorMessage = 'Failed to create order';
      state = orderDetailsSlice.reducer(
        state,
        createOrder.rejected(new Error(errorMessage), '', [])
      );
      expect(state.createLoading).toBe(false);
      expect(state.createdOrder).toBe(null);
      expect(state.createError).toBe(errorMessage);
    });

    it('should handle error flow for findOrder', () => {
      let state = orderDetailsSlice.reducer(undefined, findOrder.pending('', '12345'));
      expect(state.findLoading).toBe(true);

      const errorMessage = 'Failed to find order';
      state = orderDetailsSlice.reducer(
        state,
        findOrder.rejected(new Error(errorMessage), '', '12345')
      );
      expect(state.findLoading).toBe(false);
      expect(state.foundOrder).toBe(null);
      expect(state.findError).toBe(errorMessage);
    });

    it('should dispatch createOrder actions on successful', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const ingredients = [mockConstructorIngredient];

      mockCreateOrderAPI.mockResolvedValueOnce(
        createMockAxiosResponse(mockCreateOrderResponse)
      );

      await createOrder(ingredients)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: createOrder.pending.type,
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: createOrder.fulfilled.type,
          payload: mockCreateOrderResponse,
        })
      );
    });

    it('should dispatch findOrder actions on successful', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const orderNum = '12345';

      mockFindOrderAPI.mockResolvedValueOnce(
        createMockAxiosResponse(mockFoundOrderResponse)
      );

      await findOrder(orderNum)(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: findOrder.pending.type,
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: findOrder.fulfilled.type,
          payload: mockFoundOrderResponse,
        })
      );
    });

    it('should filter out null ingredients in createOrder', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();
      const ingredients = [
        mockConstructorIngredient,
        null,
        undefined,
      ] as TConstructorIngredient[];

      mockCreateOrderAPI.mockResolvedValueOnce(
        createMockAxiosResponse(mockCreateOrderResponse)
      );

      await createOrder(ingredients)(dispatch, getState, undefined);

      expect(mockCreateOrderAPI).toHaveBeenCalledWith([mockConstructorIngredient]);
    });
  });
});
