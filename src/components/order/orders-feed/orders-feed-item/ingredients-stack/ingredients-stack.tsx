import type { TIngredient } from '@/shared/types/ingredient';

import styles from './ingredients-stack.module.css';

type IngredientsStackProps = {
  ingredients: TIngredient[];
  extraCount: number;
};

export const IngredientsStack = ({
  ingredients,
  extraCount,
}: IngredientsStackProps): React.JSX.Element => {
  return (
    <section className={`${styles.stack}`}>
      {ingredients?.map((ingredient, index) => (
        <div
          className={`${styles.ingredient_img} p-6 ${index === 5 && extraCount > 0 ? styles.darkened : ''}`}
          style={{ '--index': index } as React.CSSProperties}
          key={`${ingredient._id}-${index}`}
        >
          <img src={ingredient.image_mobile} alt={ingredient.name} />
          {index === 5 && extraCount > 0 && (
            <div className={`${styles.ingredient_text} text_type_main-small`}>
              +{extraCount}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};
