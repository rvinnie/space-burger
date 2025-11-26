import { enrichOrders } from '@/components/order/utils/utils';
import { getIngredientsMap } from '@/services/burger-ingredients';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { TFindOrder } from '@/api/types';
import type { TEnrichedOrder } from '@/components/order/utils/utils';

export const useEnrichedOrders = (
  orders: TFindOrder[] | null
): TEnrichedOrder[] | null => {
  const ingredientsMap = useSelector(getIngredientsMap);

  return useMemo(() => {
    if (!orders || !ingredientsMap) {
      return null;
    }

    return enrichOrders(orders, ingredientsMap);
  }, [orders, ingredientsMap]);
};
