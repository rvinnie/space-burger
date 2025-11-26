import type { TFindOrder } from '@/api/types';
import type { TIngredient } from '@/shared/types/ingredient';

import styles from './utils.module.css';

export type TEnrichedOrder = TFindOrder & {
  ingredientsObjects: TIngredient[];
  orderPrice: number;
};

export const isValidOrderIngredients = (ingredients: TIngredient[]): boolean => {
  if (ingredients.length < 3) return false;

  const firstIngredient = ingredients[0];
  const lastIngredient = ingredients[ingredients.length - 1];

  if (
    firstIngredient.type !== 'bun' ||
    lastIngredient.type !== 'bun' ||
    firstIngredient._id != lastIngredient._id
  ) {
    return false;
  }

  const hasFilling = ingredients
    .slice(1, -1)
    .some((ingredient) => ingredient.type !== 'bun');

  return hasFilling;
};

export const enrichOrders = (
  orders: TFindOrder[],
  ingredientsMap: Record<string, TIngredient>
): TEnrichedOrder[] => {
  const enriched = orders
    .map((order) => {
      const ingredients = order.ingredients
        .map((id) => ingredientsMap[id])
        .filter((ingredient): ingredient is TIngredient => ingredient !== undefined);

      if (ingredients.length !== order.ingredients.length) {
        return null;
      }

      if (!isValidOrderIngredients(ingredients)) {
        return null;
      }

      const orderPrice = ingredients.reduce(
        (sum: number, ingredient: TIngredient) => sum + ingredient.price,
        0
      );

      return {
        ...order,
        ingredientsObjects: ingredients,
        orderPrice,
      };
    })
    .filter((order): order is TEnrichedOrder => order !== null);

  return enriched.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getStatusInfo = (status: string): { text: string; className: string } => {
  switch (status) {
    case 'created':
      return {
        text: 'Создан',
        className: '',
      };
    case 'pending':
      return {
        text: 'Готовится',
        className: '',
      };
    case 'done':
      return {
        text: 'Выполнен',
        className: styles.status_completed,
      };
    case 'canceled':
      return {
        text: 'Отменён',
        className: styles.status_canceled,
      };
    default:
      return {
        text: '',
        className: '',
      };
  }
};
