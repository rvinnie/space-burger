import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient-item.module.css';

export const IngredientItem = ({
  ingredientInfo,
  updateIngredientId,
  ingredientSelectedCount,
}) => {
  return (
    <section
      className={`${styles.ingredient_item}`}
      onClick={() => updateIngredientId(ingredientInfo._id)}
    >
      <div className={`${styles.price_container} pl-4 pr-4`}>
        <img className={'mb-1'} src={ingredientInfo.image} />
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
