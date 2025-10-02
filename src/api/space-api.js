import axios from 'axios';

const BASE_URL = 'https://norma.nomoreparties.space/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

export const getIngredientsAPI = () => {
  return instance.get('/ingredients');
};

export const createOrderAPI = (ingredients) => {
  return instance.post('/orders', { ingredients });
};
