import type { TLoginRequest, TRegisterRequest, TUser } from '@/api/types';

export const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User',
};

export const mockLoginRequest: TLoginRequest = {
  email: 'test@example.com',
  password: 'password123',
};

export const mockRegisterRequest: TRegisterRequest = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};
