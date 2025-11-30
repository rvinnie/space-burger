import { nanoid } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ingredientDetailsSlice, setIngredient } from './ingredient-details';
import { mockIngredient } from './mocks/ingredient';

import type { TIngredient } from '@/shared/types/ingredient';

vi.mock('@reduxjs/toolkit', async () => {
  const actual = await vi.importActual('@reduxjs/toolkit');
  return {
    ...(actual as object),
    nanoid: vi.fn(),
  };
});

const mockNanoid = vi.mocked(nanoid);

describe('ingredient-details slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(ingredientDetailsSlice.reducer(undefined, { type: '' })).toEqual(
        ingredientDetailsSlice.getInitialState()
      );
    });

    it('should handle setIngredient action with prepared payload', () => {
      const mockExtraId = 'test-extra-id';
      mockNanoid.mockReturnValue(mockExtraId);

      const action = setIngredient(mockIngredient);
      const state = ingredientDetailsSlice.reducer(undefined, action);

      expect(state).toEqual({
        ingredient: {
          ...mockIngredient,
          extraId: mockExtraId,
        },
      });
      expect(mockNanoid).toHaveBeenCalledOnce();
    });

    it('should handle multiple setIngredient actions', () => {
      const mockExtraId1 = 'test-extra-id-1';
      const mockExtraId2 = 'test-extra-id-2';
      mockNanoid.mockReturnValueOnce(mockExtraId1).mockReturnValueOnce(mockExtraId2);

      const secondIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'test-ingredient-id-2',
        name: 'Test Ingredient 2',
      };

      let state = ingredientDetailsSlice.reducer(
        undefined,
        setIngredient(mockIngredient)
      );
      expect(state.ingredient).toMatchObject({
        ...mockIngredient,
        extraId: mockExtraId1,
      });

      state = ingredientDetailsSlice.reducer(state, setIngredient(secondIngredient));
      expect(state.ingredient).toMatchObject({
        ...secondIngredient,
        extraId: mockExtraId2,
      });
    });
  });

  describe('selectors', () => {
    const mockStateWithIngredient = {
      ingredient: {
        ...mockIngredient,
        extraId: 'test-extra-id',
      },
    };

    const mockRootState = {
      'ingredient-details': mockStateWithIngredient,
    };

    it('should get ingredient', () => {
      expect(ingredientDetailsSlice.selectors.getIngredient(mockRootState)).toBe(
        mockStateWithIngredient.ingredient
      );
    });

    it('should handle default values in selectors', () => {
      const emptyState = {
        'ingredient-details': {
          ...ingredientDetailsSlice.getInitialState(),
        },
      };

      expect(ingredientDetailsSlice.selectors.getIngredient(emptyState)).toBe(null);
    });
  });

  describe('actions', () => {
    it('should create setIngredient action with prepared payload', () => {
      const mockExtraId = 'test-extra-id';
      mockNanoid.mockReturnValue(mockExtraId);

      const action = setIngredient(mockIngredient);

      expect(action).toEqual({
        type: 'ingredient-details/setIngredient',
        payload: {
          ...mockIngredient,
          extraId: mockExtraId,
        },
      });
    });
  });

  describe('ingredient details flow', () => {
    it('should handle setting and replacing ingredient', () => {
      const mockExtraId1 = 'test-extra-id-1';
      const mockExtraId2 = 'test-extra-id-2';
      mockNanoid.mockReturnValueOnce(mockExtraId1).mockReturnValueOnce(mockExtraId2);

      let state = ingredientDetailsSlice.reducer(undefined, { type: '' });
      expect(state.ingredient).toBe(null);

      state = ingredientDetailsSlice.reducer(state, setIngredient(mockIngredient));
      expect(state.ingredient).toMatchObject({
        ...mockIngredient,
        extraId: mockExtraId1,
      });

      const newIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'new-ingredient-id',
        name: 'New Ingredient',
      };

      state = ingredientDetailsSlice.reducer(state, setIngredient(newIngredient));
      expect(state.ingredient).toMatchObject({
        ...newIngredient,
        extraId: mockExtraId2,
      });
    });
  });
});
