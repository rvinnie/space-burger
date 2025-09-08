import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './constructor-element-container.module.css';

export const ConstructorElementContainer = ({ ingredient, ingredientType }) => {
  let bunDescription = '';
  if (ingredientType === 'top') {
    bunDescription = ' (верх)';
  } else if (ingredientType === 'bottom') {
    bunDescription = ' (низ)';
  }

  return (
    <section className={`${styles.constructor_element_container}`}>
      {ingredient.type !== 'bun' && (
        <DragIcon className={`${styles.constructor_drag}`} type="primary" />
      )}
      <ConstructorElement
        isLocked={ingredient.type === 'bun'}
        price={ingredient.price}
        text={ingredient.name + bunDescription}
        thumbnail={ingredient.image}
        type={ingredientType}
        extraClass={`${styles.constructor_element}`}
      />
    </section>
  );
};
