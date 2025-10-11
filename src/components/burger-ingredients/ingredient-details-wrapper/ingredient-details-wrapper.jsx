import styles from './ingredient-details-wrapper.module.css';

export const IngredientDetailsWrapper = ({ children }) => {
  return (
    <section className={`${styles.ingredient_details_wrapper}`}>
      <div className="text_type_main-large">Детали ингредиента</div>
      {children}
    </section>
  );
};
