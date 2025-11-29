import { getIngredientsMap } from '@/services/burger-ingredients';
import { useSelector } from '@/services/store';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { getStatusInfo } from '../../utils/utils';
import { IngredientsStack } from './ingredients-stack/ingredients-stack';

import type { TFindOrder } from '@/api/types';
import type { TIngredient } from '@/shared/types/ingredient';

import styles from './orders-feed-item.module.css';

type OrdersFeedItemProps = {
  orderInfo: TFindOrder;
  withStatus?: boolean;
};

export const OrdersFeedItem = ({
  orderInfo,
  withStatus,
}: OrdersFeedItemProps): React.JSX.Element => {
  const ingredientsMap = useSelector(getIngredientsMap);

  const { ingredients, orderPrice } = useMemo(() => {
    const ingredientsList = orderInfo.ingredients
      .map((id) => ingredientsMap[id])
      .filter((ingredient): ingredient is TIngredient => ingredient !== undefined);

    const price = ingredientsList.reduce(
      (sum: number, ingredient: TIngredient) => sum + ingredient.price,
      0
    );

    return { ingredients: ingredientsList, orderPrice: price };
  }, [orderInfo.ingredients, ingredientsMap]);

  const statusInfo = getStatusInfo(orderInfo.status);

  return (
    <section className={`${styles.order_item} p-6`}>
      <div className={`${styles.order_number_date}`}>
        <div className="text text_type_digits-default">
          #{orderInfo.number.toString().padStart(6, '0')}
        </div>
        <FormattedDate
          className={`${styles.date} text text_type_main-default mb-6`}
          date={new Date(orderInfo.createdAt)}
        />
      </div>
      <div className="mb-6">
        <div className="text text_type_main-medium">{orderInfo.name}</div>
        {withStatus && (
          <div className={`text text_type_main-default mt-2 ${statusInfo.className}`}>
            {statusInfo.text}
          </div>
        )}
      </div>
      <div className={`${styles.order_ingredients_price} mb-6`}>
        <IngredientsStack
          ingredients={ingredients.slice(0, 6)}
          extraCount={ingredients.length - 6}
        />
        <div className={`${styles.price}`}>
          <p className="text text_type_digits-default mr-1 ml-6">{orderPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};
