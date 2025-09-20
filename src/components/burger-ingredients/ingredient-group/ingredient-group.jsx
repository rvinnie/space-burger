import { forwardRef } from 'react';

import { IngredientItem } from '../ingredient-item/ingredient-item';

import styles from './ingredient-group.module.css';

export const IngredientGroup = forwardRef(
  ({ ingredients, groupName, ingredientsCounts }, ref) => {
    return (
      <section ref={ref} className={'pt-10'}>
        <h2 className={'text text_type_main-medium mb-6'}>{groupName}</h2>
        <div className={`${styles.group_list} pl-4`}>
          {ingredients?.map((ingredient) => (
            <IngredientItem
              className={styles.group_item}
              key={ingredient._id}
              ingredientInfo={ingredient}
              ingredientSelectedCount={ingredientsCounts[ingredient._id]}
            />
          ))}
        </div>
      </section>
    );
  }
);

IngredientGroup.displayName = 'IngredientGroup';
