import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient-item.module.css';

export const IngredientItem = ({ ingredientInfo }) => {
  return (
    <section className={`${styles.item}`}>
      <div className={`${styles.price_container} pl-4 pr-4`}>
        <img className={'mb-1'} src={ingredientInfo.image}></img>
        <div className={`${styles.price} mb-1`}>
          <p className="text text_type_digits-default mr-1 mb-1">
            {ingredientInfo.price}
          </p>
          <CurrencyIcon type="primary" />
          {/* TODO: replace when developing counter logic */}
          {ingredientInfo._id === '60666c42cc7b410027a1a9b1' && (
            <Counter count={1} size="default" />
          )}
        </div>
      </div>
      <div className={'text text_type_main-default pb-6 pl-4 pr-4'}>
        {ingredientInfo.name}
      </div>
    </section>
  );
};
