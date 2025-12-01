import type { TConstructorIngredient, TIngredient } from '@/shared/types/ingredient';

export const mockIngredient: TIngredient = {
  id: 1,
  _id: 'test-ingredient-id',
  name: 'Test Ingredient',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 555,
  image: 'test-image.png',
  image_mobile: 'test-image-mobile.png',
  image_large: 'test-image-large.png',
  __v: 0,
};

export const mockBun: TConstructorIngredient = {
  ...mockIngredient,
  _id: 'test-bun-id',
  name: 'Test Bun',
  type: 'bun',
  constructorElementId: 'test-bun-constructor-id',
};

export const mockConstructorIngredient: TConstructorIngredient = {
  ...mockIngredient,
  constructorElementId: 'test-ingredient-constructor-id',
};
