import { addIngredient, setBun } from '@/services/burder-constructor';
import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch } from 'react-redux';

import { setIngredient } from '@services/ingredient-details';

import styles from './ingredient-item.module.css';

export const IngredientItem = ({ ingredientInfo, ingredientSelectedCount }) => {
  const dispatch = useDispatch();

  const onClickIngredient = () => {
    dispatch(setIngredient(ingredientInfo));

    if (ingredientInfo.type === 'bun') {
      dispatch(setBun(ingredientInfo));
    } else {
      dispatch(addIngredient(ingredientInfo));
    }
  };

  return (
    <section className={`${styles.ingredient_item}`} onClick={onClickIngredient}>
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
