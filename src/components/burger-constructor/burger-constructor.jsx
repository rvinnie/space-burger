import { ConstructorPrice } from '@/components/burger-constructor/constructor-price/constructor-price';

import { ConstructorElementContainer } from '@components/burger-constructor/constructor-element-container/constructor-element-container';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const bun = ingredients?.find((element) => {
    return element.type === 'bun';
  });

  const bodyIngredients = ingredients?.filter((element) => {
    return element.type !== 'bun';
  });

  return (
    <section className={`${styles.burger_constructor} ml-4`}>
      <section className={`${styles.constructor_container}`}>
        <ConstructorElementContainer ingredient={bun} ingredientType="top" />
        <div className={`${styles.constructor_body}`}>
          {bodyIngredients.map((ingredient) => (
            <ConstructorElementContainer ingredient={ingredient} key={ingredient._id} />
          ))}
        </div>
        <ConstructorElementContainer ingredient={bun} ingredientType="bottom" />
      </section>
      <ConstructorPrice price={610} />
    </section>
  );
};
