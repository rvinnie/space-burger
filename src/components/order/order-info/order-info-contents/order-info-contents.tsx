import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@/shared/types/ingredient';

import styles from './order-info-contents.module.css';

type OrderInfoContentsProps = {
  ingredients: TIngredient[];
};

type IngredientCount = {
  ingredient: TIngredient;
  count: number;
};

export const OrderInfoContents = ({
  ingredients,
}: OrderInfoContentsProps): React.JSX.Element => {
  const ingredientCounts = useMemo((): IngredientCount[] => {
    const countMap = new Map<string, { ingredient: TIngredient; count: number }>();
    ingredients.forEach((ingredient) => {
      const existing = countMap.get(ingredient._id);
      if (existing) {
        existing.count += 1;
      } else {
        countMap.set(ingredient._id, {
          ingredient,
          count: 1,
        });
      }
    });

    return Array.from(countMap.values());
  }, [ingredients]);

  return (
    <section className={`${styles.scrollable_section}`}>
      {ingredientCounts.map(({ ingredient, count }) => (
        <div key={ingredient._id} className={`${styles.ingredient_row} pr-6`}>
          <div className={`${styles.left_content}`}>
            <div className={`${styles.ingredient_img} mr-4`}>
              <img src={ingredient.image_mobile} alt={ingredient.name} />
            </div>
            <div className={`text text_type_main-default mr-4`}>{ingredient.name}</div>
          </div>
          <div className={`${styles.price}`}>
            <p className="text text_type_digits-default mr-1">
              {count} x {ingredient.price}
            </p>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      ))}
    </section>
  );
};
