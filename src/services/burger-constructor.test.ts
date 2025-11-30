import { nanoid } from '@reduxjs/toolkit';
import { describe, it, expect, vi } from 'vitest';

import {
  addIngredient,
  burgerConstructorSlice,
  clearIngredients,
  moveIngredients,
  removeIngredient,
  setBun,
} from './burger-constructor';
import { mockBun, mockConstructorIngredient, mockIngredient } from './mocks/ingredient';

vi.mock('@reduxjs/toolkit', async () => {
  const actual = await vi.importActual('@reduxjs/toolkit');
  return {
    ...(actual as object),
    nanoid: vi.fn(),
  };
});

const mockNanoid = vi.mocked(nanoid);

describe('burger-constructor slice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(burgerConstructorSlice.reducer(undefined, { type: '' })).toEqual(
        burgerConstructorSlice.getInitialState()
      );
    });

    it('should handle setBun action', () => {
      const state = burgerConstructorSlice.reducer(undefined, setBun(mockBun));

      expect(state).toEqual({
        ...burgerConstructorSlice.getInitialState(),
        bun: mockBun,
      });
    });

    it('should handle addIngredient action with prepared payload', () => {
      const mockId = 'test-add-element-id';
      mockNanoid.mockReturnValue(mockId);

      const action = addIngredient(mockIngredient);
      const state = burgerConstructorSlice.reducer(undefined, action);

      expect(state).toEqual({
        ...burgerConstructorSlice.getInitialState(),
        ingredients: [
          {
            ...mockIngredient,
            constructorElementId: mockId,
          },
        ],
      });
      expect(mockNanoid).toHaveBeenCalledOnce();
    });

    it('should handle removeIngredient action', () => {
      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        ingredients: [
          mockConstructorIngredient,
          {
            ...mockConstructorIngredient,
            constructorElementId: 'test-remove-element-id',
          },
        ],
      };

      const state = burgerConstructorSlice.reducer(
        initialState,
        removeIngredient('test-remove-element-id')
      );

      expect(state).toEqual({
        ...burgerConstructorSlice.getInitialState(),
        ingredients: [
          {
            ...mockConstructorIngredient,
            constructorElementId: 'test-ingredient-constructor-id',
          },
        ],
      });
    });

    it('should handle moveIngredients action', () => {
      const ingredients = [
        { ...mockConstructorIngredient, constructorElementId: '1' },
        { ...mockConstructorIngredient, constructorElementId: '2' },
        { ...mockConstructorIngredient, constructorElementId: '3' },
      ];

      const initialState = {
        ...burgerConstructorSlice.getInitialState(),
        ingredients,
      };

      const state = burgerConstructorSlice.reducer(
        initialState,
        moveIngredients({ dragIndex: 0, hoverIndex: 2 })
      );

      expect(state.ingredients.map((ing) => ing.constructorElementId)).toEqual([
        '2',
        '3',
        '1',
      ]);
    });

    it('should handle clearIngredients action', () => {
      const initialState = {
        bun: mockBun,
        ingredients: [mockConstructorIngredient, mockConstructorIngredient],
      };

      const state = burgerConstructorSlice.reducer(initialState, clearIngredients());

      expect(state).toEqual(burgerConstructorSlice.getInitialState());
    });
  });

  describe('selectors', () => {
    const mockRootState = {
      'burger-constructor': {
        bun: mockBun,
        ingredients: [mockConstructorIngredient],
      },
    };

    it('should get bun', () => {
      expect(burgerConstructorSlice.selectors.getBun(mockRootState)).toBe(mockBun);
    });

    it('should get constructor ingredients', () => {
      expect(
        burgerConstructorSlice.selectors.getConstructorIngredients(mockRootState)
      ).toEqual([mockConstructorIngredient]);
    });

    it('should handle default values in selectors', () => {
      const emptyState = {
        'burger-constructor': {
          bun: null,
          ingredients: [],
        },
      };

      expect(burgerConstructorSlice.selectors.getBun(emptyState)).toBe(null);
      expect(
        burgerConstructorSlice.selectors.getConstructorIngredients(emptyState)
      ).toEqual([]);
    });
  });

  describe('actions', () => {
    it('should create setBun action with payload', () => {
      expect(setBun(mockBun)).toEqual({
        type: 'burger-constructor/setBun',
        payload: mockBun,
      });
    });

    it('should create addIngredient action with prepared payload', () => {
      const mockId = 'test-id';
      mockNanoid.mockReturnValue(mockId);

      expect(addIngredient(mockIngredient)).toEqual({
        type: 'burger-constructor/addIngredient',
        payload: {
          ...mockIngredient,
          constructorElementId: mockId,
        },
      });
    });

    it('should create removeIngredient action with payload', () => {
      const constructorElementId = 'test-remove-id';

      expect(removeIngredient(constructorElementId)).toEqual({
        type: 'burger-constructor/removeIngredient',
        payload: constructorElementId,
      });
    });

    it('should create moveIngredients action with payload', () => {
      const payload = { dragIndex: 0, hoverIndex: 1 };

      expect(moveIngredients(payload)).toEqual({
        type: 'burger-constructor/moveIngredients',
        payload,
      });
    });

    it('should create clearIngredients action', () => {
      expect(clearIngredients()).toEqual({
        type: 'burger-constructor/clearIngredients',
      });
    });
  });

  describe('burger constructor flow', () => {
    it('should handle burger creating + clearing flows', () => {
      const mockId1 = 'test-id-1';
      const mockId2 = 'test-id-2';
      mockNanoid.mockReturnValueOnce(mockId1).mockReturnValueOnce(mockId2);

      let state = burgerConstructorSlice.reducer(undefined, setBun(mockBun));
      expect(state.bun).toEqual(mockBun);

      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].constructorElementId).toBe(mockId1);

      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));
      expect(state.ingredients).toHaveLength(2);

      state = burgerConstructorSlice.reducer(
        state,
        moveIngredients({ dragIndex: 0, hoverIndex: 1 })
      );
      expect(state.ingredients.map((ing) => ing.constructorElementId)).toEqual([
        mockId2,
        mockId1,
      ]);

      state = burgerConstructorSlice.reducer(state, removeIngredient(mockId1));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].constructorElementId).toBe(mockId2);

      state = burgerConstructorSlice.reducer(state, clearIngredients());
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
