import { mockIngredient } from './ingredient';

import type {
  TCreateOrderResponse,
  TFoundOrderResponse,
  TOrderOwner,
} from '@/api/types';

const mockOrderOwner: TOrderOwner = {
  name: 'Test User',
  email: 'test@test.com',
  createdAt: '2025-11-29T00:00:00.000Z',
  updatedAt: '2025-11-29T00:00:00.000Z',
};

export const mockCreateOrderResponse: TCreateOrderResponse = {
  success: true,
  name: 'Test Burger',
  order: {
    number: 12345,
    ingredients: [mockIngredient],
    _id: 'test-order-id',
    status: 'done',
    name: 'Test Burger',
    createdAt: '2025-11-29T00:00:00.000Z',
    updatedAt: '2025-11-29T00:00:00.000Z',
    owner: mockOrderOwner,
    price: 555,
  },
};

export const mockFoundOrderResponse: TFoundOrderResponse = {
  success: true,
  orders: [
    {
      _id: 'test-found-order-id',
      ingredients: [mockIngredient._id],
      status: 'done',
      name: 'Found Burger',
      number: 11111,
      createdAt: '2025-11-29T00:00:00.000Z',
      updatedAt: '2025-11-29T00:00:00.000Z',
      owner: 'test-owner-id',
    },
  ],
  total: 100,
  totalToday: 10,
};
