import styles from './ingredient-details-wrapper.module.css';

type IngredientDetailsWrapperProps = {
  children?: React.ReactNode;
};

export const IngredientDetailsWrapper = ({
  children,
}: IngredientDetailsWrapperProps): React.JSX.Element => {
  return (
    <section className={`${styles.ingredient_details_wrapper}`}>
      <div className="text_type_main-large">Детали ингредиента</div>
      {children}
    </section>
  );
};
