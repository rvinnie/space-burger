import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { IngredientItem } from '../ingredient-item/ingredient-item';

import type { TIngredient } from '@/shared/types/ingredient';

import styles from './ingredient-group.module.css';

type IngredientGroupProps = {
  ingredients: TIngredient[] | undefined;
  groupName: string;
  ingredientsCounts: Record<string, number>;
};

export const IngredientGroup = forwardRef<HTMLDivElement, IngredientGroupProps>(
  ({ ingredients, groupName, ingredientsCounts }, ref): React.JSX.Element => {
    const location = useLocation();

    return (
      <section ref={ref} className={'pt-10'}>
        <h2 className={'text text_type_main-medium mb-6'}>{groupName}</h2>
        <div className={`${styles.group_list} pl-4`}>
          {ingredients?.map((ingredient) => (
            <Link
              style={{ textDecoration: 'none', color: 'inherit' }}
              key={ingredient._id}
              to={`/ingredients/${ingredient._id}`}
              state={{ backgroundLocation: location }}
            >
              <IngredientItem
                key={ingredient._id}
                ingredientInfo={ingredient}
                ingredientSelectedCount={ingredientsCounts[ingredient._id]}
              />
            </Link>
          ))}
        </div>
      </section>
    );
  }
);

IngredientGroup.displayName = 'IngredientGroup';
