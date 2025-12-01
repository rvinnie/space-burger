import { getIngredientsAPI } from '@/api/space-api';
import { describe, it, expect, vi } from 'vitest';

import { burgerIngredientsSlice, loadIngredients } from './burger-ingredients';
import { mockIngredient } from './mocks/ingredient';
import { createMockAxiosResponse } from './mocks/utils';

import type { TIngredientsResponse } from '@/api/types';

vi.mock('@/api/space-api', () => ({
  getIngredientsAPI: vi.fn(),
}));

const mockGetIngredientsAPI = vi.mocked(getIngredientsAPI);

const mockIngredientsResponse: TIngredientsResponse = {
  success: true,
  data: [mockIngredient],
};

describe('burger-ingredients slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(burgerIngredientsSlice.reducer(undefined, { type: '' })).toEqual(
        burgerIngredientsSlice.getInitialState()
      );
    });

    it('should handle loadIngredients.pending', () => {
      const state = burgerIngredientsSlice.reducer(
        undefined,
        loadIngredients.pending('')
      );

      expect(state).toEqual(burgerIngredientsSlice.getInitialState());
    });

    it('should handle loadIngredients.fulfilled', () => {
      const state = burgerIngredientsSlice.reducer(
        undefined,
        loadIngredients.fulfilled(mockIngredientsResponse, '')
      );

      expect(state).toEqual({
        ...burgerIngredientsSlice.getInitialState(),
        ingredients: mockIngredientsResponse,
        ingredientsMap: {
          'test-ingredient-id': mockIngredient,
        },
        loading: false,
      });
    });

    it('should handle loadIngredients.rejected', () => {
      const errorMessage = 'Failed to load ingredients';
      const state = burgerIngredientsSlice.reducer(
        undefined,
        loadIngredients.rejected(new Error(errorMessage), '')
      );

      expect(state).toEqual({
        ...burgerIngredientsSlice.getInitialState(),
        loading: false,
        error: errorMessage,
      });
    });

    it('should handle loadIngredients.rejected with unknown error', () => {
      const rejectedAction = {
        type: loadIngredients.rejected.type,
        error: { message: undefined, name: 'Error', stack: undefined },
      };

      const state = burgerIngredientsSlice.reducer(undefined, rejectedAction);

      expect(state).toEqual({
        ...burgerIngredientsSlice.getInitialState(),
        loading: false,
        error: 'Unknown error',
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      ingredients: mockIngredientsResponse,
      ingredientsMap: {
        'test-ingredient-id': mockIngredient,
      },
      loading: false,
      error: null,
    };

    const mockRootState = {
      'burger-ingredients': mockState,
    };

    it('should get ingredients', () => {
      expect(burgerIngredientsSlice.selectors.getIngredients(mockRootState)).toBe(
        mockIngredientsResponse
      );
    });

    it('should get ingredients map', () => {
      expect(burgerIngredientsSlice.selectors.getIngredientsMap(mockRootState)).toEqual({
        'test-ingredient-id': mockIngredient,
      });
    });

    it('should get ingredients loading', () => {
      expect(burgerIngredientsSlice.selectors.getIngredientsLoading(mockRootState)).toBe(
        false
      );
    });

    it('should get ingredients error', () => {
      expect(burgerIngredientsSlice.selectors.getIngredientsError(mockRootState)).toBe(
        null
      );
    });

    it('should handle default values in selectors', () => {
      const emptyState = {
        'burger-ingredients': {
          ...burgerIngredientsSlice.getInitialState(),
        },
      };

      expect(burgerIngredientsSlice.selectors.getIngredients(emptyState)).toBe(null);
      expect(burgerIngredientsSlice.selectors.getIngredientsMap(emptyState)).toEqual({});
      expect(burgerIngredientsSlice.selectors.getIngredientsLoading(emptyState)).toBe(
        true
      );
      expect(burgerIngredientsSlice.selectors.getIngredientsError(emptyState)).toBe(
        null
      );
    });
  });

  describe('load ingredients request', () => {
    it('should dispatch pending and fulfilled actions', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      mockGetIngredientsAPI.mockResolvedValueOnce(
        createMockAxiosResponse(mockIngredientsResponse)
      );

      await loadIngredients()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: loadIngredients.pending.type,
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: loadIngredients.fulfilled.type,
          payload: mockIngredientsResponse,
        })
      );
    });

    it('should dispatch pending and rejected actions', async () => {
      const dispatch = vi.fn();
      const getState = vi.fn();

      const errorMessage = 'error';
      mockGetIngredientsAPI.mockRejectedValueOnce(new Error(errorMessage));

      await loadIngredients()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: loadIngredients.pending.type,
        })
      );

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: loadIngredients.rejected.type,
          error: expect.objectContaining({
            message: errorMessage,
          }),
        })
      );
    });
  });

  describe('burger ingredients flow', () => {
    it('should handle complete ingredients loading flow', () => {
      let state = burgerIngredientsSlice.reducer(undefined, loadIngredients.pending(''));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      state = burgerIngredientsSlice.reducer(
        state,
        loadIngredients.fulfilled(mockIngredientsResponse, '')
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.ingredients).toBe(mockIngredientsResponse);
      expect(state.ingredientsMap).toEqual({
        'test-ingredient-id': mockIngredient,
      });

      const multipleIngredientsResponse: TIngredientsResponse = {
        success: true,
        data: [
          mockIngredient,
          { ...mockIngredient, _id: 'test-ingredient-id-2', name: 'Test Ingredient 2' },
        ],
      };

      state = burgerIngredientsSlice.reducer(
        undefined,
        loadIngredients.fulfilled(multipleIngredientsResponse, '')
      );

      expect(state.ingredientsMap).toEqual({
        'test-ingredient-id': mockIngredient,
        'test-ingredient-id-2': {
          ...mockIngredient,
          _id: 'test-ingredient-id-2',
          name: 'Test Ingredient 2',
        },
      });
    });

    it('should handle error flow', () => {
      let state = burgerIngredientsSlice.reducer(undefined, loadIngredients.pending(''));

      expect(state.loading).toBe(true);

      const errorMessage = 'Failed to fetch';
      state = burgerIngredientsSlice.reducer(
        state,
        loadIngredients.rejected(new Error(errorMessage), '')
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toBe(null);
      expect(state.ingredientsMap).toEqual({});
    });
  });
});
