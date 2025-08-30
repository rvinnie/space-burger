import { Tab } from '@krgaa/react-developer-burger-ui-components';

import { IngredientGroup } from '@components/burger-ingredients/ingredient-details/ingredient-details';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const groupFieldValuePairs = new Map([
    ['bun', 'Булки'],
    ['main', 'Начинки'],
    ['sauce', 'Соусы'],
  ]);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={true}
            onClick={() => {
              /* TODO */
            }}
          >
            {groupFieldValuePairs.get('bun')}
          </Tab>
          <Tab
            value="main"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            {groupFieldValuePairs.get('main')}
          </Tab>
          <Tab
            value="sauce"
            active={false}
            onClick={() => {
              /* TODO */
            }}
          >
            {groupFieldValuePairs.get('sauce')}
          </Tab>
        </ul>
      </nav>
      <section className={styles.burger_ingredients}>
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
