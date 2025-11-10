export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getToken = (name: string): string | null => {
  return localStorage.getItem(name);
};

export const isTokenExists = (): boolean => !!localStorage.getItem('accessToken');
