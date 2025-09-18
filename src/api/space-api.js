import axios from 'axios';

const API_SPACE_INGREDIENTS_URL = 'https://norma.nomoreparties.space/api/ingredients';
const API_SPACE_ORDERS_URL = 'https://norma.nomoreparties.space/api/orders';

export const getIngredientsAPI = () => {
  return axios.get(API_SPACE_INGREDIENTS_URL);
};

export const createOrderAPI = (ingredients) => {
  return axios.post(API_SPACE_ORDERS_URL, { ingredients });
};
