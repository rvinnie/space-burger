import { Tab } from '@krgaa/react-developer-burger-ui-components';

import { IngredientGroup } from '@components/burger-ingredients/ingredient-group/ingredient-group';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const groupFieldValuePairs = new Map([
    ['bun', 'Булки'],
    ['main', 'Начинки'],
    ['sauce', 'Соусы'],
  ]);

  return (
    <section className={`${styles.burger_ingredients}`}>
      <nav>
        <ul className={styles.menu}>
          {Array.from(groupFieldValuePairs).map(([fieldName, valueName]) => (
            <Tab
              key={fieldName}
              value={fieldName}
              active={true}
              onClick={() => {
                /* TODO */
              }}
            >
              {valueName}
            </Tab>
          ))}
        </ul>
      </nav>
      <section className={`${styles.ingredient_groups_container} pr-4`}>
        {Array.from(groupFieldValuePairs).map(([fieldName, valueName]) => (
          <IngredientGroup
            key={fieldName}
            groupName={valueName}
            ingredients={ingredients.filter(
              (ingredient) => ingredient.type === fieldName
            )}
          />
        ))}
      </section>
    </section>
  );
};
