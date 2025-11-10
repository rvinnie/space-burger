import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { setIngredient } from '@services/ingredient-details';

import type { TIngredient } from '@/shared/types/ingredient';
import type { Ref } from 'react';

import styles from './ingredient-item.module.css';

type IngredientItemProps = {
  ingredientInfo: TIngredient;
  ingredientSelectedCount: number;
};

export const IngredientItem = ({
  ingredientInfo,
  ingredientSelectedCount,
}: IngredientItemProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const [, dragRef] = useDrag<TIngredient, void, unknown>({
    type: 'ingredient',
    item: ingredientInfo,
  });

  const onClickIngredient = (): void => {
    dispatch(setIngredient(ingredientInfo));
  };

  return (
    <section
      ref={dragRef as unknown as Ref<HTMLElement>}
      className={`${styles.ingredient_item}`}
      onClick={onClickIngredient}
    >
      <div className={`${styles.price_container} pl-4 pr-4`}>
        <img className={'mb-1'} src={ingredientInfo.image} alt={ingredientInfo.name} />
        <div className={`${styles.price} mb-1`}>
          <p className="text text_type_digits-default mr-1 mb-1">
            {ingredientInfo.price}
          </p>
          <CurrencyIcon type="primary" />
          {ingredientSelectedCount > 0 && (
            <Counter count={ingredientSelectedCount} size="default" />
          )}
        </div>
      </div>
      <div className={'text text_type_main-default pb-6 pl-4 pr-4'}>
        {ingredientInfo.name}
      </div>
    </section>
  );
};
