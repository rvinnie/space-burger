export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getToken = (name) => {
  return localStorage.getItem(name);
};

export const isTokenExists = () => !!localStorage.getItem('accessToken');
