import { ConstructorPrice } from '@/components/burger-constructor/constructor-price/constructor-price';

import { ConstructorElementContainer } from '@components/burger-constructor/constructor-element-container/constructor-element-container';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  return (
    <section className={`${styles.burger_constructor} ml-4`}>
      <section className={`${styles.constructor_container}`}>
        <ConstructorElementContainer ingredient={ingredients[0]} ingredientType="top" />
        <div className={`${styles.constructor_body}`}>
          {ingredients.slice(1, 10).map((ingredient) => (
            <ConstructorElementContainer ingredient={ingredient} key={ingredient._id} />
          ))}
        </div>
        <ConstructorElementContainer
          ingredient={ingredients[0]}
          ingredientType="bottom"
        />
      </section>
      <ConstructorPrice price={610} />
    </section>
  );
};
