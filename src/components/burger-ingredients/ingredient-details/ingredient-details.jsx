import { PfcElement } from './pfc-element/pfc-element';

import styles from './ingredient-details.module.css';

export const IngredientDetails = ({ ingredient }) => {
  return (
    <section className={`${styles.ingredient_details}`}>
      <img className={'mb-4'} src={ingredient.image_large} />
      <div className="text text_type_main-medium mb-8">{ingredient.name}</div>
      <div className={`${styles.pfc_container} mb-5 pl-10 pr-10`}>
        <PfcElement title={'Калории, ккал'} value={ingredient.calories} />
        <PfcElement title={'Белки, г'} value={ingredient.proteins} />
        <PfcElement title={'Жиры, г'} value={ingredient.fat} />
        <PfcElement title={'Углеводы, г'} value={ingredient.carbohydrates} />
      </div>
    </section>
  );
};
