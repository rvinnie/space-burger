import { getIngredients } from '@/services/burger-ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { PfcElement } from './pfc-element/pfc-element';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const params = useParams();

  const ingredients = useSelector(getIngredients);

  // @ts-expect-error "sprint-5"
  if (!ingredients?.data) {
    return <Preloader />;
  }

  // @ts-expect-error "sprint-5"
  const ingredient = ingredients.data.find((ingredient) => ingredient._id === params.id);

  if (!ingredient) {
    return (
      <div className="text text_type_main-medium mt-5">Ингредиент не найден...</div>
    );
  }

  return (
    <section className={`${styles.ingredient_details}`}>
      <img className={'mb-4'} src={ingredient.image_large} alt={ingredient.name} />
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
